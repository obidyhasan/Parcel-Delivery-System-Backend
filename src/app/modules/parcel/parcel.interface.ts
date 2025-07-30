import { Schema, Types } from "mongoose";

export enum ParcelStatus {
  Pending = "Pending",
  Dispatched = "Dispatched",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum ParcelType {
  Document = "Document",
  Package = "Package",
  Fragile = "Fragile",
  Other = "Other",
}

export interface IParcelLog {
  status: ParcelStatus;
  timestamp: Date;
  updateBy: Schema.Types.ObjectId;
  note: string;
}

export interface IParcel {
  _id: string;
  trackingId: string;
  type: ParcelType;
  weight: number;
  fee: number;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  currentStatus: string;
  statusLogs?: ParcelStatus[];
  isBlocked?: boolean;
}
