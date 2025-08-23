/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const users = await UserService.getAllUser(query as Record<string, string>);

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

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const users = await UserService.getMe(decodedToken);

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
  updateUserByAdmin,
  deleteUserByAdmin,
  getMe,
};
