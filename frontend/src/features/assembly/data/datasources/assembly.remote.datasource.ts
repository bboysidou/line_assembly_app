import { httpPublic } from "@/core/http/http";
import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { OrderProgressEntity } from "../../domain/entities/order_progress.entity";

const BASE_URL = "/assembly";

interface StartStepParams {
  id_order: string;
  id_step: number;
  scanned_by?: string;
  barcode?: string;
  notes?: string;
}

export class AssemblyRemoteDataSource {
  // GET all steps
  async onGetAllSteps(): Promise<AssemblyStepEntity[]> {
    try {
      return await httpPublic.get<AssemblyStepEntity[]>(`${BASE_URL}/steps`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // GET order progress
  async onGetOrderProgress(id_order: string): Promise<OrderProgressEntity[]> {
    try {
      return await httpPublic.get<OrderProgressEntity[]>(
        `${BASE_URL}/progress/${id_order}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // GET step analytics
  async onGetStepAnalytics(
    id_step: number,
    start_date?: string,
    end_date?: string,
  ): Promise<unknown> {
    try {
      const params = new URLSearchParams();
      params.append("id_step", id_step.toString());
      if (start_date) params.append("start_date", start_date);
      if (end_date) params.append("end_date", end_date);

      return await httpPublic.get<unknown>(
        `${BASE_URL}/analytics?${params.toString()}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST start step
  async onStartStep(params: StartStepParams): Promise<OrderProgressEntity> {
    try {
      return await httpPublic.post<StartStepParams, OrderProgressEntity>(
        `${BASE_URL}/start-step`,
        params,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST complete step
  async onCompleteStep(id_progress: string): Promise<OrderProgressEntity> {
    try {
      return await httpPublic.post<{ id_progress: string }, OrderProgressEntity>(
        `${BASE_URL}/complete-step`,
        { id_progress },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
