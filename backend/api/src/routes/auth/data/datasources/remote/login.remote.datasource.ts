import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@/core/errors/custom.error";
import { comparePassword } from "@/core/helpers/function";
import {
  LoginEntity,
  UserEntity,
} from "@/routes/auth/domain/entities/auth.entity";

const LOGIN_QUERY = "SELECT * FROM users WHERE username = $1";

export const LoginRemoteDataSource = async (
  user: LoginEntity,
): Promise<UserEntity> => {
  try {
    const login = await db_client.query(LOGIN_QUERY, [user.username]);
    if (login.rows.length === 0) {
      throw new BadRequestError("Invalid credentials");
    }

    const compareUserPassword = await comparePassword(
      user.password,
      login.rows[0].password,
    );

    if (!compareUserPassword) {
      throw new BadRequestError("Invalid credentials");
    }

    return {
      ...login.rows[0],
      password: "",
    };
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
};
