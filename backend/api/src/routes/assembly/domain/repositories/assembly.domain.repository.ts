// assembly.domain.repository.ts
import type { AssemblyStepEntity } from "../entities/assembly_step.entity";
import type { OrderProgressEntity, CreateOrderProgressEntity } from "../entities/order_progress.entity";
import type { StepTimeLogEntity } from "../entities/step_time_log.entity";

export interface AssemblyDomainRepository {
  // Assembly Steps
  getAllSteps(): Promise<AssemblyStepEntity[]>;
  getStepById(id_step: number): Promise<AssemblyStepEntity>;
  getActiveSteps(): Promise<AssemblyStepEntity[]>;

  // Order Progress
  getOrderProgress(id_order: string): Promise<OrderProgressEntity[]>;
  getCurrentStep(id_order: string): Promise<OrderProgressEntity | null>;
  startStep(progress: CreateOrderProgressEntity): Promise<OrderProgressEntity>;
  completeStep(id_progress: string): Promise<OrderProgressEntity>;

  // Time Analytics
  getStepAnalytics(): Promise<{ id_step: number; avg_duration: number; step_name: string }[]>;
  getOrderTimeLogs(id_order: string): Promise<StepTimeLogEntity[]>;
}
