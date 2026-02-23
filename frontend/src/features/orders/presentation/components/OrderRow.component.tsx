// OrderRow.component.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Hash, Package, User } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "@/core/components/shared/StatusBadge.component";
import type { OrderSchemaType } from "../schemas/order.schema";

interface OrderRowProps {
  order: OrderSchemaType;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const OrderRow = ({ order, index, onEdit, onDelete }: OrderRowProps) => {
  return (
    <motion.tr
      key={order.id_order}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="group hover:bg-muted/30 transition-colors border-b border-border/30"
    >
      <TableCell className="text-center text-muted-foreground font-medium">
        {index + 1}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
            <Hash className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-medium">{order.order_number}</span>
        </div>
      </TableCell>
      <TableCell>
        {order.client_name ? (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{order.client_name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4 opacity-50" />
          {order.items_count ?? 0} items
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Hash className="w-4 h-4 opacity-50" />
          {order.total_quantity ?? 0} units
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={order.status as "pending" | "in_progress" | "completed" | "cancelled"} />
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString()
            : "-"}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEdit(order.id_order)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground hover:text-primary"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(order.id_order)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground hover:text-destructive"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </TableCell>
    </motion.tr>
  );
};

export default OrderRow;
