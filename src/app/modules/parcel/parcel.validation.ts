import z from "zod";
import { ParcelType } from "./parcel.interface";

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
  senderId: z.string("SenderId Required. SenderId must be string"),
  receiverId: z.string("ReceiverId Required. ReceiverId must be string"),
  pickupAddress: z.string(
    "PickupAddress Required. Pickup Address must be string"
  ),
  deliveryAddress: z.string(
    "DeliveryAddress Required. Delivery Address must be string"
  ),
});
