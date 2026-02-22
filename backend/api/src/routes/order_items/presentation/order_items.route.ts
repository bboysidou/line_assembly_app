// order_items.route.ts
import { Router } from "express";
import { OrderItemsController } from "./controllers/order_items.controller";

const router = Router();
const controller = new OrderItemsController();

// GET all order items by order ID
router.get("/order/:id_order", controller.onGetAllOrderItemsByOrderIdController);

// POST create single order item
router.post("/", controller.onCreateOrderItemController);

// POST create multiple order items
router.post("/batch", controller.onCreateMultipleOrderItemsController);

// PATCH update order item
router.patch("/:id_order_item", controller.onUpdateOrderItemController);

// DELETE single order item
router.delete("/:id_order_item", controller.onDeleteOrderItemController);

// DELETE all order items by order ID
router.delete("/order/:id_order", controller.onDeleteAllOrderItemsByOrderIdController);

export { router as orderItemsRouter };
