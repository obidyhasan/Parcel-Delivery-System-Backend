import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get("/parcel", checkAuth(Role.ADMIN), StatsController.getParcelStats);

export const StatsRouters = router;
