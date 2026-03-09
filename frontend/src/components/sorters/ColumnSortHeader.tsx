import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps<T extends string> {
  field: T;
  currentSortBy?: T;
  currentDirection?: "asc" | "desc" | string;
  onSort: (field: T, direction: "asc" | "desc" | undefined) => void;
}

export function SortDropdown<T extends string>({
  field,
  currentSortBy,
  currentDirection,
  onSort,
}: SortDropdownProps<T>) {
  const isActive = currentSortBy === field;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isActive && currentDirection === "asc" ? (
            <ArrowUp className="h-4 w-4 text-primary" />
          ) : isActive && currentDirection === "desc" ? (
            <ArrowDown className="h-4 w-4 text-primary" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-30" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort(field, "asc")}>
          По возрастанию
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort(field, "desc")}>
          По убыванию
        </DropdownMenuItem>
        {isActive && (
          <DropdownMenuItem onClick={() => onSort(field, undefined)}>
            Сбросить
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}