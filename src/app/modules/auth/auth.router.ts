import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { loginUserZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  AuthControllers.createUser
);

router.post(
  "/login",
  validateRequest(loginUserZodSchema),
  AuthControllers.credentialsLogin
);

export const AuthRouters = router;
