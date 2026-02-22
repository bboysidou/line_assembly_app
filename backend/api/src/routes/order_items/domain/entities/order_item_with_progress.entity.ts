// order_item_with_progress.entity.ts
import type { ItemProgressEntity } from "@/routes/assembly/domain/entities/order_progress.entity";

export class OrderItemWithProgressEntity {
  public readonly id_order_item: string;
  public readonly id_order: string;
  public readonly product_name: string;
  public readonly quantity: number;
  public readonly unit_number?: number;
  public readonly notes: string | null;
  public readonly current_step_id?: number | null;
  public readonly current_step_name?: string | null;
  public readonly current_step_status?: "not_started" | "in_progress" | "completed";
  public readonly progress: ItemProgressEntity[];
  public readonly total_time_seconds?: number;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: OrderItemWithProgressEntity) {
    this.id_order_item = props.id_order_item;
    this.id_order = props.id_order;
    this.product_name = props.product_name;
    this.quantity = props.quantity;
    this.unit_number = props.unit_number;
    this.notes = props.notes;
    this.current_step_id = props.current_step_id;
    this.current_step_name = props.current_step_name;
    this.current_step_status = props.current_step_status;
    this.progress = props.progress;
    this.total_time_seconds = props.total_time_seconds;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

// Type for API response with step details - now represents a single unit
export type OrderItemWithProgressType = {
  id_order_item: string;
  id_order: string;
  product_name: string;
  quantity: number;
  unit_number: number;
  notes: string | null;
  current_step_id: number | null;
  current_step_name: string | null;
  current_step_status: "not_started" | "in_progress" | "completed";
  progress: {
    id_progress: string;
    id_step: number;
    unit_number: number;
    step_name: string;
    step_order: number;
    started_at: Date | null;
    completed_at: Date | null;
    duration_seconds: number | null;
  }[];
  total_time_seconds: number;
  created_at: Date;
  updated_at: Date;
};
