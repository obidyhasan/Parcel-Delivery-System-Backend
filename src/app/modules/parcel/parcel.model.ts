import { model, Schema } from "mongoose";
import {
  IParcel,
  IParcelLog,
  ParcelStatus,
  ParcelType,
} from "./parcel.interface";

const statusLogSchema = new Schema<IParcelLog>(
  {
    status: { type: String, enum: Object.values(ParcelStatus), required: true },
    timestamp: { type: Date, default: Date.now() },
    updateBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingId: { type: String, unique: true },
    title: { type: String, required: true },
    type: { type: String, enum: Object.values(ParcelType), required: true },
    weight: { type: Number, required: true, min: 0.1 },
    fee: { type: Number, required: true, min: 0.1 },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deliverDate: { type: Date },
    currentStatus: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.Pending,
    },
    statusLogs: [statusLogSchema],
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
