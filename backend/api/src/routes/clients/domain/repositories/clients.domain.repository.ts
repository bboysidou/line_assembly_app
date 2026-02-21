// clients.domain.repository.ts
import type {
  CreateClientEntity,
  UpdateClientEntity,
  ClientEntity,
} from "../entities/client.entity";

export interface ClientsDomainRepository {
  // Query Operations (Read)
  getAllClients(): Promise<ClientEntity[]>;
  getClientById(id_client: string): Promise<ClientEntity>;

  // Command Operations (Write)
  createClient(client: CreateClientEntity): Promise<ClientEntity>;
  updateClient(client: UpdateClientEntity): Promise<ClientEntity>;
  deleteClient(id_client: string): Promise<void>;
}
