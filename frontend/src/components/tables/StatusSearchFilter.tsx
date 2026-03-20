import { Filter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type BackendStage = {
  id: string;
  name: string;
  order?: number;
};

type Props = {
  value?: string;
  onChange: (value?: string) => void;
  options?: BackendStage[];
};

export const StatusSearchFilter = ({ value, onChange, options }: Props) => {
  const formattedStatuses = options
    ? [
        { label: "Все", val: undefined },
        ...options.map((stage) => ({
          label: stage.name,
          val: stage.name,
        })),
      ]
    : [
        { label: "Все", val: undefined },
        { label: "Open", val: "Open" },
        { label: "Draft", val: "Draft" },
        { label: "Paused", val: "Paused" },
        { label: "Closed", val: "Closed" },
      ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted",
              value && "text-primary",
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[180px] max-h-[300px] overflow-y-auto"
        >
          {formattedStatuses.map((s) => (
            <DropdownMenuItem
              key={s.val ?? "all"}
              className="flex justify-between cursor-pointer"
              onClick={() => onChange(s.val)}
            >
              <span className="truncate mr-2">{s.label}</span>

              {value === s.val && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
