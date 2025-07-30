/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { IAuthProvider, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import { setAuthCookie } from "../../utils/setCookie";

// const createUser = async () => {}

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist");

  if (rest.role === Role.ADMIN)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can't register as an Admin"
    );

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  const { password: userPassword, ...restUser } = user.toObject();
  return restUser;
};

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    throw new AppError(httpStatus.NOT_FOUND, "Email does not exits");

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched)
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");

  const userToken = createUserTokens(isUserExist);

  const { password: userPassword, ...restUser } = isUserExist.toObject();

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: restUser,
  };
};

export const AuthService = {
  createUser,
  credentialsLogin,
};
