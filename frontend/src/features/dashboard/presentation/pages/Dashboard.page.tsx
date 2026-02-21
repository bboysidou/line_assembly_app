import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <motion.div variants={cardVariants}>
          <Tabs defaultValue="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="orders">Orders Overview</TabsTrigger>
                <TabsTrigger value="assembly">Assembly Metrics</TabsTrigger>
              </TabsList>
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

            <TabsContent value="orders" className="space-y-4">
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
                            fill: "#f59e0b",
                          },
                          {
                            name: "In Progress",
                            value: inProgressOrders,
                            fill: "#3b82f6",
                          },
                          {
                            name: "Completed",
                            value: completedOrders,
                            fill: "#22c55e",
                          },
                          {
                            name: "Cancelled",
                            value: cancelledOrders,
                            fill: "#ef4444",
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
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
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="orders"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assembly" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
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
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

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
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="step" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="avgTime"
                        name="Avg Time (min)"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="minTime"
                        name="Min Time"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="maxTime"
                        name="Max Time"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </>
    </motion.div>
  );
};

export default DashboardPage;
