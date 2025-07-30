import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.router";
import { ParcelRouters } from "../modules/parcel/parcel.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    router: AuthRouters,
  },
  {
    path: "/parcel",
    router: ParcelRouters,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
