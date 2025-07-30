import z from "zod";
import { ParcelStatus, ParcelType } from "./parcel.interface";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createParcelRequestZodSchema = z.object({
  title: z.string("Title Required. Title must be string"),
  type: z.enum(Object.values(ParcelType) as [string], {
    message:
      "Type Required. Please choose from 'Document', 'Package', 'Fragile', or 'Other'.",
  }),
  weight: z
    .number("Weight Required. Weight must be number")
    .min(0.1, "Weight must be at gether then 0.1"),
  fee: z
    .number("Fee Required. Fee must be number")
    .nonnegative("Fee must be 0 or greater"),
  senderId: z.string().regex(objectIdRegex, "Invalid senderId"),
  receiverId: z.string().regex(objectIdRegex, "Invalid receiverId"),
  pickupAddress: z.string(
    "PickupAddress Required. Pickup Address must be string"
  ),
  deliveryAddress: z.string(
    "DeliveryAddress Required. Delivery Address must be string"
  ),
});

export const updateParcelRequestZodSchema = z.object({
  currentStatus: z.enum(Object.values(ParcelStatus) as [string], {
    message:
      "CurrentStatus Required. Please choose from 'Pending', 'Picked', 'In Transit',  'Delivered', 'Cancelled', 'Confirm'.",
  }),
});
