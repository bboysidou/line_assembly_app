// assembly.route.ts
import { Router } from "express";
import authMiddleware from "@/core/middleware/auth.middleware";
import { AssemblyController } from "./controllers/assembly.controller";

const router = Router();
const controller = new AssemblyController();

// Public routes (no authentication required)
router.get("/steps", controller.onGetAllStepsController);
router.get("/progress/:id_order", controller.onGetOrderProgressController);
router.get("/analytics", controller.onGetStepAnalyticsController);

// Protected routes (require authentication)
router.post("/start-step", authMiddleware, controller.onStartStepController);
router.post("/complete-step", authMiddleware, controller.onCompleteStepController);

export { router as assemblyRouter };
