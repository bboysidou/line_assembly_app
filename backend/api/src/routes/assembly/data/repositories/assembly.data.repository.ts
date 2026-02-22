// assembly.data.repository.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { ItemProgressEntity, CreateItemProgressEntity } from "../../domain/entities/order_progress.entity";
import type { StepTimeLogEntity } from "../../domain/entities/step_time_log.entity";
import type { AssemblyDomainRepository } from "../../domain/repositories/assembly.domain.repository";
import { GetAllStepsRemoteDataSource } from "../datasources/remote/get_all_steps.remote.datasource";
import { GetItemProgressRemoteDataSource } from "../datasources/remote/get_order_progress.remote.datasource";
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

  async getItemProgress(id_order_item: string): Promise<(ItemProgressEntity & { step_name: string; step_order: number })[]> {
    try {
      return await GetItemProgressRemoteDataSource(id_order_item);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getCurrentStep(id_order_item: string): Promise<(ItemProgressEntity & { step_name: string; step_order: number }) | null> {
    try {
      const progress = await GetItemProgressRemoteDataSource(id_order_item);
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

  async getCurrentStepForUnit(id_order_item: string, unit_number: number): Promise<(ItemProgressEntity & { step_name: string; step_order: number }) | null> {
    try {
      const progress = await GetItemProgressRemoteDataSource(id_order_item);
      // Return the first step that hasn't been completed yet for this specific unit
      const currentStep = progress.find(p => !p.completed_at && p.unit_number === unit_number);
      return currentStep || null;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async startStep(progress: CreateItemProgressEntity): Promise<ItemProgressEntity> {
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

  async completeStep(id_progress: string): Promise<ItemProgressEntity> {
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

  async getItemTimeLogs(id_order_item: string): Promise<StepTimeLogEntity[]> {
    try {
      const query = `
        SELECT * FROM step_time_logs
        WHERE id_order_item = $1
        ORDER BY completed_at DESC
      `;
      const result = await db_client.query(query, [id_order_item]);
      return result.rows;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async startStepForAllItems(id_order: string, id_step: number): Promise<ItemProgressEntity[]> {
    try {
      // Get all items for this order with their quantities
      const itemsQuery = `SELECT id_order_item, quantity FROM order_items WHERE id_order = $1`;
      const itemsResult = await db_client.query(itemsQuery, [id_order]);
      
      const results: ItemProgressEntity[] = [];
      
      for (const item of itemsResult.rows) {
        // Start step for each unit in the quantity
        for (let unit_number = 1; unit_number <= item.quantity; unit_number++) {
          try {
            const result = await StartStepRemoteDataSource({
              id_order_item: item.id_order_item,
              id_step,
              unit_number,
              started_at: new Date(),
            });
            results.push(result);
          } catch (error) {
            // Log error but continue with other items
            console.log(`Failed to start step for item ${item.id_order_item} unit ${unit_number}:`, error);
          }
        }
      }
      
      return results;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async completeStepForAllItems(id_order: string, id_step: number): Promise<ItemProgressEntity[]> {
    try {
      // Get all in-progress items for this order and step
      const query = `
        SELECT ip.id_progress 
        FROM item_progress ip
        JOIN order_items oi ON ip.id_order_item = oi.id_order_item
        WHERE oi.id_order = $1 AND ip.id_step = $2 AND ip.completed_at IS NULL
      `;
      const result = await db_client.query(query, [id_order, id_step]);
      
      const results: ItemProgressEntity[] = [];
      
      for (const row of result.rows) {
        try {
          const completed = await CompleteStepRemoteDataSource(row.id_progress);
          results.push(completed);
        } catch (error) {
          // Log error but continue with other items
          console.log(`Failed to complete step ${row.id_progress}:`, error);
        }
      }
      
      return results;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }
}
