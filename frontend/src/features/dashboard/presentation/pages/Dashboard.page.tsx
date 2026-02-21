import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme/use-theme";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import {
  onGetDashboardMetricsAction,
  onGetOrdersTrendAction,
  onGetStepPerformanceAction,
  onGetStepAnalyticsAction,
} from "../actions/dashboard.action";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  Legend,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stepNames = [
  "Cutting",
  "Welding",
  "Painting",
  "Assembly",
  "Quality Check",
  "Packaging",
];

const DashboardPage = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";
  
  // Chart colors that adapt to dark mode using CSS variables
  const chartColors = {
    grid: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(148, 163, 184, 0.2)",
    axis: isDark ? "#94a3b8" : "#64748b",
    tooltip: {
      bg: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.98)",
      border: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.2)",
      shadow: isDark ? "0 8px 32px -8px rgba(0, 0, 0, 0.5)" : "0 8px 32px -8px rgba(0, 0, 0, 0.15)",
      text: isDark ? "#f1f5f9" : "#1e293b",
    },
    // Primary palette based on design system
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
    },
    destructive: {
      main: "#ef4444",
      light: "#f87171",
    },
  };

  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const fetchDashboardData = async () => {
    const now = new Date();
    let startDate: string;
    if (timeRange === "day") {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    } else if (timeRange === "week") {
      startDate = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
    } else {
      startDate = new Date(
        now.getTime() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
    }

    const [metrics, ordersTrend, stepPerformance, stepAnalytics] =
      await Promise.all([
        onGetDashboardMetricsAction(),
        onGetOrdersTrendAction(timeRange),
        onGetStepPerformanceAction(),
        onGetStepAnalyticsAction(selectedStep, startDate, now.toISOString()),
      ]);

    return { metrics, ordersTrend, stepPerformance, stepAnalytics };
  };

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", timeRange, selectedStep],
    queryFn: fetchDashboardData,
  });

  const metrics = data?.metrics;
  const ordersTrend = data?.ordersTrend;
  const stepPerformance = data?.stepPerformance;
  const stepAnalytics = data?.stepAnalytics;

  const pendingOrders = metrics?.pendingOrders ?? 5;
  const inProgressOrders = metrics?.inProgressOrders ?? 12;
  const completedOrders = metrics?.completedOrders ?? 28;
  const cancelledOrders = metrics?.cancelledOrders ?? 3;

  const trendData =
    ordersTrend && ordersTrend.length > 0
      ? ordersTrend
      : [
          { date: "2026-02-15", orders: 8, completed: 5 },
          { date: "2026-02-16", orders: 12, completed: 8 },
          { date: "2026-02-17", orders: 6, completed: 10 },
          { date: "2026-02-18", orders: 15, completed: 12 },
          { date: "2026-02-19", orders: 10, completed: 8 },
          { date: "2026-02-20", orders: 18, completed: 14 },
          { date: "2026-02-21", orders: 14, completed: 11 },
        ];
  const performanceData =
    stepPerformance && stepPerformance.length > 0 ? stepPerformance : [];

  const totalClients = metrics?.totalClients ?? 8;
  const totalOrders = metrics?.totalOrders ?? 48;

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
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold text-gradient">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of your production line
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={cardVariants}
      >
        {/* Total Clients Card */}
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Clients</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {totalClients}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-success">
              <ArrowUpRight className="w-4 h-4 mr-1" />{" "}
              <span className="font-medium">{metrics?.clientsGrowth || 0}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders Card */}
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-info mt-1">
                  {totalOrders}
                </p>
              </div>
              <div className="p-3 bg-info/10 rounded-xl group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-success">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="font-medium">{metrics?.ordersGrowth || 0}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* In Progress Card */}
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                <p className="text-3xl font-bold text-warning mt-1">
                  {inProgressOrders}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-destructive">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span className="font-medium">{Math.abs(metrics?.inProgressChange || 0)}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Completed Card */}
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-3xl font-bold text-success mt-1">
                  {completedOrders}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-success">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="font-medium">{metrics?.completedGrowth || 0}%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={cardVariants} className="space-y-6">
        {/* Time Range Filter */}
        <div className="flex justify-end">
          <Select
            value={timeRange}
            onValueChange={(v) =>
              setTimeRange(v as "day" | "week" | "month")
            }
          >
            <SelectTrigger className="w-45 bg-card/50 border-border/50">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Bar Chart */}
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-primary" /> Orders Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Pending", value: pendingOrders },
                    { name: "In Progress", value: inProgressOrders },
                    { name: "Completed", value: completedOrders },
                    { name: "Cancelled", value: cancelledOrders },
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.warning.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.warning.light} stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.info.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.info.light} stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.success.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.success.light} stopOpacity={0.4}/>
                    </linearGradient>
                    <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.destructive.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.destructive.light} stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis type="number" stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke={chartColors.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltip.bg, 
                      borderRadius: '12px',
                      border: `1px solid ${chartColors.tooltip.border}`,
                      boxShadow: chartColors.tooltip.shadow,
                      color: chartColors.tooltip.text
                    }}
                    formatter={(value: number) => [`${value} Orders`, 'Count']}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
                    {[
                      { name: "Pending", fill: "url(#colorPending)" },
                      { name: "In Progress", fill: "url(#colorInProgress)" },
                      { name: "Completed", fill: "url(#colorCompleted)" },
                      { name: "Cancelled", fill: "url(#colorCancelled)" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders Trend */}
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" /> Orders Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={trendData.length > 0 ? trendData : [
                    { date: "Mon", orders: 10, completed: 5 },
                    { date: "Tue", orders: 15, completed: 8 },
                    { date: "Wed", orders: 12, completed: 10 },
                    { date: "Thu", orders: 18, completed: 12 },
                    { date: "Fri", orders: 14, completed: 9 },
                    { date: "Sat", orders: 8, completed: 6 },
                    { date: "Sun", orders: 5, completed: 3 },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.info.main} stopOpacity={0.5}/>
                      <stop offset="95%" stopColor={chartColors.info.main} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompletedArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.success.main} stopOpacity={0.5}/>
                      <stop offset="95%" stopColor={chartColors.success.main} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltip.bg, 
                      borderRadius: '12px',
                      border: `1px solid ${chartColors.tooltip.border}`,
                      boxShadow: chartColors.tooltip.shadow,
                      color: chartColors.tooltip.text
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke={chartColors.info.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name="Total Orders"
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={chartColors.success.main}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCompletedArea)"
                    name="Completed"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Step Selection */}
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" /> Average Time per Step
              (minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={String(selectedStep)}
              onValueChange={(v) => setSelectedStep(parseInt(v))}
            >
              <SelectTrigger className="w-full max-w-xs bg-card/50 border-border/50">
                <SelectValue placeholder="Select step" />
              </SelectTrigger>
              <SelectContent>
                {stepNames.map((name, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceData.map((step, i) => {
                const gradients = [
                  "from-primary to-primary/60",
                  "from-info to-info/60",
                  "from-warning to-warning/60",
                  "from-success to-success/60",
                  "from-pink-500 to-pink-400",
                  "from-indigo-500 to-indigo-400",
                ];
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-border/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold bg-gradient-to-br ${gradients[i % gradients.length]} shadow-lg`}
                      >
                        {step.stepOrder}
                      </div>
                      <span className="font-medium">{step.step}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{step.avgTime} min</p>
                      <p className="text-xs text-muted-foreground">
                        {step.minTime}-{step.maxTime} min
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step Progress Chart */}
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-primary" /> Step Progression -{" "}
                {timeRange === "day"
                  ? "24 Hours"
                  : timeRange === "week"
                    ? "7 Days"
                    : "30 Days"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={stepAnalytics && stepAnalytics.length > 0 ? stepAnalytics : [
                    { date: "Day 1", orders: 5, completed: 3 },
                    { date: "Day 2", orders: 8, completed: 5 },
                    { date: "Day 3", orders: 6, completed: 4 },
                    { date: "Day 4", orders: 10, completed: 7 },
                    { date: "Day 5", orders: 7, completed: 5 },
                    { date: "Day 6", orders: 4, completed: 3 },
                    { date: "Day 7", orders: 3, completed: 2 },
                  ]}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradientOrdersLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={chartColors.warning.main} />
                      <stop offset="100%" stopColor={chartColors.warning.light} />
                    </linearGradient>
                    <linearGradient id="gradientCompletedLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={chartColors.success.main} />
                      <stop offset="100%" stopColor={chartColors.success.light} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltip.bg, 
                      borderRadius: '12px',
                      border: `1px solid ${chartColors.tooltip.border}`,
                      boxShadow: chartColors.tooltip.shadow,
                      color: chartColors.tooltip.text
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="url(#gradientOrdersLine)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: chartColors.warning.main, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: chartColors.warning.main, stroke: '#fff', strokeWidth: 3 }}
                    name="Entered"
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="url(#gradientCompletedLine)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: chartColors.success.main, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: chartColors.success.main, stroke: '#fff', strokeWidth: 3 }}
                    name="Completed"
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Step Performance */}
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" /> Step Performance
                Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorAvgTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.warning.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.warning.light} stopOpacity={0.5}/>
                    </linearGradient>
                    <linearGradient id="colorMinTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.success.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.success.light} stopOpacity={0.5}/>
                    </linearGradient>
                    <linearGradient id="colorMaxTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors.info.main} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={chartColors.info.light} stopOpacity={0.5}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                  <XAxis 
                    dataKey="step" 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke={chartColors.axis} 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: chartColors.axis, fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: chartColors.tooltip.bg, 
                      borderRadius: '12px',
                      border: `1px solid ${chartColors.tooltip.border}`,
                      boxShadow: chartColors.tooltip.shadow,
                      color: chartColors.tooltip.text
                    }}
                    formatter={(value: number, name: string) => [`${value} min`, name]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="avgTime"
                    name="Avg Time"
                    fill="url(#colorAvgTime)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="minTime"
                    name="Min Time"
                    fill="url(#colorMinTime)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="maxTime"
                    name="Max Time"
                    fill="url(#colorMaxTime)"
                    radius={[6, 6, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
