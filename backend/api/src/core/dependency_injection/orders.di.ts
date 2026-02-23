// orders.di.ts
import { OrdersDataRepository } from "@/routes/orders/data/repositories/orders.data.repository";
import { CreateOrderUsecase } from "@/routes/orders/domain/usecases/create_order.usecase";
import { GetAllOrdersUsecase } from "@/routes/orders/domain/usecases/get_all_orders.usecase";
import { GetOrderByIdUsecase } from "@/routes/orders/domain/usecases/get_order_by_id.usecase";
import { UpdateOrderUsecase } from "@/routes/orders/domain/usecases/update_order.usecase";
import { DeleteOrderUsecase } from "@/routes/orders/domain/usecases/delete_order.usecase";
import { GetOrderItemsWithProgressUsecase } from "@/routes/orders/domain/usecases/get_order_items_with_progress.usecase";

// Create repository instance (singleton)
const dataRepository = new OrdersDataRepository();

// Create use case instances with repository dependency
const createOrderUsecase = new CreateOrderUsecase(dataRepository);
const getAllOrdersUsecase = new GetAllOrdersUsecase(dataRepository);
const getOrderByIdUsecase = new GetOrderByIdUsecase(dataRepository);
const updateOrderUsecase = new UpdateOrderUsecase(dataRepository);
const deleteOrderUsecase = new DeleteOrderUsecase(dataRepository);
const getOrderItemsWithProgressUsecase = new GetOrderItemsWithProgressUsecase(dataRepository);

// Export use cases for controller injection
export {
  createOrderUsecase,
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  updateOrderUsecase,
  deleteOrderUsecase,
  getOrderItemsWithProgressUsecase,
};
