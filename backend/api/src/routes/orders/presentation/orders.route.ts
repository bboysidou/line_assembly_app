// orders.route.ts
import { Router } from "express";
import authMiddleware from "@/core/middleware/auth.middleware";
import { OrdersController } from "./controllers/orders.controller";

const router = Router();
const controller = new OrdersController();

// Public routes (no authentication required)
router.get("/", controller.onGetAllOrdersController);
router.get("/:id_order", controller.onGetOrderByIdController);
router.get("/:id_order/items-with-progress", controller.onGetOrderItemsWithProgressController);

// Protected routes (require authentication)
router.post("/", authMiddleware, controller.onCreateOrderController);
router.patch("/:id_order", authMiddleware, controller.onUpdateOrderController);
router.delete("/:id_order", authMiddleware, controller.onDeleteOrderController);

export { router as ordersRouter };
