import { Router } from "express";
import { AuthRouters } from "../modules/auth/auth.router";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    router: AuthRouters,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
