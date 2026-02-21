import {
  loginUsecase,
  logoutUsecase,
  registerUsecase,
  sessionUsecase,
} from "@/core/dependency_injections/auth.di";
import type { LoginType, RegisterType, UserType } from "../schemas/auth.schema";

export const onLoginAction = async (user: LoginType): Promise<UserType> => {
  try {
    const data = await loginUsecase.execute(user);
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onSessionAction = async (): Promise<UserType> => {
  try {
    const data = await sessionUsecase.execute();
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onRegisterAction = async (
  user: RegisterType,
): Promise<UserType> => {
  try {
    const newUser = {
      ...user,
      id_user_role: Number(user.id_user_role),
    };
    const data = await registerUsecase.execute(newUser);

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onLogoutAction = async (): Promise<string> => {
  try {
    const data = await logoutUsecase.execute();
    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
