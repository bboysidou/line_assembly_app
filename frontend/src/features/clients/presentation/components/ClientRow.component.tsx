// ClientRow.component.tsx
import { TableCell, TableRow } from "@/components/ui/table";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { ClientSchemaType } from "../schemas/clients.schema";

interface ClientRowProps {
  client: ClientSchemaType;
  index: number;
  getGradient: (name: string) => string;
  getInitials: (name: string) => string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientRow = ({
  client,
  index,
  getGradient,
  getInitials,
  onEdit,
  onDelete,
}: ClientRowProps) => {
  return (
    <motion.tr
      key={client.id_client}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="group hover:bg-muted/30 transition-colors border-b border-border/30"
    >
      <TableCell className="text-center text-muted-foreground font-medium">
        {index + 1}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold bg-gradient-to-br ${getGradient(client.client_name)} shadow-lg`}
          >
            {getInitials(client.client_name)}
          </div>
          <span className="font-medium">{client.client_name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{client.client_email}</span>
        </div>
      </TableCell>
      <TableCell>
        {client.client_phone ? (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{client.client_phone}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        {client.client_address ? (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate max-w-[200px]">
              {client.client_address}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            {client.created_at ? new Date(client.created_at).toLocaleDateString() : "-"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onEdit(client.id_client)}
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
            onClick={() => onDelete(client.id_client)}
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

export default ClientRow;
