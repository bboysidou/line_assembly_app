// step_performance.entity.ts
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

export type CreateStepPerformanceEntity = Omit<
  StepPerformanceEntity,
  never
>;
