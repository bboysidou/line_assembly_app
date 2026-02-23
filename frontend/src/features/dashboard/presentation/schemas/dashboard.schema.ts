// dashboard.schema.ts
import { z } from "zod";

// Dashboard Metrics Schema
export const dashboardMetricsSchema = z.object({
  totalClients: z.number(),
  totalOrders: z.number(),
  pendingOrders: z.number(),
  inProgressOrders: z.number(),
  completedOrders: z.number(),
  cancelledOrders: z.number(),
  clientsGrowth: z.number(),
  ordersGrowth: z.number(),
  inProgressChange: z.number(),
  completedGrowth: z.number(),
});

// Order Trend Schema
export const orderTrendSchema = z.object({
  date: z.string(),
  orders: z.number(),
  completed: z.number(),
});

// Step Performance Schema
export const stepPerformanceSchema = z.object({
  step: z.string(),
  stepOrder: z.number(),
  avgTime: z.number(),
  minTime: z.number(),
  maxTime: z.number(),
});

// Step Analytics Schema
export const stepAnalyticsSchema = z.object({
  date: z.string(),
  orders: z.number(),
  completed: z.number(),
});

// Type exports for TypeScript
export type DashboardMetricsSchemaType = z.infer<typeof dashboardMetricsSchema>;
export type OrderTrendSchemaType = z.infer<typeof orderTrendSchema>;
export type StepPerformanceSchemaType = z.infer<typeof stepPerformanceSchema>;
export type StepAnalyticsSchemaType = z.infer<typeof stepAnalyticsSchema>;
