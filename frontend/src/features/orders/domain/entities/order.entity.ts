// order.entity.ts
export class OrderEntity {
  public readonly id_order: string;
  public readonly id_client: string;
  public readonly order_number: string;
  public readonly product_name: string;
  public readonly quantity: number;
  public readonly status: string;
  public readonly notes?: string | null;
  public readonly client_name?: string | null;
  public readonly items_count?: number;
  public readonly total_quantity?: number;
  public readonly units_in_progress?: number;
  public readonly units_completed?: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  constructor(props: OrderEntity) {
    this.id_order = props.id_order;
    this.id_client = props.id_client;
    this.order_number = props.order_number;
    this.product_name = props.product_name;
    this.quantity = props.quantity;
    this.status = props.status;
    this.notes = props.notes;
    this.client_name = props.client_name;
    this.items_count = props.items_count;
    this.total_quantity = props.total_quantity;
    this.units_in_progress = props.units_in_progress;
    this.units_completed = props.units_completed;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}

// CreateOrderEntity - only requires id_client, product_name and quantity are optional (stored in order_items)
export type CreateOrderEntity = {
  id_client: string;
  product_name?: string;
  quantity?: number;
  notes?: string | null;
};

// UpdateOrderEntity - order_number can be null for legacy data
export type UpdateOrderEntity = {
  id_order: string;
  id_client?: string | null;
  order_number?: string | null;
  product_name: string;
  quantity: number;
  status: string;
  notes?: string | null;
};
