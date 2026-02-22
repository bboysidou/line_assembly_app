// order_items.controller.ts
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/core/errors/custom.error";
import {
  createOrderItemSchema,
  createMultipleOrderItemsSchema,
  updateOrderItemSchema,
  deleteOrderItemSchema,
} from "../schemas/order_item.schema";
import {
  createOrderItemUsecase,
  createMultipleOrderItemsUsecase,
  getAllOrderItemsByOrderIdUsecase,
  updateOrderItemUsecase,
  deleteOrderItemUsecase,
  deleteAllOrderItemsByOrderIdUsecase,
} from "@/core/dependency_injection/order_items.di";

export class OrderItemsController {
  // GET all order items by order ID
  async onGetAllOrderItemsByOrderIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getAllOrderItemsByOrderIdUsecase.execute(req.params.id_order);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST create single order item
  async onCreateOrderItemController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = createOrderItemSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await createOrderItemUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST create multiple order items
  async onCreateMultipleOrderItemsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = createMultipleOrderItemsSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      // Transform the data to include id_order in each item
      const items = validate.data.items.map(item => ({
        ...item,
        id_order: validate.data.id_order,
      }));

      const result = await createMultipleOrderItemsUsecase.execute(items);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PATCH update order item
  async onUpdateOrderItemController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = updateOrderItemSchema.safeParse({
        ...req.body,
        id_order_item: req.params.id_order_item,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await updateOrderItemUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE single order item
  async onDeleteOrderItemController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = deleteOrderItemSchema.safeParse({
        id_order_item: req.params.id_order_item,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      await deleteOrderItemUsecase.execute(validate.data.id_order_item);
      res.json({ message: "Order item deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // DELETE all order items by order ID
  async onDeleteAllOrderItemsByOrderIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await deleteAllOrderItemsByOrderIdUsecase.execute(req.params.id_order);
      res.json({ message: "All order items deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
