// Query Keys for TanStack Query
export const GET_USER_INFO = "GET_USER_INFO";

// Auth Query Keys
export const QUERY_KEYS = {
  // Auth
  AUTH: {
    USER_INFO: "user-info",
    SESSION: "session",
  },

  // Clients
  CLIENTS: {
    ALL: "clients",
    BY_ID: (id: string) => `client-${id}`,
  },

  // Orders
  ORDERS: {
    ALL: "orders",
    BY_ID: (id: string) => `order-${id}`,
  },

  // Assembly
  ASSEMBLY: {
    STEPS: "assembly-steps",
    PROGRESS: (idOrder: string) => `order-progress-${idOrder}`,
    ANALYTICS: (idStep: number, startDate?: string, endDate?: string) => 
      `step-analytics-${idStep}-${startDate || "none"}-${endDate || "none"}`,
  },

  // Dashboard
  DASHBOARD: {
    METRICS: "dashboard-metrics",
    ORDERS_TREND: (period: string) => `orders-trend-${period}`,
    STEP_PERFORMANCE: "step-performance",
    STEP_ANALYTICS: (idStep: number, period: string) => `step-analytics-${idStep}-${period}`,
  },
} as const;
