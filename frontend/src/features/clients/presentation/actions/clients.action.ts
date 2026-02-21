// clients.action.ts
import {
  getAllClientsUsecase,
  getClientByIdUsecase,
  createClientUsecase,
  updateClientUsecase,
  deleteClientUsecase,
} from "@/core/dependency_injections/clients.di";
import type {
  CreateClientSchemaType,
  UpdateClientSchemaType,
  ClientSchemaType,
} from "../schemas/clients.schema";

// Query Actions
export const onGetAllClientsAction = async (): Promise<ClientSchemaType[]> => {
  try {
    return await getAllClientsUsecase.execute();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetClientByIdAction = async (
  id_client: string,
): Promise<ClientSchemaType> => {
  try {
    return await getClientByIdUsecase.execute(id_client);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

// Mutation Actions
export const onCreateClientAction = async (
  client: CreateClientSchemaType,
): Promise<ClientSchemaType> => {
  try {
    return await createClientUsecase.execute(client);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onUpdateClientAction = async (
  client: UpdateClientSchemaType,
): Promise<ClientSchemaType> => {
  try {
    return await updateClientUsecase.execute(client);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onDeleteClientAction = async (
  id_client: string,
): Promise<void> => {
  await deleteClientUsecase.execute(id_client);
};
