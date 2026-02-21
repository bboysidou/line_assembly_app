// order_trend.entity.ts
export class OrderTrendEntity {
  public readonly date: string;
  public readonly orders: number;
  public readonly completed: number;

  constructor(props: OrderTrendEntity) {
    this.date = props.date;
    this.orders = props.orders;
    this.completed = props.completed;
  }
}

export type CreateOrderTrendEntity = Omit<
  OrderTrendEntity,
  never
>;
