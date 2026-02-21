import { AuthDomainRepository } from "../repositories/auth.domain.repository";

export class LogoutUseCase {
  private readonly _repository: AuthDomainRepository;
  constructor(authDomainRepository: AuthDomainRepository) {
    this._repository = authDomainRepository;
  }

  async execute(sid: string): Promise<string> {
    return this._repository.logout(sid);
  }
}
