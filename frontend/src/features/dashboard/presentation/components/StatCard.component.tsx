// StatCard.component.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: "primary" | "info" | "warning" | "success" | "destructive";
  className?: string;
}

const variantStyles = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    gradient: "from-primary/5",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    gradient: "from-info/5",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    gradient: "from-warning/5",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    gradient: "from-success/5",
  },
  destructive: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    gradient: "from-destructive/5",
  },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "from last month",
  variant = "primary",
  className = "",
}: StatCardProps) => {
  const styles = variantStyles[variant];
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card
      className={`card-hover border-border/50 dark:border-zinc-800 bg-card/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden group ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <CardContent className="pt-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className={`text-3xl font-bold ${styles.text} mt-1`}>{value}</p>
          </div>
          <div
            className={`p-3 ${styles.bg} rounded-xl group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-6 h-6 ${styles.text}`} />
          </div>
        </div>
        {trend !== undefined && (
          <div
            className={`mt-3 flex items-center text-sm ${isPositive ? "text-success" : "text-destructive"}`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            <span className="font-medium">{Math.abs(trend)}%</span>
            <span className="text-muted-foreground ml-1">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
