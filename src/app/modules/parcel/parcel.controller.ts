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
    const parcel = await ParcelService.setParcelRequestStatus(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Set parcel request status cancel successfully",
      data: parcel,
    });
  }
);

export const ParcelController = {
  createParcelRequest,
  getParcelRequestByUserId,
  setParcelRequestStatus,
};
