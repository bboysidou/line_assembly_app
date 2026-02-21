import type { AuthDomainRepository } from "../repositories/auth.domain.repository";

export class LogoutUseCase {
  private readonly _repository: AuthDomainRepository;
  constructor(authDomainRepository: AuthDomainRepository) {
    this._repository = authDomainRepository;
  }

  async execute(): Promise<string> {
    return this._repository.logout();
  }
}
