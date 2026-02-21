import { type RegisterEntity, UserEntity } from "../entities/auth.entity";
import type { AuthDomainRepository } from "../repositories/auth.domain.repository";

export class RegisterUseCase {
  private readonly _repository: AuthDomainRepository;
  constructor(repository: AuthDomainRepository) {
    this._repository = repository;
  }

  async execute(user: RegisterEntity): Promise<UserEntity> {
    return this._repository.register(user);
  }
}
