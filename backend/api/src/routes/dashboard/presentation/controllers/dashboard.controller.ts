// dashboard.controller.ts
import type { NextFunction, Request, Response } from "express";
import {
  GetDashboardMetricsUsecase,
  GetOrdersTrendUsecase,
  GetStepPerformanceUsecase,
  GetStepAnalyticsUsecase,
} from "@/core/dependency_injection/dashboard.di";

export class DashboardController {
  async onGetDashboardMetricsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await GetDashboardMetricsUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async onGetOrdersTrendController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { period } = req.query;
      const result = await GetOrdersTrendUsecase.execute(
        (period as string) || "week",
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async onGetStepPerformanceController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await GetStepPerformanceUsecase.execute();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async onGetStepAnalyticsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id_step, start_date, end_date } = req.query;
      const parsedIdStep = parseInt(id_step as string);
      
      if (isNaN(parsedIdStep)) {
        return res.status(400).json({ error: "Invalid id_step parameter" });
      }
      
      const result = await GetStepAnalyticsUsecase.execute(
        parsedIdStep,
        start_date as string,
        end_date as string,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
