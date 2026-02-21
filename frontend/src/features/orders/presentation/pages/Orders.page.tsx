import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Calendar,
  Hash,
} from "lucide-react";
import {
  onGetAllOrdersAction,
  onCreateOrderAction,
  onUpdateOrderAction,
  onDeleteOrderAction,
} from "../actions/orders.action";
import {
  createOrderSchema,
  type CreateOrderSchemaType,
  type UpdateOrderSchemaType,
} from "../schemas/order.schema";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] =
    useState<UpdateOrderSchemaType | null>(null);

  const form = useForm<CreateOrderSchemaType>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      order_number: "",
      product_name: "",
      quantity: 1,
      status: "pending",
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: onGetAllOrdersAction,
    refetchOnMount: true,
  });
  const createMutation = useMutation({
    mutationFn: onCreateOrderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Order created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create order", { description: error.message });
    },
  });
  const updateMutation = useMutation({
    mutationFn: onUpdateOrderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsDialogOpen(false);
      setEditingOrder(null);
      form.reset();
      toast.success("Order updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update order", { description: error.message });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: onDeleteOrderAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete order", { description: error.message });
    },
  });

  const onSubmit = (data: CreateOrderSchemaType) => {
    if (editingOrder) {
      updateMutation.mutate({ ...editingOrder, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (order: UpdateOrderSchemaType) => {
    setEditingOrder(order);
    form.reset({
      order_number: order.order_number,
      product_name: order.product_name,
      quantity: order.quantity,
      status: order.status,
    });
    setIsDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this order?")) deleteMutation.mutate(id);
  };

  const pendingCount =
    orders?.filter((o) => o.status === "pending").length || 0;
  const processingCount =
    orders?.filter((o) => o.status === "in_progress").length || 0;
  const completedCount =
    orders?.filter((o) => o.status === "completed").length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        variants={cardVariants}
      >
        <div>
          <motion.h1
            className="text-3xl font-bold text-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Orders
          </motion.h1>
          <p className="text-muted-foreground mt-1">Manage production orders</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset();
                setEditingOrder(null);
              }}
              className="btn-primary glow-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingOrder ? "Edit Order" : "New Order"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter order number" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter quantity"
                          className="input-focus"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingOrder ? "Update" : "Add"} Order
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={cardVariants}
      >
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending</p>
                <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-info/10 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                <p className="text-3xl font-bold text-info">{processingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-3xl font-bold text-success">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <AnimatePresence>
          {orders?.map((order, i) => {
            const statusConfig = {
              pending: { 
                bg: "bg-warning/10", 
                text: "text-warning", 
                border: "border-l-warning",
                gradient: "from-warning/20 to-warning/5"
              },
              in_progress: { 
                bg: "bg-info/10", 
                text: "text-info", 
                border: "border-l-info",
                gradient: "from-info/20 to-info/5"
              },
              completed: { 
                bg: "bg-success/10", 
                text: "text-success", 
                border: "border-l-success",
                gradient: "from-success/20 to-success/5"
              },
              cancelled: { 
                bg: "bg-destructive/10", 
                text: "text-destructive", 
                border: "border-l-destructive",
                gradient: "from-destructive/20 to-destructive/5"
              },
            };
            const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
            
            return (
              <motion.div
                key={order.id_order}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`card-hover border-border/50 bg-card/50 backdrop-blur-sm border-l-4 ${config.border} overflow-hidden group`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="pt-4 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                          <Package className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{order.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            #{order.order_number}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at || "").toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hash className="w-4 h-4" />
                        {order.quantity} units
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        onClick={() => handleEdit(order)}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDelete(order.id_order)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default OrdersPage;
