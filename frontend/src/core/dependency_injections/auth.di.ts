import { AuthRemoteDataSource } from "@/features/auth/data/datasources/auth.remote.datasource";
import { AuthDataRepository } from "@/features/auth/data/repositories/auth.data.repository";
import { LoginUseCase } from "@/features/auth/domain/usecases/login.usecase";
import { LogoutUseCase } from "@/features/auth/domain/usecases/logout.usecase";
import { RegisterUseCase } from "@/features/auth/domain/usecases/register.usecase";
import { SessionUseCase } from "@/features/auth/domain/usecases/session.usecase";

const remoteDataSource = new AuthRemoteDataSource();
const dataRepository = new AuthDataRepository(remoteDataSource);
const loginUsecase = new LoginUseCase(dataRepository);
const registerUsecase = new RegisterUseCase(dataRepository);
const sessionUsecase = new SessionUseCase(dataRepository);
const logoutUsecase = new LogoutUseCase(dataRepository);

export { loginUsecase, registerUsecase, sessionUsecase, logoutUsecase };
