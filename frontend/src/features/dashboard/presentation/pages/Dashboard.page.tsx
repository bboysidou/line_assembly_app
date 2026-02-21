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
  
  // Chart colors that adapt to dark mode
  const chartColors = {
    grid: isDark ? "#374151" : "#e2e8f0",
    axis: isDark ? "#9ca3af" : "#64748b",
    tooltip: {
      bg: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
      border: isDark ? "#4b5563" : "#e2e8f0",
      shadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      text: isDark ? "#f9fafb" : "#1f2937",
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
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={cardVariants}>
        <h1 className="text-3xl font-bold bg-linear-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your production line
        </p>
      </motion.div>

      <>
        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={cardVariants}
        >
          <Card className="bg-linear-to-br from-violet-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-3xl font-bold text-violet-600">
                    {totalClients}
                  </p>
                </div>
                <div className="p-3 bg-violet-100 rounded-full">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />{" "}
                {metrics?.clientsGrowth || 0}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-blue-50 to-cyan-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />{" "}
                {metrics?.ordersGrowth || 0}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-orange-50 to-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {inProgressOrders}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />{" "}
                {Math.abs(metrics?.inProgressChange || 0)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedOrders}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />{" "}
                {metrics?.completedGrowth || 0}% from last month
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
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Orders Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" /> Orders Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Pending",
                            value: pendingOrders,
                          },
                          {
                            name: "In Progress",
                            value: inProgressOrders,
                          },
                          {
                            name: "Completed",
                            value: completedOrders,
                          },
                          {
                            name: "Cancelled",
                            value: cancelledOrders,
                          },
                        ]}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3}/>
                          </linearGradient>
                          <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                        <XAxis type="number" stroke={chartColors.axis} fontSize={12} />
                        <YAxis dataKey="name" type="category" stroke={chartColors.axis} fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: chartColors.tooltip.bg, 
                            borderRadius: '8px',
                            border: `1px solid ${chartColors.tooltip.border}`,
                            boxShadow: chartColors.tooltip.shadow,
                            color: chartColors.tooltip.text
                          }}
                          formatter={(value: number) => [`${value} Orders`, 'Count']}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" /> Orders Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={
                          trendData.length > 0
                            ? trendData
                            : [
                                { date: "Mon", orders: 10, completed: 5 },
                                { date: "Tue", orders: 15, completed: 8 },
                                { date: "Wed", orders: 12, completed: 10 },
                                { date: "Thu", orders: 18, completed: 12 },
                                { date: "Fri", orders: 14, completed: 9 },
                                { date: "Sat", orders: 8, completed: 6 },
                                { date: "Sun", orders: 5, completed: 3 },
                              ]
                        }
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorCompletedArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
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
                            borderRadius: '8px',
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
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorOrders)"
                          name="Total Orders"
                          animationDuration={1500}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#22c55e"
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Average Time per Step
                    (minutes)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={String(selectedStep)}
                    onValueChange={(v) => setSelectedStep(parseInt(v))}
                  >
                    <SelectTrigger>
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
                  <div className="mt-4 space-y-3">
                    {performanceData.map((step, i) => (
                      <div
                        key={step.step}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              i === 0
                                ? "bg-linear-to-br from-violet-500 to-purple-500"
                                : i === 1
                                  ? "bg-linear-to-br from-blue-500 to-cyan-500"
                                  : i === 2
                                    ? "bg-linear-to-br from-orange-500 to-amber-500"
                                    : i === 3
                                      ? "bg-linear-to-br from-green-500 to-emerald-500"
                                      : i === 4
                                        ? "bg-linear-to-br from-pink-500 to-rose-500"
                                        : "bg-linear-to-br from-indigo-500 to-blue-500"
                            }`}
                          >
                            {step.stepOrder}
                          </div>
                          <span className="font-medium">{step.step}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{step.avgTime} min</p>
                          <p className="text-xs text-muted-foreground">
                            {step.minTime}-{step.maxTime} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Step Progress Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" /> Step Progression -{" "}
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
                        data={
                          stepAnalytics && stepAnalytics.length > 0
                            ? stepAnalytics
                            : [
                                { date: "Day 1", orders: 5, completed: 3 },
                                { date: "Day 2", orders: 8, completed: 5 },
                                { date: "Day 3", orders: 6, completed: 4 },
                                { date: "Day 4", orders: 10, completed: 7 },
                                { date: "Day 5", orders: 7, completed: 5 },
                                { date: "Day 6", orders: 4, completed: 3 },
                                { date: "Day 7", orders: 3, completed: 2 },
                              ]
                        }
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradientOrdersLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                          <linearGradient id="gradientCompletedLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#10b981" />
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
                            borderRadius: '8px',
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
                          strokeWidth={4}
                          dot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                          activeDot={{ r: 8, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3 }}
                          name="Entered"
                          animationDuration={1500}
                        />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="url(#gradientCompletedLine)"
                          strokeWidth={4}
                          dot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                          activeDot={{ r: 8, fill: '#22c55e', stroke: '#fff', strokeWidth: 3 }}
                          name="Completed"
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

              {/* Step Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Step Performance
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
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="colorMinTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="colorMaxTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
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
                          borderRadius: '8px',
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
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar
                        dataKey="minTime"
                        name="Min Time"
                        fill="url(#colorMinTime)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar
                        dataKey="maxTime"
                        name="Max Time"
                        fill="url(#colorMaxTime)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      </motion.div>
  );
};

export default DashboardPage;
