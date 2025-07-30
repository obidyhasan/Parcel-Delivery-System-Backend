import { User } from "./user.model";

const getAllUser = async () => {
  const users = await User.find().select("-password");
  return users;
};

export const UserService = {
  getAllUser,
};
