import { Filter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const StatusVacancyFilter = (params: any) => {
  const { value, onValueChange } = params;

  const statuses = [
    { label: "Все", val: undefined },
    { label: "Open", val: "Open" },
    { label: "Draft", val: "Draft" },
    { label: "Paused", val: "Paused" },
    { label: "Closed", val: "Closed" },
  ];

  return (
    <div 
      className="flex items-center justify-between w-full h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-sm font-semibold truncate">Статус</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted outline-none",
            value && "text-primary"
          )}>
            <Filter className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-[150px]">
          
          {statuses.map((s) => (
            <DropdownMenuItem
              key={s.val}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onValueChange(s.val)}
            >
              {s.label}
              {value === s.val && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};