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
import { QUERY_KEYS } from "@/core/http/type";

// Query Keys - Export for use in components
export const clientKeys = QUERY_KEYS.CLIENTS;

// Pagination response type
export interface PaginatedClientsActionResponse {
  data: ClientSchemaType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query Actions
export const onGetAllClientsAction = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedClientsActionResponse> => {
  try {
    const result = await getAllClientsUsecase.execute(page, limit);
    return {
      data: result.data as unknown as ClientSchemaType[],
      pagination: result.pagination,
    };
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
