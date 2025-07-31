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

const updateUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.updateUserByAdmin(req.params.id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Update user successfully",
      data: user,
    });
  }
);

const deleteUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.deleteUserByAdmin(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User delete successfully",
      data: user,
    });
  }
);

export const UserController = {
  getAllUser,
  updateUserByAdmin,
  deleteUserByAdmin,
};
