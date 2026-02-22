// assembly.di.ts
import { AssemblyDataRepository } from "@/routes/assembly/data/repositories/assembly.data.repository";
import { GetAllStepsUsecase } from "@/routes/assembly/domain/usecases/get_all_steps.usecase";
import { GetItemProgressUsecase, GetOrderProgressUsecase } from "@/routes/assembly/domain/usecases/get_order_progress.usecase";
import { StartStepUsecase } from "@/routes/assembly/domain/usecases/start_step.usecase";
import { CompleteStepUsecase } from "@/routes/assembly/domain/usecases/complete_step.usecase";
import { GetStepAnalyticsUsecase } from "@/routes/assembly/domain/usecases/get_step_analytics.usecase";
import { StartStepForAllItemsUsecase } from "@/routes/assembly/domain/usecases/start_step_for_all_items.usecase";
import { CompleteStepForAllItemsUsecase } from "@/routes/assembly/domain/usecases/complete_step_for_all_items.usecase";

// Create repository instance (singleton)
const dataRepository = new AssemblyDataRepository();

// Create use case instances with repository dependency
const getAllStepsUsecase = new GetAllStepsUsecase(dataRepository);
const getItemProgressUsecase = new GetItemProgressUsecase(dataRepository);
const getOrderProgressUsecase = new GetOrderProgressUsecase(dataRepository);
const startStepUsecase = new StartStepUsecase(dataRepository);
const completeStepUsecase = new CompleteStepUsecase(dataRepository);
const getStepAnalyticsUsecase = new GetStepAnalyticsUsecase(dataRepository);
const startStepForAllItemsUsecase = new StartStepForAllItemsUsecase(dataRepository);
const completeStepForAllItemsUsecase = new CompleteStepForAllItemsUsecase(dataRepository);

// Export use cases for controller injection
export {
  getAllStepsUsecase,
  getItemProgressUsecase,
  getOrderProgressUsecase,
  startStepUsecase,
  completeStepUsecase,
  getStepAnalyticsUsecase,
  startStepForAllItemsUsecase,
  completeStepForAllItemsUsecase,
};
