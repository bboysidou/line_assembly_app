// get_client_by_id.usecase.ts
import type { ClientEntity } from "../entities/client.entity";
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class GetClientByIdUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(id_client: string): Promise<ClientEntity> {
    return this._repository.getClientById(id_client);
  }
}
