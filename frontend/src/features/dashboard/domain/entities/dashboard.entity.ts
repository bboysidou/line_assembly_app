// dashboard.entity.ts
export class DashboardMetricsEntity {
  public readonly totalClients: number;
  public readonly totalOrders: number;
  public readonly pendingOrders: number;
  public readonly inProgressOrders: number;
  public readonly completedOrders: number;
  public readonly cancelledOrders: number;
  public readonly clientsGrowth: number;
  public readonly ordersGrowth: number;
  public readonly inProgressChange: number;
  public readonly completedGrowth: number;

  constructor(props: DashboardMetricsEntity) {
    this.totalClients = props.totalClients;
    this.totalOrders = props.totalOrders;
    this.pendingOrders = props.pendingOrders;
    this.inProgressOrders = props.inProgressOrders;
    this.completedOrders = props.completedOrders;
    this.cancelledOrders = props.cancelledOrders;
    this.clientsGrowth = props.clientsGrowth;
    this.ordersGrowth = props.ordersGrowth;
    this.inProgressChange = props.inProgressChange;
    this.completedGrowth = props.completedGrowth;
  }
}

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

export class StepPerformanceEntity {
  public readonly step: string;
  public readonly stepOrder: number;
  public readonly avgTime: number;
  public readonly minTime: number;
  public readonly maxTime: number;

  constructor(props: StepPerformanceEntity) {
    this.step = props.step;
    this.stepOrder = props.stepOrder;
    this.avgTime = props.avgTime;
    this.minTime = props.minTime;
    this.maxTime = props.maxTime;
  }
}

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
