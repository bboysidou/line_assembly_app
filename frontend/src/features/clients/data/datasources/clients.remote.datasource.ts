// clients.remote.datasource.ts
import { httpPublic, httpPrivate } from "@/core/http/http";
import type {
  CreateClientEntity,
  UpdateClientEntity,
  ClientEntity,
} from "../../domain/entities/client.entity";

const BASE_URL = "/clients";

// Pagination response type
export interface PaginatedClientsResponse {
  data: ClientEntity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ClientsRemoteDataSource {
  async onGetAllClients(page: number = 1, limit: number = 10): Promise<PaginatedClientsResponse> {
    try {
      return await httpPublic.get<PaginatedClientsResponse>(
        `${BASE_URL}/?page=${page}&limit=${limit}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onGetClientById(id_client: string): Promise<ClientEntity> {
    try {
      return await httpPublic.get<ClientEntity>(`${BASE_URL}/${id_client}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onCreateClient(client: CreateClientEntity): Promise<ClientEntity> {
    try {
      return await httpPrivate.post<CreateClientEntity, ClientEntity>(
        `${BASE_URL}/`,
        client,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onUpdateClient(client: UpdateClientEntity): Promise<ClientEntity> {
    try {
      return await httpPrivate.patch<UpdateClientEntity, ClientEntity>(
        `${BASE_URL}/${client.id_client}`,
        client,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }

  async onDeleteClient(id_client: string): Promise<void> {
    try {
      await httpPrivate.delete<{ id_client: string }, void>(`${BASE_URL}/${id_client}`, {
        id_client,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
