import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { OrderProgressEntity } from "../../domain/entities/order_progress.entity";
import type { AssemblyDomainRepository } from "../../domain/repositories/assembly.domain.repository";
import type { AssemblyRemoteDataSource } from "../datasources/assembly.remote.datasource";

export class AssemblyDataRepository implements AssemblyDomainRepository {
  private readonly _remoteDataSource: AssemblyRemoteDataSource;

  constructor(remoteDataSource: AssemblyRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async getAllSteps(): Promise<AssemblyStepEntity[]> {
    try {
      return await this._remoteDataSource.onGetAllSteps();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getOrderProgress(id_order: string): Promise<OrderProgressEntity[]> {
    try {
      return await this._remoteDataSource.onGetOrderProgress(id_order);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getStepAnalytics(
    id_step: number,
    start_date?: string,
    end_date?: string,
  ): Promise<unknown> {
    try {
      return await this._remoteDataSource.onGetStepAnalytics(
        id_step,
        start_date,
        end_date,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async startStep(
    id_order: string,
    id_step: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<OrderProgressEntity> {
    try {
      return await this._remoteDataSource.onStartStep({
        id_order,
        id_step,
        scanned_by,
        barcode,
        notes,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async completeStep(id_progress: string): Promise<OrderProgressEntity> {
    try {
      return await this._remoteDataSource.onCompleteStep(id_progress);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
