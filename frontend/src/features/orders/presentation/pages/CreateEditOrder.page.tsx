import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Package,
  User,
  FileText,
  Hash,
  Tag,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import {
  onGetAllClientsAction,
} from "@/features/clients/presentation/actions/clients.action";
import {
  onCreateOrderAction,
  onUpdateOrderAction,
  onGetOrderByIdAction,
} from "../actions/orders.action";
import {
  onGetAllOrderItemsByOrderIdAction,
  onCreateMultipleOrderItemsAction,
} from "@/features/order_items/presentation/actions/order_items.action";
import {
  createOrderSchema,
  updateOrderSchema,
  type CreateOrderSchemaType,
  type UpdateOrderSchemaType,
  OrderStatusEnumList,
} from "../schemas/order.schema";
import {
  createOrderItemFormSchema,
  type CreateOrderItemFormSchemaType,
} from "@/features/order_items/presentation/schemas/order_item.schema";
import { PathManager } from "@/core/routes/path_manager.route";

const statusOptions = [
  { value: "pending", label: "Pending", description: "Order received, waiting to start", color: "bg-warning/10 text-warning border-warning/30" },
  { value: "in_progress", label: "In Progress", description: "Currently being processed", color: "bg-info/10 text-info border-info/30" },
  { value: "completed", label: "Completed", description: "Order finished successfully", color: "bg-success/10 text-success border-success/30" },
  { value: "cancelled", label: "Cancelled", description: "Order was cancelled", color: "bg-destructive/10 text-destructive border-destructive/30" },
];

// Form schema for order with items
const orderWithItemsSchema = createOrderSchema.extend({
  items: createOrderItemFormSchema.array().min(1, "At least one item is required"),
});

type OrderWithItemsSchemaType = CreateOrderSchemaType & {
  items: CreateOrderItemFormSchemaType[];
};

const CreateEditOrderPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const isEditing = !!editId;

  // Create form (without status, with items)
  const createForm = useForm<OrderWithItemsSchemaType>({
    resolver: zodResolver(orderWithItemsSchema),
    defaultValues: {
      id_client: "",
      notes: "",
      items: [{ product_name: "", quantity: 1, notes: null }],
    },
  });

  // Edit form (with status, with items)
  const editForm = useForm<UpdateOrderSchemaType & { items: CreateOrderItemFormSchemaType[] }>({
    resolver: zodResolver(updateOrderSchema.extend({
      items: createOrderItemFormSchema.array().min(1, "At least one item is required"),
    })),
    defaultValues: {
      id_order: "",
      id_client: "",
      order_number: "",
      product_name: "",
      quantity: 1,
      status: "pending",
      notes: "",
      items: [{ product_name: "", quantity: 1, notes: null }],
    },
  });

  // Field arrays for items
  const createItemsFields = useFieldArray({
    control: createForm.control,
    name: "items",
  });

  const editItemsFields = useFieldArray({
    control: editForm.control,
    name: "items",
  });

  // Watch form values for preview
  const watchedValues = isEditing ? editForm.watch() : createForm.watch();

  // Fetch clients for dropdown (with large limit to get all clients for dropdown)
  const { data: clientsResponse, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", 1, 1000],
    queryFn: () => onGetAllClientsAction(1, 1000),
  });
  
  // Extract clients data from paginated response
  const clients = clientsResponse?.data;

  // Fetch order data if editing
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["order", editId],
    queryFn: () => onGetOrderByIdAction(editId!),
    enabled: !!editId,
  });

  // Fetch order items if editing
  const { data: orderItems, isLoading: orderItemsLoading } = useQuery({
    queryKey: ["order-items", editId],
    queryFn: () => onGetAllOrderItemsByOrderIdAction(editId!),
    enabled: !!editId,
  });

  // Populate form when editing
  useEffect(() => {
    if (orderData && isEditing && orderItems) {
      editForm.reset({
        id_order: orderData.id_order,
        id_client: orderData.id_client || "",
        order_number: orderData.order_number || "",
        product_name: orderData.product_name || "",
        quantity: orderData.quantity || 1,
        status: (orderData.status as "pending" | "in_progress" | "completed" | "cancelled") || "pending",
        notes: orderData.notes || "",
        items: orderItems.length > 0 
          ? orderItems.map(item => ({
              product_name: item.product_name,
              quantity: item.quantity,
              notes: item.notes,
            }))
          : [{ product_name: orderData.product_name || "", quantity: orderData.quantity || 1, notes: null }],
      });
    }
  }, [orderData, orderItems, isEditing, editForm]);

  const createMutation = useMutation({
    mutationFn: async (data: OrderWithItemsSchemaType) => {
      // First create the order
      const order = await onCreateOrderAction({
        id_client: data.id_client,
        notes: data.notes || null,
      });
      
      // Then create the order items
      if (data.items.length > 0) {
        await onCreateMultipleOrderItemsAction(order.id_order, data.items);
      }
      
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully");
      navigate(PathManager.ORDERS_PAGE);
    },
    onError: (error: Error) => {
      toast.error("Failed to create order", { description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateOrderSchemaType & { items: CreateOrderItemFormSchemaType[] }) => {
      // Update the order
      const order = await onUpdateOrderAction({
        id_order: data.id_order,
        id_client: data.id_client || null,
        order_number: data.order_number || null,
        product_name: data.product_name,
        quantity: data.quantity,
        status: data.status,
        notes: data.notes || null,
      });
      
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully");
      navigate(PathManager.ORDERS_PAGE);
    },
    onError: (error: Error) => {
      toast.error("Failed to update order", { description: error.message });
    },
  });

  const onCreateSubmit = (data: OrderWithItemsSchemaType) => {
    createMutation.mutate(data);
  };

  const onUpdateSubmit = (data: UpdateOrderSchemaType & { items: CreateOrderItemFormSchemaType[] }) => {
    updateMutation.mutate(data);
  };

  const isLoading = clientsLoading || (isEditing && (orderLoading || orderItemsLoading));
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Get selected client for preview
  const selectedClient = clients?.find(c => c.id_client === watchedValues.id_client);

  // Calculate total quantity for preview
  const totalQuantity = isEditing 
    ? editForm.watch("items")?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0
    : createForm.watch("items")?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PathManager.ORDERS_PAGE)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {isEditing ? "Edit Order" : "Create New Order"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Update order details and information" : "Fill in the details to create a new production order"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Client Selection */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-violet-500" />
                Client Information <span className="text-destructive">*</span>
              </CardTitle>
              <CardDescription>Select a client for this order (required)</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...editForm}>
                  <FormField
                    control={editForm.control}
                    name="id_client"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 h-12">
                              <SelectValue placeholder="Choose a client..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {clients?.map((client) => (
                              <SelectItem key={client.id_client} value={client.id_client} className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">{client.client_name}</span>
                                  <span className="text-xs text-muted-foreground">{client.client_email}</span>
                                </div>
                              </SelectItem>
                            ))}
                            {(!clients || clients.length === 0) && (
                              <div className="p-4 text-center text-muted-foreground">
                                No clients available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <Form {...createForm}>
                  <FormField
                    control={createForm.control}
                    name="id_client"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 h-12">
                              <SelectValue placeholder="Choose a client..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {clients?.map((client) => (
                              <SelectItem key={client.id_client} value={client.id_client} className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">{client.client_name}</span>
                                  <span className="text-xs text-muted-foreground">{client.client_email}</span>
                                </div>
                              </SelectItem>
                            ))}
                            {(!clients || clients.length === 0) && (
                              <div className="p-4 text-center text-muted-foreground">
                                No clients available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-primary/60" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Order Items
                  </CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? `Order Number: ${orderData?.order_number || "Loading..."}`
                      : "Add products to this order"}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? editItemsFields.append({ product_name: "", quantity: 1, notes: null }) : createItemsFields.append({ product_name: "", quantity: 1, notes: null })}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...editForm}>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {editItemsFields.fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 rounded-lg bg-muted/30 border border-border/30"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name={`items.${index}.product_name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Widget Pro X" className="bg-background/50 border-border/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={editForm.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        className="bg-background/50 border-border/50"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {editItemsFields.fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => editItemsFields.remove(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </Form>
              ) : (
                <Form {...createForm}>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {createItemsFields.fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 rounded-lg bg-muted/30 border border-border/30"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={createForm.control}
                                name={`items.${index}.product_name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Widget Pro X" className="bg-background/50 border-border/50" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={createForm.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        placeholder="1"
                                        className="bg-background/50 border-border/50"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {createItemsFields.fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => createItemsFields.remove(index)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Status (only for editing) */}
          {isEditing && (
            <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                  Order Status
                </CardTitle>
                <CardDescription>Update the order status</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...editForm}>
                  <FormField
                    control={editForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/50 h-12">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-xl">
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value} className="py-3">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${status.color.split(' ')[0]}`} />
                                  <span>{status.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-info to-cyan-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-info" />
                Additional Notes
              </CardTitle>
              <CardDescription>Any special instructions or comments</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...editForm}>
                  <FormField
                    control={editForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes, special requirements, or instructions..."
                            className="bg-background/50 border-border/50 min-h-[120px] resize-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <Form {...createForm}>
                  <FormField
                    control={createForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes, special requirements, or instructions..."
                            className="bg-background/50 border-border/50 min-h-[120px] resize-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview & Actions Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Order Preview Card */}
          <Card className="border-border/50 dark:border-zinc-800 bg-gradient-to-br from-card/50 to-card/30 dark:from-zinc-900 dark:to-zinc-950 backdrop-blur-sm sticky top-6">
            <div className="h-1 bg-gradient-to-r from-success via-emerald-500 to-teal-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-success" />
                Order Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Preview */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="w-4 h-4" />
                  Client
                </div>
                {selectedClient ? (
                  <div>
                    <p className="font-medium">{selectedClient.client_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedClient.client_email}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No client selected</p>
                )}
              </div>

              {/* Order Number (only for editing) */}
              {isEditing && orderData?.order_number && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Hash className="w-4 h-4" />
                    Order Number
                  </div>
                  <p className="font-medium font-mono">{orderData.order_number}</p>
                </div>
              )}

              {/* Order Info Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Package className="w-3 h-3" />
                    Total Items
                  </div>
                  <p className="font-medium">{watchedValues.items?.length || 0} items</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <ShoppingCart className="w-3 h-3" />
                    Total Qty
                  </div>
                  <p className="font-medium">{totalQuantity} units</p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Tag className="w-4 h-4" />
                  Products
                </div>
                <div className="space-y-2">
                  {watchedValues.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="truncate">{item?.product_name || "-"}</span>
                      <span className="text-muted-foreground">×{item?.quantity || 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Preview */}
              <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Status
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isEditing && 'status' in watchedValues
                    ? (statusOptions.find(s => s.value === watchedValues.status)?.color || "bg-muted")
                    : "bg-warning/10 text-warning border-warning/30"
                }`}>
                  {isEditing && 'status' in watchedValues
                    ? (statusOptions.find(s => s.value === watchedValues.status)?.label || "Pending")
                    : "Pending"}
                </span>
              </div>

              {/* Notes Preview */}
              {watchedValues.notes && (
                <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </div>
                  <p className="text-sm line-clamp-3">{watchedValues.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-3">
              {isEditing ? (
                <Button
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25"
                  disabled={isSubmitting}
                  onClick={editForm.handleSubmit(onUpdateSubmit)}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                  )}
                  Update Order
                </Button>
              ) : (
                <Button
                  className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25"
                  disabled={isSubmitting}
                  onClick={createForm.handleSubmit(onCreateSubmit)}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                  )}
                  Create Order
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(PathManager.ORDERS_PAGE)}
                className="w-full h-12"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEditOrderPage;
