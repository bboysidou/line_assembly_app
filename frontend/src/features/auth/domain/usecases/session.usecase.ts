import { UserEntity } from "../entities/auth.entity";
import type { AuthDomainRepository } from "../repositories/auth.domain.repository";

export class SessionUseCase {
  private readonly _repository: AuthDomainRepository;
  constructor(authDomainRepository: AuthDomainRepository) {
    this._repository = authDomainRepository;
  }

  async execute(): Promise<UserEntity> {
    return this._repository.session();
  }
}
