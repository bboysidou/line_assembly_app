// ChartCard.component.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const ChartCard = ({
  title,
  icon: Icon,
  children,
  className = "",
  action,
}: ChartCardProps) => {
  return (
    <Card
      className={`card-hover border-border/50 dark:border-zinc-800 bg-card/50 dark:bg-zinc-900/50 backdrop-blur-sm ${className}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" /> {title}
          {action}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
