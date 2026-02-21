import { OrdersRemoteDataSource } from "@/features/orders/data/datasources/orders.remote.datasource";
import { OrdersDataRepository } from "@/features/orders/data/repositories/orders.data.repository";
import { CreateOrderUsecase } from "@/features/orders/domain/usecases/create_order.usecase";
import { GetAllOrdersUsecase } from "@/features/orders/domain/usecases/get_all_orders.usecase";
import { GetOrderByIdUsecase } from "@/features/orders/domain/usecases/get_order_by_id.usecase";
import { UpdateOrderUsecase } from "@/features/orders/domain/usecases/update_order.usecase";
import { DeleteOrderUsecase } from "@/features/orders/domain/usecases/delete_order.usecase";

const remoteDataSource = new OrdersRemoteDataSource();
const dataRepository = new OrdersDataRepository(remoteDataSource);

const getAllOrdersUsecase = new GetAllOrdersUsecase(dataRepository);
const getOrderByIdUsecase = new GetOrderByIdUsecase(dataRepository);
const createOrderUsecase = new CreateOrderUsecase(dataRepository);
const updateOrderUsecase = new UpdateOrderUsecase(dataRepository);
const deleteOrderUsecase = new DeleteOrderUsecase(dataRepository);

export {
  getAllOrdersUsecase,
  getOrderByIdUsecase,
  createOrderUsecase,
  updateOrderUsecase,
  deleteOrderUsecase,
};
