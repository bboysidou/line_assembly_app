// order_items.di.ts
import { OrderItemsDataRepository } from "@/features/order_items/data/repositories/order_items.data.repository";
import { OrderItemsRemoteDataSource } from "@/features/order_items/data/datasources/order_items.remote.datasource";
import { GetAllOrderItemsByOrderIdUsecase } from "@/features/order_items/domain/usecases/get_all_order_items_by_order_id.usecase";
import { CreateMultipleOrderItemsUsecase } from "@/features/order_items/domain/usecases/create_multiple_order_items.usecase";

// Create remote data source instance
const remoteDataSource = new OrderItemsRemoteDataSource();

// Create repository instance with remote data source
const dataRepository = new OrderItemsDataRepository(remoteDataSource);

// Create use case instances with repository dependency
const getAllOrderItemsByOrderIdUsecase = new GetAllOrderItemsByOrderIdUsecase(dataRepository);
const createMultipleOrderItemsUsecase = new CreateMultipleOrderItemsUsecase(dataRepository);

// Export use cases for action injection
export {
  getAllOrderItemsByOrderIdUsecase,
  createMultipleOrderItemsUsecase,
};
