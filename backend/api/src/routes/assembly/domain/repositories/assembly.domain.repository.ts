// assembly.domain.repository.ts
import type { AssemblyStepEntity } from "../entities/assembly_step.entity";
import type { ItemProgressEntity, CreateItemProgressEntity } from "../entities/order_progress.entity";
import type { StepTimeLogEntity } from "../entities/step_time_log.entity";

export interface AssemblyDomainRepository {
  // Assembly Steps
  getAllSteps(): Promise<AssemblyStepEntity[]>;
  getStepById(id_step: number): Promise<AssemblyStepEntity>;
  getActiveSteps(): Promise<AssemblyStepEntity[]>;

  // Item Progress (renamed from Order Progress)
  getItemProgress(id_order_item: string): Promise<(ItemProgressEntity & { step_name: string; step_order: number })[]>;
  getCurrentStep(id_order_item: string): Promise<(ItemProgressEntity & { step_name: string; step_order: number }) | null>;
  getCurrentStepForUnit(id_order_item: string, unit_number: number): Promise<(ItemProgressEntity & { step_name: string; step_order: number }) | null>;
  startStep(progress: CreateItemProgressEntity): Promise<ItemProgressEntity>;
  completeStep(id_progress: string): Promise<ItemProgressEntity>;

  // Time Analytics
  getStepAnalytics(): Promise<{ id_step: number; avg_duration: number; step_name: string }[]>;
  getItemTimeLogs(id_order_item: string): Promise<StepTimeLogEntity[]>;
  
  // Bulk operations
  startStepForAllItems(id_order: string, id_step: number): Promise<ItemProgressEntity[]>;
  completeStepForAllItems(id_order: string, id_step: number): Promise<ItemProgressEntity[]>;
}
