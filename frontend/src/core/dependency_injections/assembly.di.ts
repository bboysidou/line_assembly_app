import { AssemblyRemoteDataSource } from "@/features/assembly/data/datasources/assembly.remote.datasource";
import { AssemblyDataRepository } from "@/features/assembly/data/repositories/assembly.data.repository";
import { GetAllStepsUsecase } from "@/features/assembly/domain/usecases/get_all_steps.usecase";
import { GetItemProgressUsecase } from "@/features/assembly/domain/usecases/get_item_progress.usecase";
import { StartStepUsecase } from "@/features/assembly/domain/usecases/start_step.usecase";
import { CompleteStepUsecase } from "@/features/assembly/domain/usecases/complete_step.usecase";
import { GetStepAnalyticsUsecase } from "@/features/assembly/domain/usecases/get_step_analytics.usecase";
import { StartStepForAllItemsUsecase } from "@/features/assembly/domain/usecases/start_step_for_all_items.usecase";
import { CompleteStepForAllItemsUsecase } from "@/features/assembly/domain/usecases/complete_step_for_all_items.usecase";

const remoteDataSource = new AssemblyRemoteDataSource();
const dataRepository = new AssemblyDataRepository(remoteDataSource);

const getAllStepsUsecase = new GetAllStepsUsecase(dataRepository);
const getItemProgressUsecase = new GetItemProgressUsecase(dataRepository);
const startStepUsecase = new StartStepUsecase(dataRepository);
const completeStepUsecase = new CompleteStepUsecase(dataRepository);
const getStepAnalyticsUsecase = new GetStepAnalyticsUsecase(dataRepository);
const startStepForAllItemsUsecase = new StartStepForAllItemsUsecase(dataRepository);
const completeStepForAllItemsUsecase = new CompleteStepForAllItemsUsecase(dataRepository);

export {
  getAllStepsUsecase,
  getItemProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
  startStepForAllItemsUsecase,
  completeStepForAllItemsUsecase,
};
