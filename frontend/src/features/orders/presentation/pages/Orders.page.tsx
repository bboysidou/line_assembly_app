import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Package,
  Search,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Filter,
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

const statusConfig = {
  pending: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", label: "Pending", dot: "bg-warning" },
  in_progress: { bg: "bg-info/10", text: "text-info", border: "border-info/30", label: "In Progress", dot: "bg-info" },
  completed: { bg: "bg-success/10", text: "text-success", border: "border-success/30", label: "Completed", dot: "bg-success" },
  cancelled: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", label: "Cancelled", dot: "bg-destructive" },
};

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<UpdateOrderSchemaType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"order_number" | "product_name" | "quantity" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
    // Convert empty strings to null for nullable fields
    const processedData = {
      ...data,
      id_client: data.id_client || null,
      notes: data.notes || null,
    };
    
    if (editingOrder) {
      updateMutation.mutate({ ...editingOrder, ...processedData });
    } else {
      createMutation.mutate(processedData);
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

  const handleSort = (field: "order_number" | "product_name" | "quantity" | "created_at") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const aVal = (a[sortField] ?? "") as string | number;
    const bVal = (b[sortField] ?? "") as string | number;
    if (sortField === "created_at") {
      const aDate = aVal ? new Date(aVal as string).getTime() : 0;
      const bDate = bVal ? new Date(bVal as string).getTime() : 0;
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === "asc" ? comparison : -comparison;
  }) || [];

  const pendingCount = orders?.filter((o) => o.status === "pending").length || 0;
  const processingCount = orders?.filter((o) => o.status === "in_progress").length || 0;
  const completedCount = orders?.filter((o) => o.status === "completed").length || 0;

  const SortIcon = ({ field }: { field: "order_number" | "product_name" | "quantity" | "created_at" }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">Manage production orders</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingOrder(null);
            form.reset({
              order_number: "",
              product_name: "",
              quantity: 1,
              status: "pending",
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingOrder(null);
                form.reset({
                  order_number: "",
                  product_name: "",
                  quantity: 1,
                  status: "pending",
                });
              }}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" /> New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingOrder ? "Edit Order" : "New Order"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="order_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter order number" className="bg-background/50" {...field} />
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
                        <Input placeholder="Enter product name" className="bg-background/50" {...field} />
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
                          className="bg-background/50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-warning/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-xl">
                <Package className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-info/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-info/10 rounded-xl">
                <Package className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold">{processingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-success/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <Package className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background/50 border-border/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Orders Directory
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/50">
                    <TableHead className="w-12 text-center font-semibold">#</TableHead>
                    <TableHead
                      className="cursor-pointer select-none font-semibold hover:text-primary transition-colors"
                      onClick={() => handleSort("order_number")}
                    >
                      <div className="flex items-center">Order # <SortIcon field="order_number" /></div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none font-semibold hover:text-primary transition-colors"
                      onClick={() => handleSort("product_name")}
                    >
                      <div className="flex items-center">Product <SortIcon field="product_name" /></div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none font-semibold hover:text-primary transition-colors"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center">Qty <SortIcon field="quantity" /></div>
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead
                      className="cursor-pointer select-none font-semibold hover:text-primary transition-colors"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">Created <SortIcon field="created_at" /></div>
                    </TableHead>
                    <TableHead className="w-16 text-center font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Package className="w-12 h-12 opacity-20" />
                          <p>{searchQuery || statusFilter !== "all" ? "No orders found matching your filters" : "No orders yet"}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order, i) => {
                      const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                      return (
                        <TableRow
                          key={order.id_order}
                          className="group hover:bg-muted/30 transition-colors border-b border-border/30"
                        >
                          <TableCell className="text-center text-muted-foreground font-medium">{i + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
                                <Hash className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <span className="font-medium">{order.order_number}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{order.product_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Hash className="w-4 h-4 opacity-50" />
                              {order.quantity} units
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 opacity-50" />
                              {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-50 hover:opacity-100 hover:bg-primary/10 transition-all">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                                <DropdownMenuItem onClick={() => handleEdit(order)} className="cursor-pointer">
                                  <Pencil className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(order.id_order)} className="cursor-pointer text-destructive focus:text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrdersPage;
