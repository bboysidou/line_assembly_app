import { AssemblyRemoteDataSource } from "@/features/assembly/data/datasources/assembly.remote.datasource";
import { AssemblyDataRepository } from "@/features/assembly/data/repositories/assembly.data.repository";
import { GetAllStepsUsecase } from "@/features/assembly/domain/usecases/get_all_steps.usecase";
import { GetOrderProgressUsecase } from "@/features/assembly/domain/usecases/get_order_progress.usecase";
import { StartStepUsecase } from "@/features/assembly/domain/usecases/start_step.usecase";
import { CompleteStepUsecase } from "@/features/assembly/domain/usecases/complete_step.usecase";
import { GetStepAnalyticsUsecase } from "@/features/assembly/domain/usecases/get_step_analytics.usecase";

const remoteDataSource = new AssemblyRemoteDataSource();
const dataRepository = new AssemblyDataRepository(remoteDataSource);

const getAllStepsUsecase = new GetAllStepsUsecase(dataRepository);
const getOrderProgressUsecase = new GetOrderProgressUsecase(dataRepository);
const startStepUsecase = new StartStepUsecase(dataRepository);
const completeStepUsecase = new CompleteStepUsecase(dataRepository);
const getStepAnalyticsUsecase = new GetStepAnalyticsUsecase(dataRepository);

export {
  getAllStepsUsecase,
  getOrderProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
};
