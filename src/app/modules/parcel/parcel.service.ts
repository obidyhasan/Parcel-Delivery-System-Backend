import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { IParcel, IParcelLog, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { getTrackingId } from "../../utils/getTrackingId";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";
import { Types } from "mongoose";

const createParcelRequest = async (payload: Partial<IParcel>) => {
  const isSenderExist = await User.findById(payload.senderId);
  if (!isSenderExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sender not exist. Please create a sender account."
    );

  const isReceiverExist = await User.findById(payload.receiverId);
  if (!isReceiverExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Receiver not exist. Please create a receiver account."
    );

  const isParcelRequestExist = await Parcel.findOne({
    title: payload.title,
    receiverId: payload.receiverId,
  });

  if (isParcelRequestExist)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Parcel request already exists!"
    );

  payload.trackingId = getTrackingId();

  const parcelLog: IParcelLog = {
    status: ParcelStatus.Pending,
    timestamp: new Date(),
    updateBy: payload.senderId as unknown as Types.ObjectId,
    note: "Parcel request successfully. Current status is Pending.",
  };

  payload.statusLogs = [parcelLog];

  const parcelRequest = await (
    await (
      await (
        await Parcel.create(payload)
      ).populate("senderId", "name email phone")
    ).populate("receiverId", "name email phone")
  ).populate("statusLogs.updateBy", "name email");

  return parcelRequest;
};

const getParcelRequestByUserId = async (decodedToken: JwtPayload) => {
  if (decodedToken.role === Role.SENDER) {
    const parcelsRequest = await Parcel.find({ senderId: decodedToken.userId })
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone")
      .populate("statusLogs.updateBy", "name email");
    return parcelsRequest;
  }

  if (decodedToken.role === Role.RECEIVER) {
    const parcelsRequest = await Parcel.find({
      receiverId: decodedToken.userId,
    })
      .populate("senderId", "name email phone")
      .populate("receiverId", "name email phone")
      .populate("statusLogs.updateBy", "name email");
    return parcelsRequest;
  }
};

const setParcelRequestStatus = async (
  parcelId: string,
  decodedToken: JwtPayload
) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  if (
    isParcelExist.currentStatus === ParcelStatus.Picked ||
    isParcelExist.currentStatus === ParcelStatus.InTransit ||
    isParcelExist.currentStatus === ParcelStatus.Delivered ||
    isParcelExist.currentStatus === ParcelStatus.Confirm
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't cancel this parcel. The Parcel already dispatched."
    );
  }

  const parcelLog: IParcelLog = {
    status: ParcelStatus.Cancelled,
    timestamp: new Date(),
    updateBy: decodedToken.userId,
    note: `Parcel updated successfully. Current status is ${ParcelStatus.Cancelled}.`,
  };

  const updateParcelLog = [
    ...(isParcelExist.statusLogs as IParcelLog[]),
    parcelLog,
  ];

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    { currentStatus: ParcelStatus.Cancelled, statusLogs: updateParcelLog },
    { new: true, validateRequest: true }
  )
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");

  return updatedParcel;
};

const updateParcelRequest = async (
  parcelId: string,
  payload: Partial<IParcel>,
  decodedToken: JwtPayload
) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  if (
    payload.currentStatus === ParcelStatus.Confirm ||
    payload.currentStatus === ParcelStatus.Delivered ||
    isParcelExist.currentStatus === ParcelStatus.Pending ||
    isParcelExist.currentStatus === ParcelStatus.Cancelled
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't change Parcel status to ${payload.currentStatus}. Because Parcel current status is ${isParcelExist.currentStatus}`
    );
  }

  const parcelLog: IParcelLog = {
    status: payload.currentStatus as ParcelStatus,
    timestamp: new Date(),
    updateBy: decodedToken.userId,
    note: `Parcel updated successfully. Current status is ${payload.currentStatus}.`,
  };

  payload.statusLogs = [
    ...(isParcelExist.statusLogs as IParcelLog[]),
    parcelLog,
  ];

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    payload,
    { new: true, validateRequest: true }
  )
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");

  return updatedParcel;
};

const getIncomingParcel = async (decodedToken: JwtPayload) => {
  const parcelsRequest = await Parcel.find({
    receiverId: decodedToken.userId,
    currentStatus: {
      $in: [
        ParcelStatus.Picked,
        ParcelStatus.InTransit,
        ParcelStatus.Pending,
        ParcelStatus.Confirm,
      ],
    },
  })
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");
  return parcelsRequest;
};

const getDeliveryParcel = async (decodedToken: JwtPayload) => {
  const deliveryParcel = await Parcel.find({
    receiverId: decodedToken.userId,
    currentStatus: ParcelStatus.Delivered,
  })
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");
  return deliveryParcel;
};

const setParcelRequestConfirm = async (
  parcelId: string,
  decodedToken: JwtPayload
) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  if (isParcelExist.currentStatus !== ParcelStatus.Pending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not set status confirm because it is already ${isParcelExist.currentStatus}.`
    );
  }

  const parcelLog: IParcelLog = {
    status: ParcelStatus.Confirm,
    timestamp: new Date(),
    updateBy: decodedToken.userId,
    note: `Parcel updated successfully. Current status is ${ParcelStatus.Confirm}.`,
  };

  const updateParcelStatusLog = [
    ...(isParcelExist.statusLogs as IParcelLog[]),
    parcelLog,
  ];

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    { currentStatus: ParcelStatus.Confirm, statusLogs: updateParcelStatusLog },
    { new: true, validateRequest: true }
  )
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");

  return updatedParcel;
};

const setParcelRequestDelivered = async (
  parcelId: string,
  decodedToken: JwtPayload
) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  if (isParcelExist.currentStatus !== ParcelStatus.InTransit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not set status delivered because it is ${isParcelExist.currentStatus}.`
    );
  }

  const parcelLog: IParcelLog = {
    status: ParcelStatus.Delivered,
    timestamp: new Date(),
    updateBy: decodedToken.userId,
    note: `Parcel updated successfully. Current status is ${ParcelStatus.Delivered}.`,
  };

  const updateParcelStatusLog = [
    ...(isParcelExist.statusLogs as IParcelLog[]),
    parcelLog,
  ];

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    {
      currentStatus: ParcelStatus.Delivered,
      statusLogs: updateParcelStatusLog,
    },
    { new: true, validateRequest: true }
  )
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");

  return updatedParcel;
};

const getAllParcel = async () => {
  const parcelsRequest = await Parcel.find({})
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");
  return parcelsRequest;
};

const getParcelTracking = async (trackingId: string) => {
  const isParcelExist = await Parcel.findOne({ trackingId })
    .select("statusLogs")
    .populate("statusLogs.updateBy", "name email");
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel does not exist");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  return isParcelExist;
};

const updateParcelRequestByAdmin = async (
  parcelId: string,
  payload: Partial<IParcel>
) => {
  const isParcelExist = await Parcel.findById({ _id: parcelId });

  if (!isParcelExist)
    throw new AppError(httpStatus.NOT_FOUND, "Parcel does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  const updateInfo = await Parcel.findByIdAndUpdate(
    { _id: parcelId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("senderId", "name email phone")
    .populate("receiverId", "name email phone")
    .populate("statusLogs.updateBy", "name email");

  return updateInfo;
};

const deleteParcelRequestByAdmin = async (parcelId: string) => {
  const isParcelExist = await Parcel.findById({ _id: parcelId });

  if (!isParcelExist)
    throw new AppError(httpStatus.NOT_FOUND, "Parcel does not exits");

  if (isParcelExist.isBlocked)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is blocked!");

  await Parcel.findByIdAndDelete({ _id: parcelId });
  return null;
};

export const ParcelService = {
  createParcelRequest,
  getParcelRequestByUserId,
  setParcelRequestStatus,
  updateParcelRequest,
  getIncomingParcel,
  getDeliveryParcel,
  setParcelRequestConfirm,
  setParcelRequestDelivered,
  getAllParcel,
  getParcelTracking,
  updateParcelRequestByAdmin,
  deleteParcelRequestByAdmin,
};
