import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.router";
import { ParcelRouters } from "../modules/parcel/parcel.route";
import { UserRouters } from "../modules/user/user.route";

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
  {
    path: "/user",
    router: UserRouters,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
