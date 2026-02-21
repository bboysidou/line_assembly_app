// clients.data.repository.ts
import type {
  CreateClientEntity,
  UpdateClientEntity,
  ClientEntity,
} from "../../domain/entities/client.entity";
import type { ClientsDomainRepository } from "../../domain/repositories/clients.domain.repository";
import type { ClientsRemoteDataSource } from "../datasources/clients.remote.datasource";

export class ClientsDataRepository implements ClientsDomainRepository {
  private readonly _remoteDataSource: ClientsRemoteDataSource;

  constructor(remoteDataSource: ClientsRemoteDataSource) {
    this._remoteDataSource = remoteDataSource;
  }

  async getAllClients(): Promise<ClientEntity[]> {
    try {
      return await this._remoteDataSource.onGetAllClients();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async getClientById(id_client: string): Promise<ClientEntity> {
    try {
      return await this._remoteDataSource.onGetClientById(id_client);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async createClient(client: CreateClientEntity): Promise<ClientEntity> {
    try {
      return await this._remoteDataSource.onCreateClient(client);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async updateClient(client: UpdateClientEntity): Promise<ClientEntity> {
    try {
      return await this._remoteDataSource.onUpdateClient(client);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async deleteClient(id_client: string): Promise<void> {
    try {
      await this._remoteDataSource.onDeleteClient(id_client);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
