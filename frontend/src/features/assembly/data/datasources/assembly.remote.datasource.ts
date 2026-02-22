import { httpPublic } from "@/core/http/http";
import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { ItemProgressEntity } from "../../domain/entities/item_progress.entity";

const BASE_URL = "/assembly";

interface StartStepParams {
  id_order_item: string;
  id_step: number;
  unit_number: number;
  scanned_by?: string;
  barcode?: string;
  notes?: string;
}

interface StartStepForAllItemsParams {
  id_order: string;
  id_step: number;
  scanned_by?: string;
  barcode?: string;
  notes?: string;
}

interface CompleteStepForAllItemsParams {
  id_order: string;
  id_step: number;
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

  // GET item progress
  async onGetItemProgress(id_order_item: string): Promise<ItemProgressEntity[]> {
    try {
      return await httpPublic.get<ItemProgressEntity[]>(
        `${BASE_URL}/progress/item/${id_order_item}`,
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

  // POST start step for single item
  async onStartStep(params: StartStepParams): Promise<ItemProgressEntity> {
    try {
      return await httpPublic.post<StartStepParams, ItemProgressEntity>(
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
  async onCompleteStep(id_progress: string): Promise<ItemProgressEntity> {
    try {
      return await httpPublic.post<{ id_progress: string }, ItemProgressEntity>(
        `${BASE_URL}/complete-step`,
        { id_progress },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST start step for all items in an order
  async onStartStepForAllItems(params: StartStepForAllItemsParams): Promise<ItemProgressEntity[]> {
    try {
      return await httpPublic.post<StartStepForAllItemsParams, ItemProgressEntity[]>(
        `${BASE_URL}/start-step-all`,
        params,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  // POST complete step for all items in an order
  async onCompleteStepForAllItems(params: CompleteStepForAllItemsParams): Promise<ItemProgressEntity[]> {
    try {
      return await httpPublic.post<CompleteStepForAllItemsParams, ItemProgressEntity[]>(
        `${BASE_URL}/complete-step-all`,
        params,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
