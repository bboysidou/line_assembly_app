// item_progress.entity.ts
export class ItemProgressEntity {
  public readonly id_progress: string;
  public readonly id_order_item: string;
  public readonly id_step: number;
  public readonly unit_number: number;
  public readonly started_at?: Date | null;
  public readonly completed_at?: Date | null;
  public readonly scanned_by?: string | null;
  public readonly barcode?: string | null;
  public readonly notes?: string | null;
  public readonly created_at: Date;

  constructor(props: ItemProgressEntity) {
    this.id_progress = props.id_progress;
    this.id_order_item = props.id_order_item;
    this.id_step = props.id_step;
    this.unit_number = props.unit_number;
    this.started_at = props.started_at;
    this.completed_at = props.completed_at;
    this.scanned_by = props.scanned_by;
    this.barcode = props.barcode;
    this.notes = props.notes;
    this.created_at = props.created_at;
  }
}

// Type for creating new progress entries
export type CreateItemProgressEntity = StrictOmit<
  ItemProgressEntity,
  "id_progress" | "created_at"
>;

// Type for updating progress
export type UpdateItemProgressEntity = StrictOmit<
  ItemProgressEntity,
  "id_progress" | "id_order_item" | "created_at"
>;

// Legacy type alias for backward compatibility
export { ItemProgressEntity as OrderProgressEntity };
export { CreateItemProgressEntity as CreateOrderProgressEntity };
export { UpdateItemProgressEntity as UpdateOrderProgressEntity };
