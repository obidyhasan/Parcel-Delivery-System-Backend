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

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IParcel {
  _id?: string;
  trackingId?: string;
  title: string;
  type: ParcelType;
  status?: Status;
  weight: number;
  fee: number;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  receiverEmail?: string;
  currentStatus: string;
  deliverDate: Date;
  statusLogs?: IParcelLog[];
  isBlocked?: boolean;
  pickupAddress?: string;
  deliveryAddress?: string;
}
