// clients.domain.repository.ts
import type {
  CreateClientEntity,
  UpdateClientEntity,
  ClientEntity,
} from "../entities/client.entity";

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

export interface ClientsDomainRepository {
  getAllClients(page?: number, limit?: number): Promise<PaginatedClientsResponse>;
  getClientById(id_client: string): Promise<ClientEntity>;
  createClient(client: CreateClientEntity): Promise<ClientEntity>;
  updateClient(client: UpdateClientEntity): Promise<ClientEntity>;
  deleteClient(id_client: string): Promise<void>;
}
