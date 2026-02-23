// get_all_clients.usecase.ts
import type { PaginatedClientsResponse } from "../repositories/clients.domain.repository";
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class GetAllClientsUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(page: number = 1, limit: number = 10): Promise<PaginatedClientsResponse> {
    return this._repository.getAllClients(page, limit);
  }
}
