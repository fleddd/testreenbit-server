import Router from "express";

import { checkAuth, logout } from "../controllers/auth-controller";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth-middleware";
import dotenv from "dotenv";
const authRouter = Router();
dotenv.config();

authRouter.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/auth",
    successRedirect: process.env.FRONTEND_URL,
  })
);

authRouter.get("/check", isAuthenticated, checkAuth);
authRouter.post("/logout", isAuthenticated, logout);

export default authRouter;
