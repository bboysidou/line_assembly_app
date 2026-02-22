// get_order_items_with_progress.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { OrderItemWithProgressType } from "@/routes/order_items/domain/entities/order_item_with_progress.entity";

const GET_ORDER_ITEMS_WITH_PROGRESS = `
SELECT 
  oi.id_order_item,
  oi.id_order,
  oi.product_name,
  oi.quantity,
  oi.notes,
  oi.created_at,
  oi.updated_at,
  COALESCE(SUM(stl.duration_seconds), 0)::int AS total_time_seconds
FROM order_items oi
LEFT JOIN step_time_logs stl ON stl.id_order_item = oi.id_order_item
WHERE oi.id_order = $1
GROUP BY oi.id_order_item
ORDER BY oi.created_at ASC
`;

const GET_UNIT_PROGRESS = `
SELECT 
  ip.id_progress,
  ip.id_step,
  ip.unit_number,
  s.step_name,
  s.step_order,
  ip.started_at,
  ip.completed_at,
  CASE 
    WHEN stl.duration_seconds IS NOT NULL THEN stl.duration_seconds
    WHEN ip.started_at IS NOT NULL AND ip.completed_at IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (ip.completed_at - ip.started_at))::INT
    ELSE NULL
  END AS duration_seconds
FROM item_progress ip
JOIN assembly_steps s ON ip.id_step = s.id_step
LEFT JOIN step_time_logs stl ON stl.id_order_item = ip.id_order_item AND stl.id_step = ip.id_step AND stl.unit_number = ip.unit_number
WHERE ip.id_order_item = $1
ORDER BY ip.unit_number ASC, s.step_order ASC
`;

const GET_ALL_STEPS = `
SELECT id_step, step_name, step_order
FROM assembly_steps
WHERE is_active = true
ORDER BY step_order ASC
`;

export const GetOrderItemsWithProgressRemoteDataSource = async (
  id_order: string,
): Promise<OrderItemWithProgressType[]> => {
  try {
    // Get all items with their total time
    const itemsResult = await db_client.query(GET_ORDER_ITEMS_WITH_PROGRESS, [id_order]);
    
    // Get all steps for reference
    const stepsResult = await db_client.query(GET_ALL_STEPS);
    const steps = stepsResult.rows;
    
    // For each item, expand to individual units and get their progress
    const unitsWithProgress: OrderItemWithProgressType[] = [];
    
    for (const item of itemsResult.rows) {
      // Get progress for all units of this item
      const progressResult = await db_client.query(GET_UNIT_PROGRESS, [item.id_order_item]);
      const allProgress = progressResult.rows;
      
      // Get unique unit numbers that have progress
      const unitsWithProgressData = new Set(allProgress.map(p => p.unit_number));
      
      // Create a unit entry for each unit (1 to quantity)
      for (let unitNumber = 1; unitNumber <= item.quantity; unitNumber++) {
        // Filter progress for this specific unit
        const unitProgress = allProgress.filter(p => p.unit_number === unitNumber);
        
        // Determine current step for this unit
        let currentStepId: number | null = null;
        let currentStepName: string | null = null;
        let currentStepStatus: "not_started" | "in_progress" | "completed" = "not_started";
        
        // Find the first step that is not completed
        const completedStepIds = unitProgress
          .filter(p => p.completed_at !== null)
          .map(p => p.id_step);
        
        const inProgressStep = unitProgress.find(p => p.started_at !== null && p.completed_at === null);
        
        if (inProgressStep) {
          currentStepId = inProgressStep.id_step;
          currentStepName = inProgressStep.step_name;
          currentStepStatus = "in_progress";
        } else {
          // Find the first step that hasn't been started
          const nextStep = steps.find((s: { id_step: number }) => !completedStepIds.includes(s.id_step));
          if (nextStep) {
            currentStepId = nextStep.id_step;
            currentStepName = nextStep.step_name;
            currentStepStatus = "not_started";
          } else if (steps.length > 0 && completedStepIds.length === steps.length) {
            // All steps completed
            const lastStep = steps[steps.length - 1];
            currentStepId = lastStep.id_step;
            currentStepName = lastStep.step_name;
            currentStepStatus = "completed";
          }
        }
        
        // Calculate total time for this unit
        const unitTotalTime = unitProgress.reduce((sum: number, p: { duration_seconds: number | null }) => 
          sum + (p.duration_seconds || 0), 0);
        
        unitsWithProgress.push({
          id_order_item: item.id_order_item,
          id_order: item.id_order,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_number: unitNumber,
          notes: item.notes,
          current_step_id: currentStepId,
          current_step_name: currentStepName,
          current_step_status: currentStepStatus,
          progress: unitProgress.map((p: { 
            id_progress: string; 
            id_step: number; 
            unit_number: number;
            step_name: string; 
            step_order: number; 
            started_at: Date | null; 
            completed_at: Date | null; 
            duration_seconds: number | null;
          }) => ({
            id_progress: p.id_progress,
            id_step: p.id_step,
            unit_number: p.unit_number,
            step_name: p.step_name,
            step_order: p.step_order,
            started_at: p.started_at,
            completed_at: p.completed_at,
            duration_seconds: p.duration_seconds,
          })),
          total_time_seconds: unitTotalTime,
          created_at: item.created_at,
          updated_at: item.updated_at,
        });
      }
    }
    
    return unitsWithProgress;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
