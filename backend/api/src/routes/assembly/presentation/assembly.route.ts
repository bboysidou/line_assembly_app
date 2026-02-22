// assembly.route.ts
import { Router } from "express";
import authMiddleware from "@/core/middleware/auth.middleware";
import { AssemblyController } from "./controllers/assembly.controller";

const router = Router();
const controller = new AssemblyController();

// Public routes (no authentication required)
router.get("/steps", controller.onGetAllStepsController);
router.get("/item-progress/:id_order_item", controller.onGetItemProgressController);
router.get("/analytics", controller.onGetStepAnalyticsController);

// Protected routes (require authentication)
router.post("/start-step", authMiddleware, controller.onStartStepController);
router.post("/complete-step", authMiddleware, controller.onCompleteStepController);

// Bulk operations for all items in an order
router.post("/start-step-all", authMiddleware, controller.onStartStepForAllItemsController);
router.post("/complete-step-all", authMiddleware, controller.onCompleteStepForAllItemsController);

export { router as assemblyRouter };
