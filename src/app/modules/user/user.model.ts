import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(Role), default: Role.RECEIVER },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    phone: { type: String, trim: true },
    picture: { type: String },
    address: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
