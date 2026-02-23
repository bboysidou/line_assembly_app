// SortableTableHeader.component.tsx
import { TableHead } from "@/components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SortableTableHeaderProps<T extends string> {
  field: T;
  currentSortField: T;
  sortOrder: "asc" | "desc";
  onSort: (field: T) => void;
  children: React.ReactNode;
  className?: string;
}

const SortableTableHeader = <T extends string>({
  field,
  currentSortField,
  sortOrder,
  onSort,
  children,
  className = "",
}: SortableTableHeaderProps<T>) => {
  const isActive = currentSortField === field;

  return (
    <TableHead
      className={`cursor-pointer select-none font-semibold hover:text-primary transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        {isActive && (
          sortOrder === "asc" ? (
            <ArrowUp className="w-4 h-4 ml-1" />
          ) : (
            <ArrowDown className="w-4 h-4 ml-1" />
          )
        )}
      </div>
    </TableHead>
  );
};

export default SortableTableHeader;
