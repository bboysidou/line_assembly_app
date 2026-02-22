// order_item_with_progress.entity.ts

// Order item with progress information - matches backend OrderItemWithProgressType
// Now represents a single unit within an order item
export type OrderItemWithProgressEntity = {
  id_order_item: string;
  id_order: string;
  product_name: string;
  quantity: number;
  unit_number: number;
  notes: string | null;
  current_step_id: number | null;
  current_step_name: string | null;
  current_step_status: "not_started" | "in_progress" | "completed";
  progress: {
    id_progress: string;
    id_step: number;
    unit_number: number;
    step_name: string;
    step_order: number;
    started_at: Date | null;
    completed_at: Date | null;
    duration_seconds: number | null;
  }[];
  total_time_seconds: number;
  created_at: Date;
  updated_at: Date;
};

// Helper functions for OrderItemWithProgressEntity
export const getProgressPercentage = (item: OrderItemWithProgressEntity, totalSteps: number): number => {
  if (item.current_step_status === "completed") return 100;
  if (!item.progress || item.progress.length === 0) return 0;
  const completedSteps = item.progress.filter(p => p.completed_at !== null).length;
  return Math.round((completedSteps / totalSteps) * 100);
};

export const getStatusText = (item: OrderItemWithProgressEntity): string => {
  if (item.current_step_status === "completed") return "Completed";
  if (item.current_step_status === "in_progress") return `In ${item.current_step_name || "Progress"}`;
  return "Not Started";
};

export const getCurrentStepOrder = (item: OrderItemWithProgressEntity): number => {
  if (!item.progress || item.progress.length === 0) return 0;
  const currentProgress = item.progress.find(p => p.started_at !== null && p.completed_at === null);
  return currentProgress?.step_order || 0;
};

// Helper to get unique display name for a unit
export const getUnitDisplayName = (item: OrderItemWithProgressEntity): string => {
  return `${item.product_name} #${item.unit_number}`;
};
