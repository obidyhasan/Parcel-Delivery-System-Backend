import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelRequestZodSchema } from "./parcel.validation";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// ------------ Sender --------------
router.post(
  "/request",
  validateRequest(createParcelRequestZodSchema),
  ParcelController.createParcelRequest
);

router.get(
  "/me",
  checkAuth(Role.RECEIVER, Role.SENDER),
  ParcelController.getParcelRequestByUserId
);

router.patch(
  "/:id/cancel",
  checkAuth(Role.SENDER),
  ParcelController.setParcelRequestStatus
);

// ------------ Receiver -------------

export const ParcelRouters = router;
