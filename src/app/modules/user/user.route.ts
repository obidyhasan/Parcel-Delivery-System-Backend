import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";

const router = Router();
// ---------------- Admin -----------------
router.get("/", checkAuth(Role.ADMIN), UserController.getAllUser);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateUserZodSchema),
  UserController.updateUserByAdmin
);

router.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteUserByAdmin);

export const UserRouters = router;
