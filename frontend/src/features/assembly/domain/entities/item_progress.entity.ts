// item_progress.entity.ts
export class ItemProgressEntity {
  public readonly id_progress: string;
  public readonly id_order_item: string;
  public readonly id_step: number;
  public readonly unit_number: number;
  public readonly started_at: Date | null;
  public readonly completed_at: Date | null;
  public readonly scanned_by: string | null;
  public readonly barcode: string | null;
  public readonly notes: string | null;
  public readonly created_at: Date | null;

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

export type CreateItemProgressEntity = Omit<
  ItemProgressEntity,
  "id_progress" | "created_at"
>;

export type UpdateItemProgressEntity = Omit<
  ItemProgressEntity,
  "id_progress" | "id_order_item" | "created_at"
>;

// Step time log for history display
export class StepTimeLogEntity {
  public readonly id_progress: string;
  public readonly id_order_item: string;
  public readonly id_step: number;
  public readonly unit_number: number;
  public readonly step_name: string;
  public readonly step_order: number;
  public readonly started_at: Date | null;
  public readonly completed_at: Date | null;
  public readonly duration_minutes: number | null;
  public readonly scanned_by: string | null;
  public readonly barcode: string | null;
  public readonly notes: string | null;

  constructor(props: StepTimeLogEntity) {
    this.id_progress = props.id_progress;
    this.id_order_item = props.id_order_item;
    this.id_step = props.id_step;
    this.unit_number = props.unit_number;
    this.step_name = props.step_name;
    this.step_order = props.step_order;
    this.started_at = props.started_at;
    this.completed_at = props.completed_at;
    this.duration_minutes = props.duration_minutes;
    this.scanned_by = props.scanned_by;
    this.barcode = props.barcode;
    this.notes = props.notes;
  }
}
