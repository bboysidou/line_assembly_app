// create_client.usecase.ts
import type { CreateClientEntity, ClientEntity } from "../entities/client.entity";
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class CreateClientUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(client: CreateClientEntity): Promise<ClientEntity> {
    return this._repository.createClient(client);
  }
}
