// step_analytics.entity.ts
export class StepAnalyticsEntity {
  public readonly date: string;
  public readonly orders: number;
  public readonly completed: number;

  constructor(props: StepAnalyticsEntity) {
    this.date = props.date;
    this.orders = props.orders;
    this.completed = props.completed;
  }
}

export type CreateStepAnalyticsEntity = Omit<
  StepAnalyticsEntity,
  never
>;
