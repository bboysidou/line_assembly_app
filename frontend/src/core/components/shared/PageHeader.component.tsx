// PageHeader.component.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  className = "",
}: PageHeaderProps) => {
  return (
    <motion.div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          <ActionIcon className="w-4 h-4 mr-2" /> {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default PageHeader;
