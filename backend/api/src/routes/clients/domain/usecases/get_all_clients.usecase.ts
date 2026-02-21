// get_all_clients.usecase.ts
import type { ClientEntity } from "../entities/client.entity";
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class GetAllClientsUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(): Promise<ClientEntity[]> {
    return this._repository.getAllClients();
  }
}
