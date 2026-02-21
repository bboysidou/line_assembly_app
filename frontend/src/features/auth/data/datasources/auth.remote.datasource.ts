import { httpPublic } from "@/core/http/http";
import type {
  LoginEntity,
  RegisterEntity,
  UserEntity,
} from "../../domain/entities/auth.entity";

export class AuthRemoteDataSource {
  async onLogin(user: LoginEntity): Promise<UserEntity> {
    try {
      const result = await httpPublic.post<LoginEntity, UserEntity>(
        "/auth/login",
        user,
      );
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onRegister(user: RegisterEntity): Promise<UserEntity> {
    try {
      const result = await httpPublic.post<RegisterEntity, UserEntity>(
        "/auth/register",
        user,
      );
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onSession(): Promise<UserEntity> {
    try {
      const result = await httpPublic.get<UserEntity>("/auth/session");
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onLogout(): Promise<string> {
    try {
      return await httpPublic.get<string>("/auth/logout");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
