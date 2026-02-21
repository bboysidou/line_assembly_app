import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@/core/errors/custom.error";
import {
  LoginEntity,
  RegisterEntity,
  UserEntity,
} from "../../domain/entities/auth.entity";
import { AuthDomainRepository } from "../../domain/repositories/auth.domain.repository";
import { LoginRemoteDataSource } from "../datasources/remote/login.remote.datasource";
import { RegisterRemoteDataSource } from "../datasources/remote/register.remote.datasource";
import { UserSessionRemoteDataSource } from "../datasources/remote/user_session.remote.datasource";
import { LogoutRemoteDataSource } from "../datasources/remote/logout.remote.datasource";

export class AuthDataRepository implements AuthDomainRepository {
  async login(user: LoginEntity): Promise<UserEntity> {
    try {
      return await LoginRemoteDataSource(user);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedError(error.message);
      }
      throw new InternalServerError("An error ocurred");
    }
  }

  async register(user: RegisterEntity): Promise<UserEntity> {
    try {
      return await RegisterRemoteDataSource(user);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new Error(error.message);
      }
      throw new InternalServerError("An error ocurred");
    }
  }

  async session(sid: string): Promise<UserEntity> {
    try {
      return await UserSessionRemoteDataSource(sid);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new Error(error.message);
      }
      throw new InternalServerError("An error ocurred");
    }
  }

  async logout(sid: string): Promise<string> {
    try {
      return await LogoutRemoteDataSource(sid);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new Error(error.message);
      }
      throw new InternalServerError("An error ocurred");
    }
  }
}
