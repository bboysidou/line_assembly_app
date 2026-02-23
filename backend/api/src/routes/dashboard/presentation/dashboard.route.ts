// dashboard.route.ts
import { Router } from "express";
import { DashboardController } from "./controllers/dashboard.controller";

const router = Router();
const controller = new DashboardController();

router.get("/metrics", controller.onGetDashboardMetricsController);
router.get("/orders/trend", controller.onGetOrdersTrendController);
router.get(
  "/assembly/step-performance",
  controller.onGetStepPerformanceController,
);
router.get("/assembly/step-analytics", controller.onGetStepAnalyticsController);

export { router as dashboardRouter };
