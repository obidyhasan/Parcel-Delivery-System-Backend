/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";

// const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {})

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User create successfully",
      data: user,
    });
  }
);

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);

    setAuthCookie(res, {
      accessToken: loginInfo.accessToken,
      refreshToken: loginInfo.refreshToken,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login successfully",
      data: loginInfo,
    });
  }
);

export const AuthControllers = {
  createUser,
  credentialsLogin,
};
