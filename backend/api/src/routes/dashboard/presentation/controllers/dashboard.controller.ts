import type { NextFunction, Request, Response } from "express";
import {
  getDashboardMetricsUsecase,
  getOrdersTrendUsecase,
  getStepPerformanceUsecase,
  getStepAnalyticsUsecase,
} from "@/core/dependency_injection/dashboard.di";

export class DashboardController {
  async onGetDashboardMetricsController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getDashboardMetricsUsecase.execute();
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
      const result = await getOrdersTrendUsecase.execute(
        (period as string) || "week",
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async onGetStepPerformanceController(
    _: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getStepPerformanceUsecase.execute();
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

      const result = await getStepAnalyticsUsecase.execute(
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
