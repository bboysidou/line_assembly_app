// dashboard_metrics.entity.ts
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

export type CreateDashboardMetricsEntity = Omit<
  DashboardMetricsEntity,
  never
>;
