import type {
  LoginEntity,
  UserEntity,
  RegisterEntity,
} from "../../domain/entities/auth.entity";
import type { AuthDomainRepository } from "../../domain/repositories/auth.domain.repository";
import type { AuthRemoteDataSource } from "../datasources/auth.remote.datasource";

export class AuthDataRepository implements AuthDomainRepository {
  private readonly _remoteDataSource: AuthRemoteDataSource;
  constructor(remoteDataSource: AuthRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async login(user: LoginEntity): Promise<UserEntity> {
    try {
      const data = await this._remoteDataSource.onLogin(user);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async register(user: RegisterEntity): Promise<UserEntity> {
    try {
      const data = await this._remoteDataSource.onRegister(user);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async session(): Promise<UserEntity> {
    try {
      const data = await this._remoteDataSource.onSession();
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async logout(): Promise<string> {
    try {
      const data = await this._remoteDataSource.onLogout();
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
