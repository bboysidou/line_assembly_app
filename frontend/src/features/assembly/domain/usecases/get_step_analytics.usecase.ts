import type { AssemblyDomainRepository } from "../repositories/assembly.domain.repository";

export class GetStepAnalyticsUsecase {
  private readonly _repository: AssemblyDomainRepository;

  constructor(repository: AssemblyDomainRepository) {
    this._repository = repository;
  }

  async execute(
    id_step: number,
    start_date?: string,
    end_date?: string,
  ): Promise<unknown> {
    return this._repository.getStepAnalytics(id_step, start_date, end_date);
  }
}
