// clients.data.repository.ts
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type {
  CreateClientEntity,
  UpdateClientEntity,
  ClientEntity,
} from "../../domain/entities/client.entity";
import type { ClientsDomainRepository, PaginatedClientsResponse } from "../../domain/repositories/clients.domain.repository";
import { CreateClientRemoteDataSource } from "../datasources/remote/create_client.remote.datasource";
import { GetAllClientsRemoteDataSource } from "../datasources/remote/get_all_clients.remote.datasource";
import { GetClientByIdRemoteDataSource } from "../datasources/remote/get_client_by_id.remote.datasource";
import { UpdateClientRemoteDataSource } from "../datasources/remote/update_client.remote.datasource";
import { DeleteClientRemoteDataSource } from "../datasources/remote/delete_client.remote.datasource";

export class ClientsDataRepository implements ClientsDomainRepository {
  async getAllClients(page: number = 1, limit: number = 10): Promise<PaginatedClientsResponse> {
    try {
      return await GetAllClientsRemoteDataSource(page, limit);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async getClientById(id_client: string): Promise<ClientEntity> {
    try {
      return await GetClientByIdRemoteDataSource(id_client);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async createClient(client: CreateClientEntity): Promise<ClientEntity> {
    try {
      return await CreateClientRemoteDataSource(client);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async updateClient(client: UpdateClientEntity): Promise<ClientEntity> {
    try {
      return await UpdateClientRemoteDataSource(client);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }

  async deleteClient(id_client: string): Promise<void> {
    try {
      await DeleteClientRemoteDataSource(id_client);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestError) {
        throw new BadRequestError(error.message);
      }
      throw new InternalServerError("An error occurred");
    }
  }
}
