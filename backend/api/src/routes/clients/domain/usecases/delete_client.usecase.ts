// delete_client.usecase.ts
import type { ClientsDomainRepository } from "../repositories/clients.domain.repository";

export class DeleteClientUsecase {
  private readonly _repository: ClientsDomainRepository;

  constructor(repository: ClientsDomainRepository) {
    this._repository = repository;
  }

  async execute(id_client: string): Promise<void> {
    return this._repository.deleteClient(id_client);
  }
}
