import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createParcelRequestZodSchema,
  UpdateByAdminParcelRequestZodSchema,
  updateParcelRequestZodSchema,
} from "./parcel.validation";
import { ParcelController } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

// ------------ Sender --------------

router.post(
  "/request",
  checkAuth(Role.SENDER, Role.ADMIN),
  validateRequest(createParcelRequestZodSchema),
  ParcelController.createParcelRequest
);

router.get(
  "/me",
  checkAuth(Role.RECEIVER, Role.SENDER, Role.ADMIN),
  ParcelController.getParcelRequestByUserId
);

router.patch(
  "/:id",
  checkAuth(Role.SENDER, Role.ADMIN),
  validateRequest(updateParcelRequestZodSchema),
  ParcelController.updateParcelRequest
);

router.patch(
  "/:id/cancel",
  checkAuth(Role.SENDER, Role.ADMIN),
  ParcelController.setParcelRequestStatus
);

router.get(
  "/track/:trackingId",
  checkAuth(Role.RECEIVER, Role.SENDER, Role.ADMIN),
  ParcelController.getParcelTracking
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

router.get(
  "/delivery",
  checkAuth(Role.RECEIVER),
  ParcelController.getDeliveryParcel
);

router.patch(
  "/:id/delivered",
  checkAuth(Role.RECEIVER),
  ParcelController.setParcelRequestDelivered
);

// ------------- Admin  -------------
router.get("/", checkAuth(Role.ADMIN), ParcelController.getAllParcel);

router.patch(
  "/update/:id",
  checkAuth(Role.ADMIN),
  validateRequest(UpdateByAdminParcelRequestZodSchema),
  ParcelController.updateParcelRequestByAdmin
);

router.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN),
  ParcelController.deleteParcelRequestByAdmin
);

export const ParcelRouters = router;
