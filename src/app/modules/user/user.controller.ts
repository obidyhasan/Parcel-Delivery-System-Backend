/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUser();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Get all users successfully",
      data: users,
    });
  }
);

export const UserController = {
  getAllUser,
};
