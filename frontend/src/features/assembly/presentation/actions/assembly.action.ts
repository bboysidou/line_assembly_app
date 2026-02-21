import {
  getAllStepsUsecase,
  getOrderProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
} from "@/core/dependency_injections/assembly.di";
import type {
  StartStepSchemaType,
  CompleteStepSchemaType,
} from "../schemas/assembly.schema";

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

export const onGetOrderProgressAction = async (id_order: string) => {
  try {
    return await getOrderProgressUsecase.execute(id_order);
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

// Mutation Actions
export const onStartStepAction = async (data: StartStepSchemaType) => {
  try {
    return await startStepUsecase.execute(
      data.id_order,
      data.id_step,
      data.scanned_by,
      data.barcode,
      data.notes,
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
