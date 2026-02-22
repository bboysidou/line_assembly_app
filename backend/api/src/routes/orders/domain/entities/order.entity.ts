// order.entity.ts
export class OrderEntity {
  public readonly id_order: string;
  public readonly id_client?: string | null;
  public readonly order_number: string;
  public readonly product_name: string;
  public readonly quantity: number;
  public readonly status: string;
  public readonly notes?: string | null;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: OrderEntity) {
    this.id_order = props.id_order;
    this.id_client = props.id_client;
    this.order_number = props.order_number;
    this.product_name = props.product_name;
    this.quantity = props.quantity;
    this.status = props.status;
    this.notes = props.notes;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

export type CreateOrderEntity = StrictOmit<
  OrderEntity,
  "id_order" | "created_at" | "updated_at"
>;

export type UpdateOrderEntity = StrictOmit<
  OrderEntity,
  "created_at" | "updated_at"
>;
