// StepPerformanceCard.component.tsx
import { motion } from "framer-motion";
import type { StepPerformanceSchemaType } from "../schemas/dashboard.schema";

interface StepPerformanceCardProps {
  step: StepPerformanceSchemaType;
  index: number;
}

const gradients = [
  "from-primary to-primary/60",
  "from-info to-info/60",
  "from-warning to-warning/60",
  "from-success to-success/60",
  "from-pink-500 to-pink-400",
  "from-indigo-500 to-indigo-400",
];

const StepPerformanceCard = ({ step, index }: StepPerformanceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/30 hover:border-border/60 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold bg-gradient-to-br ${gradients[index % gradients.length]} shadow-lg`}
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
};

export default StepPerformanceCard;
