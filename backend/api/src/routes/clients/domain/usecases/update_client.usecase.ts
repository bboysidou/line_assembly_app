// update_client.usecase.ts
import type { UpdateClientEntity, ClientEntity } from "../entities/client.entity";
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class UpdateClientUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(client: UpdateClientEntity): Promise<ClientEntity> {
    return this._repository.updateClient(client);
  }
}
