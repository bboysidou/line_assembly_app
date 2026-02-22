import type { AssemblyStepEntity } from "../../domain/entities/assembly_step.entity";
import type { ItemProgressEntity } from "../../domain/entities/item_progress.entity";
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

  async getItemProgress(id_order_item: string): Promise<ItemProgressEntity[]> {
    try {
      return await this._remoteDataSource.onGetItemProgress(id_order_item);
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
    id_order_item: string,
    id_step: number,
    unit_number: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity> {
    try {
      return await this._remoteDataSource.onStartStep({
        id_order_item,
        id_step,
        unit_number,
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

  async completeStep(id_progress: string): Promise<ItemProgressEntity> {
    try {
      return await this._remoteDataSource.onCompleteStep(id_progress);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async startStepForAllItems(
    id_order: string,
    id_step: number,
    scanned_by?: string,
    barcode?: string,
    notes?: string,
  ): Promise<ItemProgressEntity[]> {
    try {
      return await this._remoteDataSource.onStartStepForAllItems({
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

  async completeStepForAllItems(
    id_order: string,
    id_step: number,
  ): Promise<ItemProgressEntity[]> {
    try {
      return await this._remoteDataSource.onCompleteStepForAllItems({
        id_order,
        id_step,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
