import {
  createOrderUsecase,
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  updateOrderUsecase,
  deleteOrderUsecase,
} from "@/core/dependency_injections/orders.di";
import type {
  CreateOrderSchemaType,
  UpdateOrderSchemaType,
  OrderSchemaType,
} from "../schemas/order.schema";

// Query Actions
export const onGetAllOrdersAction = async (): Promise<OrderSchemaType[]> => {
  try {
    return await getAllOrdersUsecase.execute() as unknown as OrderSchemaType[];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onGetOrderByIdAction = async (
  id_order: string,
): Promise<OrderSchemaType> => {
  try {
    return await getOrderByIdUsecase.execute(id_order) as unknown as OrderSchemaType;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

// Mutation Actions
export const onCreateOrderAction = async (
  order: CreateOrderSchemaType,
): Promise<OrderSchemaType> => {
  try {
    return await createOrderUsecase.execute(order) as unknown as OrderSchemaType;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onUpdateOrderAction = async (
  order: UpdateOrderSchemaType,
): Promise<OrderSchemaType> => {
  try {
    return await updateOrderUsecase.execute(order) as unknown as OrderSchemaType;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};

export const onDeleteOrderAction = async (
  id_order: string,
): Promise<OrderSchemaType> => {
  try {
    return await deleteOrderUsecase.execute(id_order) as unknown as OrderSchemaType;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    throw new Error(message);
  }
};
