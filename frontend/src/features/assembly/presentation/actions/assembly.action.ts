// assembly.action.ts
import {
  getAllStepsUsecase,
  getItemProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
  startStepForAllItemsUsecase,
  completeStepForAllItemsUsecase,
} from "@/core/dependency_injections/assembly.di";
import type {
  StartStepSchemaType,
  CompleteStepSchemaType,
  StartStepForAllItemsSchemaType,
  CompleteStepForAllItemsSchemaType,
} from "../schemas/assembly.schema";
import { QUERY_KEYS } from "@/core/http/type";

// Query Keys - Export for use in components
export const assemblyKeys = QUERY_KEYS.ASSEMBLY;

// Query Actions
export const onGetAllStepsAction = async () => {
  try {
    return await getAllStepsUsecase.execute();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetItemProgressAction = async (id_order_item: string) => {
  try {
    return await getItemProgressUsecase.execute(id_order_item);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetStepAnalyticsAction = async (
  id_step: number,
  start_date?: string,
  end_date?: string,
) => {
  try {
    return await getStepAnalyticsUsecase.execute(id_step, start_date, end_date);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

// Mutation Actions - Single Item Unit
export const onStartStepAction = async (data: StartStepSchemaType) => {
  try {
    return await startStepUsecase.execute(
      data.id_order_item,
      data.id_step,
      data.unit_number,
      data.scanned_by ?? undefined,
      data.barcode ?? undefined,
      data.notes ?? undefined,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onCompleteStepAction = async (data: CompleteStepSchemaType) => {
  try {
    return await completeStepUsecase.execute(data.id_progress);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

// Mutation Actions - Bulk (All items in an order)
export const onStartStepForAllItemsAction = async (data: StartStepForAllItemsSchemaType) => {
  try {
    return await startStepForAllItemsUsecase.execute(
      data.id_order,
      data.id_step,
      data.scanned_by ?? undefined,
      data.barcode ?? undefined,
      data.notes ?? undefined,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onCompleteStepForAllItemsAction = async (data: CompleteStepForAllItemsSchemaType) => {
  try {
    return await completeStepForAllItemsUsecase.execute(
      data.id_order,
      data.id_step,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
