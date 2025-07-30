import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../helper/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { UserStatus } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken)
        throw new AppError(httpStatus.FORBIDDEN, "No token receive");

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });
      if (!isUserExist)
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist");

      //   if (!isUserExist.isVerified) {
      //     throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
      //   }

      if (
        isUserExist.status === UserStatus.INACTIVE ||
        isUserExist.status === UserStatus.BLOCKED
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.status}`
        );
      }

      if (isUserExist.isDeleted)
        throw new AppError(httpStatus.BAD_REQUEST, "User is delete");

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not permitted to view this route!"
        );
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      next(error);
    }
  };
