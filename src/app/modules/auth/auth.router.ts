import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "../user/user.validation";
import { loginUserZodSchema } from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

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
router.post(
  "/logout",
  checkAuth(...Object.values(Role)),
  AuthControllers.userLogout
);

export const AuthRouters = router;
