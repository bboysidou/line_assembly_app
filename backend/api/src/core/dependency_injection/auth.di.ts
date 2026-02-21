import { AuthDataRepository } from "@/routes/auth/data/repositories/auth.data.repository";
import { LoginUseCase } from "@/routes/auth/domain/usecases/login.usecase";
import { LogoutUseCase } from "@/routes/auth/domain/usecases/logout.usecase";
import { RegisterUseCase } from "@/routes/auth/domain/usecases/register.usecase";
import { SessionUseCase } from "@/routes/auth/domain/usecases/session.usecase";

const dataRepository = new AuthDataRepository();
const loginUsecase = new LoginUseCase(dataRepository);
const registerUsecase = new RegisterUseCase(dataRepository);
const sessionUsecase = new SessionUseCase(dataRepository);
const logoutUsecase = new LogoutUseCase(dataRepository);

export { loginUsecase, registerUsecase, sessionUsecase, logoutUsecase };
