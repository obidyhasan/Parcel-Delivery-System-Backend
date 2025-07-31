/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";

// const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {})

const createParcelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelRequestInfo = await ParcelService.createParcelRequest(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel request create successfully",
      data: parcelRequestInfo,
    });
  }
);

const getParcelRequestByUserId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const allParcelRequest = await ParcelService.getParcelRequestByUserId(
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all parcel request successfully",
      data: allParcelRequest,
    });
  }
);

const setParcelRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const parcel = await ParcelService.setParcelRequestStatus(
      req.params.id,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Set parcel request status cancel successfully",
      data: parcel,
    });
  }
);

const updateParcelRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const parcel = await ParcelService.updateParcelRequest(
      req.params.id,
      req.body,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel request update successfully",
      data: parcel,
    });
  }
);

const getIncomingParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const incomingParcels = await ParcelService.getIncomingParcel(decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all parcel request successfully",
      data: incomingParcels,
    });
  }
);
const getDeliveryParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const getDeliveredParcel = await ParcelService.getDeliveryParcel(
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get delivered parcel successfully",
      data: getDeliveredParcel,
    });
  }
);

const setParcelRequestConfirm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const parcel = await ParcelService.setParcelRequestConfirm(
      req.params.id,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Set parcel request status confirm successfully",
      data: parcel,
    });
  }
);

const setParcelRequestDelivered = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const parcel = await ParcelService.setParcelRequestDelivered(
      req.params.id,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Set parcel request status delivered successfully",
      data: parcel,
    });
  }
);

const getAllParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const incomingParcels = await ParcelService.getAllParcel();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all parcel request successfully",
      data: incomingParcels,
    });
  }
);

const getParcelTracking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcelTracking = await ParcelService.getParcelTracking(
      req.params.trackingId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get parcel request tracking successfully",
      data: parcelTracking,
    });
  }
);

const updateParcelRequestByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedParcel = await ParcelService.updateParcelRequestByAdmin(
      req.params.id,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Update parcel request successfully",
      data: updatedParcel,
    });
  }
);

const deleteParcelRequestByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await ParcelService.deleteParcelRequestByAdmin(
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delete parcel request successfully",
      data: parcel,
    });
  }
);

export const ParcelController = {
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
