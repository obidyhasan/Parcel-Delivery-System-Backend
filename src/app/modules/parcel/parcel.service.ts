import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { getTrackingId } from "../../utils/getTrackingId";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../user/user.interface";

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

  const parcelRequest = await Parcel.create(payload);
  return parcelRequest;
};

const getParcelRequestByUserId = async (decodedToken: JwtPayload) => {
  if (decodedToken.role === Role.SENDER) {
    const parcelsRequest = await Parcel.find({ senderId: decodedToken.userId });
    return parcelsRequest;
  }

  if (decodedToken.role === Role.RECEIVER) {
    const parcelsRequest = await Parcel.find({
      receiverId: decodedToken.userId,
    });
    return parcelsRequest;
  }
};

const setParcelRequestStatus = async (parcelId: string) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    { currentStatus: ParcelStatus.Cancelled },
    { new: true, validateRequest: true }
  );

  return updatedParcel;
};

const getIncomingParcel = async (decodedToken: JwtPayload) => {
  const parcelsRequest = await Parcel.find({
    receiverId: decodedToken.userId,
    currentStatus: ParcelStatus.Dispatched,
  });
  return parcelsRequest;
};

const setParcelRequestConfirm = async (parcelId: string) => {
  const isParcelExist = await Parcel.findById(parcelId);
  if (!isParcelExist)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel request does not exits");

  if (isParcelExist.currentStatus !== ParcelStatus.Pending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can not set status confirm."
    );
  }

  const updatedParcel = await Parcel.findOneAndUpdate(
    { _id: parcelId },
    { currentStatus: ParcelStatus.CONFIRM },
    { new: true, validateRequest: true }
  );

  return updatedParcel;
};

const getAllParcel = async () => {
  const parcelsRequest = await Parcel.find({});
  return parcelsRequest;
};

export const ParcelService = {
  createParcelRequest,
  getParcelRequestByUserId,
  setParcelRequestStatus,
  getIncomingParcel,
  setParcelRequestConfirm,
  getAllParcel,
};
