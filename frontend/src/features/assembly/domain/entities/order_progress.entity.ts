// order_progress.entity.ts
export class OrderProgressEntity {
  public readonly id_progress: string;
  public readonly id_order: string;
  public readonly id_step: number;
  public readonly started_at?: Date | null;
  public readonly completed_at?: Date | null;
  public readonly scanned_by?: string | null;
  public readonly barcode?: string | null;
  public readonly notes?: string | null;
  public readonly created_at?: Date;

  constructor(props: OrderProgressEntity) {
    this.id_progress = props.id_progress;
    this.id_order = props.id_order;
    this.id_step = props.id_step;
    this.started_at = props.started_at;
    this.completed_at = props.completed_at;
    this.scanned_by = props.scanned_by;
    this.barcode = props.barcode;
    this.notes = props.notes;
    this.created_at = props.created_at;
  }
}

export type CreateOrderProgressEntity = Omit<
  OrderProgressEntity,
  "id_progress" | "created_at"
>;

export type UpdateOrderProgressEntity = Omit<
  OrderProgressEntity,
  "id_progress" | "id_order" | "created_at"
>;
