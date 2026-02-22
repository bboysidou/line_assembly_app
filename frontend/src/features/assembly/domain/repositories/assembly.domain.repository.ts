import type { AssemblyStepEntity } from "../entities/assembly_step.entity";
import type { ItemProgressEntity } from "../entities/item_progress.entity";

export interface AssemblyDomainRepository {
  // Query Operations
  getAllSteps(): Promise<AssemblyStepEntity[]>;
  getItemProgress(id_order_item: string): Promise<ItemProgressEntity[]>;
  getStepAnalytics(id_step: number, start_date?: string, end_date?: string): Promise<unknown>;

  // Command Operations - Single Item Unit
  startStep(
    id_order_item: string,
    id_step: number,
    unit_number: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity>;
  completeStep(id_progress: string): Promise<ItemProgressEntity>;

  // Command Operations - Bulk (All items in an order)
  startStepForAllItems(
    id_order: string,
    id_step: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity[]>;
  completeStepForAllItems(
    id_order: string,
    id_step: number,
  ): Promise<ItemProgressEntity[]>;
}
