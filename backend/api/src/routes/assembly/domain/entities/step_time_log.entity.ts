// step_time_log.entity.ts
export class StepTimeLogEntity {
  public readonly id_log: string;
  public readonly id_order_item: string;
  public readonly id_step: number;
  public readonly unit_number: number;
  public readonly duration_seconds?: number | null;
  public readonly completed_at: Date;

  constructor(props: StepTimeLogEntity) {
    this.id_log = props.id_log;
    this.id_order_item = props.id_order_item;
    this.id_step = props.id_step;
    this.unit_number = props.unit_number;
    this.duration_seconds = props.duration_seconds;
    this.completed_at = props.completed_at;
  }
}

export type CreateStepTimeLogEntity = StrictOmit<
  StepTimeLogEntity,
  "id_log"
>;
