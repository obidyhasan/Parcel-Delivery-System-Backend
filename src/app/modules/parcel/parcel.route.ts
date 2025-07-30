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
  checkAuth(Role.SENDER),
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
router.get(
  "/incoming",
  checkAuth(Role.RECEIVER),
  ParcelController.getIncomingParcel
);

router.patch(
  "/:id/confirm",
  checkAuth(Role.RECEIVER),
  ParcelController.setParcelRequestConfirm
);

// ------------- Admin  -------------
router.get("/", checkAuth(Role.ADMIN), ParcelController.getAllParcel);

export const ParcelRouters = router;
