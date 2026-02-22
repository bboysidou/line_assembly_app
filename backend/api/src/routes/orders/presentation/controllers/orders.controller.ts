// orders.controller.ts
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/core/errors/custom.error";
import {
  createOrderSchema,
  updateOrderSchema,
  deleteOrderSchema,
} from "../schemas/order.schema";
import {
  createOrderUsecase,
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  updateOrderUsecase,
  deleteOrderUsecase,
  getOrderItemsWithProgressUsecase,
} from "@/core/dependency_injection/orders.di";

export class OrdersController {
  // GET all orders
  async onGetAllOrdersController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getAllOrdersUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET order by ID
  async onGetOrderByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getOrderByIdUsecase.execute(req.params.id_order);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET order items with progress
  async onGetOrderItemsWithProgressController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getOrderItemsWithProgressUsecase.execute(req.params.id_order);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST create order
  async onCreateOrderController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = createOrderSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await createOrderUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // PATCH update order
  async onUpdateOrderController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = updateOrderSchema.safeParse({
        ...req.body,
        id_order: req.params.id_order,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await updateOrderUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE order
  async onDeleteOrderController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = deleteOrderSchema.safeParse({
        id_order: req.params.id_order,
      });

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      await deleteOrderUsecase.execute(validate.data.id_order);
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
