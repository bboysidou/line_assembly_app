import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Package,
  User,
  Hash,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Building,
  FileText,
  Sparkles,
  ShoppingCart,
} from "lucide-react";
import { onGetOrderByIdAction } from "../actions/orders.action";
import { onGetOrderItemsWithProgressAction } from "@/features/order_items/presentation/actions/order_items.action";
import { onGetAllStepsAction } from "@/features/assembly/presentation/actions/assembly.action";
import {
  onCompleteStepAction,
  onStartStepForAllItemsAction,
  onCompleteStepForAllItemsAction,
} from "@/features/assembly/presentation/actions/assembly.action";
import { onGetClientByIdAction } from "@/features/clients/presentation/actions/clients.action";
import type { OrderItemWithProgressEntity } from "@/features/order_items/domain/entities/order_item_with_progress.entity";
import type { AssemblyStepEntity } from "@/features/assembly/domain/entities/assembly_step.entity";

const statusConfig = {
  pending: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", label: "Pending" },
  in_progress: { bg: "bg-info/10", text: "text-info", border: "border-info/30", label: "In Progress" },
  completed: { bg: "bg-success/10", text: "text-success", border: "border-success/30", label: "Completed" },
  cancelled: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", label: "Cancelled" },
};

// Item Log Card Component
interface ItemLogCardProps {
  item: OrderItemWithProgressEntity;
  steps: AssemblyStepEntity[];
  onCompleteStep: (id_progress: string) => void;
  isCompleting: boolean;
}

const ItemLogCard = ({
  item,
  steps,
  onCompleteStep,
  isCompleting,
}: ItemLogCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalSteps = steps.length;
  
  // Calculate progress percentage based on completed steps in progress array
  const getProgressPercentage = (): number => {
    if (item.current_step_status === "completed") return 100;
    if (!item.progress || item.progress.length === 0) return 0;
    const completedSteps = item.progress.filter(p => p.completed_at !== null).length;
    return Math.round((completedSteps / totalSteps) * 100);
  };
  
  // Get status text
  const getStatusText = (): string => {
    if (item.current_step_status === "completed") return "Completed";
    if (item.current_step_status === "in_progress") return `In ${item.current_step_name || "Progress"}`;
    return "Not Started";
  };
  
  const progressPercent = getProgressPercentage();
  const statusText = getStatusText();

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  // Get the id_progress for the current step (in progress)
  const getCurrentProgressId = (): string => {
    if (!item.progress) return "";
    const currentProgress = item.progress.find(p => p.started_at !== null && p.completed_at === null);
    return currentProgress?.id_progress || "";
  };

  return (
    <Card className="mb-3 border-l-4 border-l-primary/30 hover:border-l-primary/60 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{item.product_name} <span className="text-muted-foreground font-normal">#{item.unit_number}</span></CardTitle>
              <p className="text-sm text-muted-foreground">Unit {item.unit_number} of {item.quantity}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${item.current_step_status === "completed" ? "bg-success/10 text-success border-success/30" : item.current_step_status === "in_progress" ? "bg-info/10 text-info border-info/30" : "bg-muted/50 text-muted-foreground border-muted-foreground/30"}`}
            >
              {statusText}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-primary/10"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => {
            const isCompleted = item.progress?.some(p => p.id_step === step.id_step && p.completed_at !== null) || false;
            const isCurrent = item.current_step_id === step.id_step && item.current_step_status === "in_progress";

            return (
              <div key={step.id_step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                        ? "bg-info text-info-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center max-w-[60px] truncate">
                  {step.step_name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current Step Actions */}
        {item.current_step_status === "in_progress" && item.current_step_id && (
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="default"
              onClick={() => onCompleteStep(getCurrentProgressId())}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Complete Step
            </Button>
          </div>
        )}

        {/* Expanded History */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            <h4 className="font-medium mb-3">Step History</h4>
            {item.progress && item.progress.length > 0 ? (
              <div className="space-y-3">
                {item.progress.map((log) => (
                  <div
                    key={log.id_progress}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {log.completed_at ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <PlayCircle className="h-5 w-5 text-info" />
                      )}
                      <div>
                        <p className="font-medium">{log.step_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Started: {formatDate(log.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {log.completed_at ? (
                        <>
                          <p className="text-sm font-medium text-success">
                            {formatDuration(log.duration_seconds)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Completed: {formatDate(log.completed_at)}
                          </p>
                        </>
                      ) : (
                        <Badge variant="outline" className="bg-info/10 text-info">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No step history available</p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  // Fetch order details
  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["order", id],
    queryFn: () => onGetOrderByIdAction(id!),
    enabled: !!id,
  });

  // Fetch client details
  const { data: client } = useQuery({
    queryKey: ["client", order?.id_client],
    queryFn: () => onGetClientByIdAction(order?.id_client!),
    enabled: !!order?.id_client,
  });

  // Fetch order items with progress
  const { data: itemsWithProgress, isLoading: isLoadingItems } = useQuery({
    queryKey: ["orderItemsWithProgress", id],
    queryFn: () => onGetOrderItemsWithProgressAction(id!),
    enabled: !!id && activeTab === "items",
  });

  // Fetch assembly steps
  const { data: steps, isLoading: isLoadingSteps } = useQuery({
    queryKey: ["assemblySteps"],
    queryFn: onGetAllStepsAction,
    enabled: activeTab === "items",
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: (id_progress: string) => onCompleteStepAction({ id_progress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItemsWithProgress", id] });
      toast.success("Step completed successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to complete step", { description: error.message });
    },
  });

  // Start step for all items mutation
  const startStepForAllMutation = useMutation({
    mutationFn: ({ id_order, id_step }: { id_order: string; id_step: number }) =>
      onStartStepForAllItemsAction({ id_order, id_step }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItemsWithProgress", id] });
      toast.success("Step started for all items");
    },
    onError: (error: Error) => {
      toast.error("Failed to start step for all items", { description: error.message });
    },
  });

  // Complete step for all items mutation
  const completeStepForAllMutation = useMutation({
    mutationFn: ({ id_order, id_step }: { id_order: string; id_step: number }) =>
      onCompleteStepForAllItemsAction({ id_order, id_step }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItemsWithProgress", id] });
      toast.success("Step completed for all items");
    },
    onError: (error: Error) => {
      toast.error("Failed to complete step for all items", { description: error.message });
    },
  });

  const handleCompleteStep = (id_progress: string) => {
    completeStepMutation.mutate(id_progress);
  };

  const handleStartStepForAll = (id_step: number) => {
    if (id) {
      startStepForAllMutation.mutate({ id_order: id, id_step });
    }
  };

  const handleCompleteStepForAll = (id_step: number) => {
    if (id) {
      completeStepForAllMutation.mutate({ id_order: id, id_step });
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (isLoadingOrder) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="text-muted-foreground">Order Details</p>
          </div>
        </div>
        <Badge className={`${status.bg} ${status.text} ${status.border}`}>
          {status.label}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="items">Item Logs</TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden h-full">
                <div className="h-1 bg-gradient-to-r from-primary to-primary/60" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    Order Information
                  </CardTitle>
                  <CardDescription>Basic order details and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                      <p className="font-semibold text-lg">{order.order_number}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge className={`${status.bg} ${status.text} ${status.border} mt-1`}>
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="font-medium">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                      <p className="font-medium">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Client Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden h-full">
                <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-violet-500" />
                    Client Information
                  </CardTitle>
                  <CardDescription>Client contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {client ? (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                        <div className="p-2 rounded-full bg-violet-500/10">
                          <Building className="w-4 h-4 text-violet-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Company Name</p>
                          <p className="font-semibold">{client.client_name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium text-sm">{client.client_email || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium text-sm">{client.client_phone || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      {client.client_address && (
                        <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                          <p className="text-xs text-muted-foreground mb-1">Address</p>
                          <p className="font-medium text-sm">{client.client_address}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-24 text-muted-foreground">
                      <p>No client information available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Items Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" />
                  Items Summary
                </CardTitle>
                <CardDescription>Products included in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-3xl font-bold text-emerald-500">{order.items_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-3xl font-bold text-primary">{order.total_quantity || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Units</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-3xl font-bold text-info">{order.units_in_progress || 0}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-3xl font-bold text-success">{order.units_completed || 0}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes Card */}
          {order.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Item Logs Tab */}
        <TabsContent value="items" className="space-y-6">
          {isLoadingItems || isLoadingSteps ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : itemsWithProgress && steps ? (
            <>
              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{itemsWithProgress.length}</p>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">{itemsWithProgress.filter((i: OrderItemWithProgressEntity) => i.current_step_status === "completed").length}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-info">{itemsWithProgress.filter((i: OrderItemWithProgressEntity) => i.current_step_status === "in_progress").length}</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">{itemsWithProgress.filter((i: OrderItemWithProgressEntity) => i.current_step_status === "not_started").length}</p>
                      <p className="text-sm text-muted-foreground">Not Started</p>
                    </div>
                  </div>
                  <Progress value={itemsWithProgress.length > 0 ? Math.round((itemsWithProgress.filter((i: OrderItemWithProgressEntity) => i.current_step_status === "completed").length / itemsWithProgress.length) * 100) : 0} className="h-3" />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {itemsWithProgress.length > 0 ? Math.round((itemsWithProgress.filter((i: OrderItemWithProgressEntity) => i.current_step_status === "completed").length / itemsWithProgress.length) * 100) : 0}% Complete
                  </p>
                </CardContent>
              </Card>

              {/* Bulk Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start or complete a step for all items in this order at once.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {steps.map((step) => (
                      <div key={step.id_step} className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartStepForAll(step.id_step)}
                          disabled={startStepForAllMutation.isPending}
                        >
                          {startStepForAllMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <PlayCircle className="h-4 w-4 mr-1" />
                          )}
                          Start {step.step_name}
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleCompleteStepForAll(step.id_step)}
                          disabled={completeStepForAllMutation.isPending}
                        >
                          {completeStepForAllMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          Complete {step.step_name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Item Cards - Grouped by Product */}
              <div className="space-y-6">
                {(() => {
                  // Group items by product name
                  const groupedItems = itemsWithProgress.reduce((acc: Record<string, OrderItemWithProgressEntity[]>, item: OrderItemWithProgressEntity) => {
                    const productName = item.product_name;
                    if (!acc[productName]) {
                      acc[productName] = [];
                    }
                    acc[productName].push(item);
                    return acc;
                  }, {} as Record<string, OrderItemWithProgressEntity[]>);

                  return Object.entries(groupedItems).map(([productName, items]) => (
                    <div key={productName} className="space-y-3">
                      {/* Product Header */}
                      <div className="flex items-center gap-3 px-1">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{productName}</h3>
                          <p className="text-xs text-muted-foreground">{items.length} unit{items.length > 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex-1 h-px bg-border/50 ml-3" />
                      </div>
                      
                      {/* Items for this product */}
                      <div className="grid gap-3 pl-2 border-l-2 border-primary/10">
                        {items.map((item: OrderItemWithProgressEntity) => (
                          <ItemLogCard
                            key={item.id_order_item}
                            item={item}
                            steps={steps}
                            onCompleteStep={handleCompleteStep}
                            isCompleting={completeStepMutation.isPending}
                          />
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No items found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailPage;
