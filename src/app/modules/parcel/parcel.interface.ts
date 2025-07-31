import { Types } from "mongoose";

export enum ParcelStatus {
  Pending = "Pending",
  Picked = "Picked",
  InTransit = "In Transit",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Confirm = "Confirm",
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
  updateBy: Types.ObjectId;
  note?: string;
}

export interface IParcel {
  _id?: string;
  trackingId?: string;
  title: string;
  type: ParcelType;
  weight: number;
  fee: number;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  currentStatus: string;
  deliverDate: Date;
  statusLogs?: IParcelLog[];
  isBlocked?: boolean;
  pickupAddress?: string;
  deliveryAddress?: string;
}
