// order_items.di.ts
import { OrderItemsDataRepository } from "@/routes/order_items/data/repositories/order_items.data.repository";
import { CreateOrderItemUsecase } from "@/routes/order_items/domain/usecases/create_order_item.usecase";
import { CreateMultipleOrderItemsUsecase } from "@/routes/order_items/domain/usecases/create_multiple_order_items.usecase";
import { GetAllOrderItemsByOrderIdUsecase } from "@/routes/order_items/domain/usecases/get_all_order_items_by_order_id.usecase";
import { UpdateOrderItemUsecase } from "@/routes/order_items/domain/usecases/update_order_item.usecase";
import { DeleteOrderItemUsecase } from "@/routes/order_items/domain/usecases/delete_order_item.usecase";
import { DeleteAllOrderItemsByOrderIdUsecase } from "@/routes/order_items/domain/usecases/delete_all_order_items_by_order_id.usecase";

// Create repository instance (singleton)
const dataRepository = new OrderItemsDataRepository();

// Create use case instances with repository dependency
const createOrderItemUsecase = new CreateOrderItemUsecase(dataRepository);
const createMultipleOrderItemsUsecase = new CreateMultipleOrderItemsUsecase(dataRepository);
const getAllOrderItemsByOrderIdUsecase = new GetAllOrderItemsByOrderIdUsecase(dataRepository);
const updateOrderItemUsecase = new UpdateOrderItemUsecase(dataRepository);
const deleteOrderItemUsecase = new DeleteOrderItemUsecase(dataRepository);
const deleteAllOrderItemsByOrderIdUsecase = new DeleteAllOrderItemsByOrderIdUsecase(dataRepository);

// Export use cases for controller injection
export {
  createOrderItemUsecase,
  createMultipleOrderItemsUsecase,
  getAllOrderItemsByOrderIdUsecase,
  updateOrderItemUsecase,
  deleteOrderItemUsecase,
  deleteAllOrderItemsByOrderIdUsecase,
};
