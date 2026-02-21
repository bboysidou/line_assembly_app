// clients.di.ts
import { ClientsDataRepository } from "@/routes/clients/data/repositories/clients.data.repository";
import { CreateClientUsecase } from "@/routes/clients/domain/usecases/create_client.usecase";
import { GetAllClientsUsecase } from "@/routes/clients/domain/usecases/get_all_clients.usecase";
import { GetClientByIdUsecase } from "@/routes/clients/domain/usecases/get_client_by_id.usecase";
import { UpdateClientUsecase } from "@/routes/clients/domain/usecases/update_client.usecase";
import { DeleteClientUsecase } from "@/routes/clients/domain/usecases/delete_client.usecase";

// Create repository instance (singleton)
const dataRepository = new ClientsDataRepository();

// Create use case instances with repository dependency
const createClientUsecase = new CreateClientUsecase(dataRepository);
const getAllClientsUsecase = new GetAllClientsUsecase(dataRepository);
const getClientByIdUsecase = new GetClientByIdUsecase(dataRepository);
const updateClientUsecase = new UpdateClientUsecase(dataRepository);
const deleteClientUsecase = new DeleteClientUsecase(dataRepository);

// Export use cases for controller injection
export {
  createClientUsecase,
  getAllClientsUsecase,
  getClientByIdUsecase,
  updateClientUsecase,
  deleteClientUsecase,
};
