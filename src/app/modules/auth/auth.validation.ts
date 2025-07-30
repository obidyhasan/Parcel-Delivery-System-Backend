import z from "zod";

export const loginUserZodSchema = z.object({
  email: z
    .string("Email must be string")
    .email({ message: "Invalid email address format" }),
  password: z.string("Password must be string"),
});
