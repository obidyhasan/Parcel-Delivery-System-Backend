import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { UserController } from "./user.controller";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUser);

export const UserRouters = router;
