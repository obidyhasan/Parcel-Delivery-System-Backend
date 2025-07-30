/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import {
  IAuthProvider,
  IUser,
  Role,
  UserStatus,
} from "../modules/user/user.interface";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ email: envVars.ADMIN_EMAIL });

    if (isAdminExist) {
      if (envVars.NODE_ENV === "development") {
        console.log("Admin Already Exists");
      }
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: Partial<IUser> = {
      name: "Parcel Delivery System Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      status: UserStatus.ACTIVE,
      auths: [authProvider],
    };

    const admin = await User.create(payload);
    if (envVars.NODE_ENV === "development") {
      console.log("Admin create successfully! ", admin);
    }
  } catch (error) {
    console.log("Error From Create Admin : ", error);
  }
};
