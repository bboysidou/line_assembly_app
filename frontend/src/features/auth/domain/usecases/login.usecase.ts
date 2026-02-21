import { UserEntity, type LoginEntity } from "../entities/auth.entity";
import type { AuthDomainRepository } from "../repositories/auth.domain.repository";

export class LoginUseCase {
  private readonly _repository: AuthDomainRepository;
  constructor(repository: AuthDomainRepository) {
    this._repository = repository;
  }

  async execute(user: LoginEntity): Promise<UserEntity> {
    return this._repository.login(user);
  }
}
