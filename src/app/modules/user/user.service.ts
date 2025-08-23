/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    User.find({}).select("-password"),
    query
  );

  const users = await queryBuilder
    .search([])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const updateUserByAdmin = async (userId: string, payload: Partial<IUser>) => {
  const isUserExist = await User.findById({ _id: userId }).select("-password");

  if (!isUserExist)
    throw new AppError(httpStatus.NOT_FOUND, "User does not exits");

  const updateInfo = await User.findByIdAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });

  if (!updateInfo)
    throw new AppError(httpStatus.BAD_REQUEST, "User not updated!");

  const { password: userPassword, ...restUser } = updateInfo.toObject();

  return restUser;
};

const deleteUserByAdmin = async (userId: string) => {
  const isUserExist = await User.findById({ _id: userId }).select("-password");

  if (!isUserExist)
    throw new AppError(httpStatus.NOT_FOUND, "User does not exits");

  await User.findByIdAndDelete({ _id: userId });
  return null;
};

const getMe = async (decodedToken: JwtPayload) => {
  const users = await User.findById(decodedToken?.userId).select("-password");
  return users;
};

export const UserService = {
  getAllUser,
  updateUserByAdmin,
  deleteUserByAdmin,
  getMe,
};
