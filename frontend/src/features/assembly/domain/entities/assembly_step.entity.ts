// assembly_step.entity.ts
export class AssemblyStepEntity {
  public readonly id_step: number;
  public readonly step_name: string;
  public readonly step_order: number;
  public readonly step_description?: string;
  public readonly is_active: boolean;

  constructor(props: AssemblyStepEntity) {
    this.id_step = props.id_step;
    this.step_name = props.step_name;
    this.step_order = props.step_order;
    this.step_description = props.step_description;
    this.is_active = props.is_active;
  }
}
