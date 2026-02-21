import { Router } from "express";
import authMiddleware from "@/core/middleware/auth.middleware";
import { AuthController } from "./controllers/auth.controller";

const router = Router();
const controller = new AuthController();

router.get("/session", authMiddleware, controller.onSessionController);
router.get("/logout", authMiddleware, controller.onLogoutController);
router.post("/register", controller.onRegisterController);
router.post("/login", controller.onLoginController);

export { router as authRouter };
