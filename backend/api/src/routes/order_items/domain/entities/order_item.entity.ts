// order_item.entity.ts
export class OrderItemEntity {
  public readonly id_order_item: string;
  public readonly id_order: string;
  public readonly product_name: string;
  public readonly quantity: number;
  public readonly notes: string | null;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: OrderItemEntity) {
    this.id_order_item = props.id_order_item;
    this.id_order = props.id_order;
    this.product_name = props.product_name;
    this.quantity = props.quantity;
    this.notes = props.notes;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

// CreateOrderItemEntity excludes id_order_item and timestamps
export type CreateOrderItemEntity = StrictOmit<
  OrderItemEntity,
  "id_order_item" | "created_at" | "updated_at"
>;

// UpdateOrderItemEntity excludes timestamps
export type UpdateOrderItemEntity = StrictOmit<
  OrderItemEntity,
  "created_at" | "updated_at"
>;
