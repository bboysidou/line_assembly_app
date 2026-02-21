import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import { hashPassword } from "@/core/helpers/function";
import {
  RegisterEntity,
  UserEntity,
} from "@/routes/auth/domain/entities/auth.entity";

const LOGIN_QUERY = "SELECT username FROM users WHERE username = $1";

const REGISTER_QUERY =
  "INSERT INTO users (username, password, id_user_role) VALUES ($1, $2, $3) RETURNING id_user";

export const RegisterRemoteDataSource = async (
  user: RegisterEntity,
): Promise<UserEntity> => {
  try {
    const login = await db_client.query(LOGIN_QUERY, [user.username]);
    if (login.rows.length !== 0) {
      throw new BadRequestError("Invalid credentials");
    }
    const hashUserPassword = await hashPassword(user.password);

    const register = await db_client.query(REGISTER_QUERY, [
      user.username,
      hashUserPassword,
      user.id_user_role,
    ]);
    return {
      ...register.rows[0],
      password: "",
    };
  } catch (error) {
    console.log(error);
    throw new InternalServerError("An error ocurred");
  }
};
