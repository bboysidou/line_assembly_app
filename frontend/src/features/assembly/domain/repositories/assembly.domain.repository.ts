import type { AssemblyStepEntity } from "../entities/assembly_step.entity";
import type { OrderProgressEntity } from "../entities/order_progress.entity";

export interface AssemblyDomainRepository {
  // Query Operations
  getAllSteps(): Promise<AssemblyStepEntity[]>;
  getOrderProgress(id_order: string): Promise<OrderProgressEntity[]>;
  getStepAnalytics(id_step: number, start_date?: string, end_date?: string): Promise<unknown>;

  // Command Operations
  startStep(
    id_order: string,
    id_step: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<OrderProgressEntity>;
  completeStep(id_progress: string): Promise<OrderProgressEntity>;
}
