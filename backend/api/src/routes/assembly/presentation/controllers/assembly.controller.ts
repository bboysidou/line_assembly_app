// assembly.controller.ts
import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@/core/errors/custom.error";
import { startStepSchema, completeStepSchema } from "../schemas/assembly.schema";
import {
  getAllStepsUsecase,
  getOrderProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
} from "@/core/dependency_injection/assembly.di";

export class AssemblyController {
  // GET all steps
  async onGetAllStepsController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getAllStepsUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET order progress
  async onGetOrderProgressController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getOrderProgressUsecase.execute(req.params.id_order);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST start step
  async onStartStepController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = startStepSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await startStepUsecase.execute(validate.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST complete step
  async onCompleteStepController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validate = completeStepSchema.safeParse(req.body);

      if (!validate.success) {
        throw new BadRequestError(validate.error.issues[0].message);
      }

      const result = await completeStepUsecase.execute(validate.data.id_progress);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET step analytics
  async onGetStepAnalyticsController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getStepAnalyticsUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
