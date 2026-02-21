// assembly.data.repository.ts
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { OrderProgressEntity, CreateOrderProgressEntity } from "../../domain/entities/order_progress.entity";
import type { StepTimeLogEntity } from "../../domain/entities/step_time_log.entity";
import type { AssemblyDomainRepository } from "../../domain/repositories/assembly.domain.repository";
import { GetAllStepsRemoteDataSource } from "../datasources/remote/get_all_steps.remote.datasource";
import { GetOrderProgressRemoteDataSource } from "../datasources/remote/get_order_progress.remote.datasource";
import { StartStepRemoteDataSource } from "../datasources/remote/start_step.remote.datasource";
import { CompleteStepRemoteDataSource } from "../datasources/remote/complete_step.remote.datasource";
import { GetStepAnalyticsRemoteDataSource } from "../datasources/remote/get_step_analytics.remote.datasource";

export class AssemblyDataRepository implements AssemblyDomainRepository {
  async getAllSteps(): Promise<AssemblyStepEntity[]> {
    try {
      return await GetAllStepsRemoteDataSource();
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getStepById(id_step: number): Promise<AssemblyStepEntity> {
    try {
      const steps = await GetAllStepsRemoteDataSource();
      const step = steps.find(s => s.id_step === id_step);
      if (!step) {
        throw new BadRequestError("Step not found");
      }
      return step;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getActiveSteps(): Promise<AssemblyStepEntity[]> {
    try {
      const steps = await GetAllStepsRemoteDataSource();
      return steps.filter(s => s.is_active);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrderProgress(id_order: string): Promise<OrderProgressEntity[]> {
    try {
      return await GetOrderProgressRemoteDataSource(id_order);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getCurrentStep(id_order: string): Promise<OrderProgressEntity | null> {
    try {
      const progress = await GetOrderProgressRemoteDataSource(id_order);
      // Return the first step that hasn't been completed yet
      const currentStep = progress.find(p => !p.completed_at);
      return currentStep || null;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async startStep(progress: CreateOrderProgressEntity): Promise<OrderProgressEntity> {
    try {
      return await StartStepRemoteDataSource(progress);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async completeStep(id_progress: string): Promise<OrderProgressEntity> {
    try {
      return await CompleteStepRemoteDataSource(id_progress);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getStepAnalytics(): Promise<{ id_step: number; avg_duration: number; step_name: string }[]> {
    try {
      return await GetStepAnalyticsRemoteDataSource();
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getOrderTimeLogs(id_order: string): Promise<StepTimeLogEntity[]> {
    // This would require an additional query, for now return empty array
    return [];
  }
}
