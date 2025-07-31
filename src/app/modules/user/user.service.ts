/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import AppError from "../../helper/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const getAllUser = async () => {
  const users = await User.find().select("-password");
  return users;
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

export const UserService = {
  getAllUser,
  updateUserByAdmin,
  deleteUserByAdmin,
};
