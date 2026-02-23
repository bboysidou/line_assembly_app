// StatusBadge.component.tsx

interface StatusBadgeProps {
  status: "pending" | "in_progress" | "completed" | "cancelled";
  className?: string;
}

const statusConfig = {
  pending: {
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/30",
    label: "Pending",
    dot: "bg-warning",
  },
  in_progress: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/30",
    label: "In Progress",
    dot: "bg-info",
  },
  completed: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/30",
    label: "Completed",
    dot: "bg-success",
  },
  cancelled: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
    label: "Cancelled",
    dot: "bg-destructive",
  },
};

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
