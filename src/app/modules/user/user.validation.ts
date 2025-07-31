import z from "zod";
import { Role, UserStatus } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string("Name must be string")
    .min(2, "Name must be at least 2 characters long."),
  email: z
    .string("Email must be string")
    .email({ message: "Invalid email address format." }),
  password: z
    .string("Password must be string")
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number",
    }),
  role: z.enum(Object.values(Role) as [string], {
    message:
      "Invalid role provided. Please choose from 'SENDER', or 'RECEIVER'.",
  }),
  status: z.string().default(UserStatus.ACTIVE),
  phone: z
    .string("Phone Number must be string")
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh, Format: +8801XXXXXXXXX",
    })
    .optional(),
  address: z.string("Address must be string").optional(),
  picture: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.string().optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string("Name must be string")
    .min(2, "Name must be at least 2 characters long.")
    .optional(),
  role: z
    .enum(Object.values(Role) as [string], {
      message:
        "Invalid role provided. Please choose from 'SENDER', or 'RECEIVER'.",
    })
    .optional(),
  status: z.string().default(UserStatus.ACTIVE).optional(),
  phone: z
    .string("Phone Number must be string")
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh, Format: +8801XXXXXXXXX",
    })
    .optional(),
  address: z.string("Address must be string").optional(),
  picture: z.string().optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.string().optional(),
});
