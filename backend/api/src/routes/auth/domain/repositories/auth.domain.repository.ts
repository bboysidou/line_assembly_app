import type {
  LoginEntity,
  RegisterEntity,
  UserEntity,
} from "../entities/auth.entity";

export interface AuthDomainRepository {
  login(user: LoginEntity): Promise<UserEntity>;
  register(user: RegisterEntity): Promise<UserEntity>;
  session(sid: string): Promise<UserEntity>;
  logout(sid: string): Promise<string>;
}
