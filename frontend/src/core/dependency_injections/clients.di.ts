// clients.di.ts
import { ClientsRemoteDataSource } from "@/features/clients/data/datasources/clients.remote.datasource";
import { ClientsDataRepository } from "@/features/clients/data/repositories/clients.data.repository";
import { GetAllClientsUsecase } from "@/features/clients/domain/usecases/get_all_clients.usecase";
import { GetClientByIdUsecase } from "@/features/clients/domain/usecases/get_client_by_id.usecase";
import { CreateClientUsecase } from "@/features/clients/domain/usecases/create_client.usecase";
import { UpdateClientUsecase } from "@/features/clients/domain/usecases/update_client.usecase";
import { DeleteClientUsecase } from "@/features/clients/domain/usecases/delete_client.usecase";

const remoteDataSource = new ClientsRemoteDataSource();
const dataRepository = new ClientsDataRepository(remoteDataSource);

const getAllClientsUsecase = new GetAllClientsUsecase(dataRepository);
const getClientByIdUsecase = new GetClientByIdUsecase(dataRepository);
const createClientUsecase = new CreateClientUsecase(dataRepository);
const updateClientUsecase = new UpdateClientUsecase(dataRepository);
const deleteClientUsecase = new DeleteClientUsecase(dataRepository);

export {
  getAllClientsUsecase,
  getClientByIdUsecase,
  createClientUsecase,
  updateClientUsecase,
  deleteClientUsecase,
};
