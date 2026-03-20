import * as React from "react";
import { Filter, X, Check } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { startOfDay, endOfDay, format } from "date-fns";

type Props = {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string } | undefined) => void;
};

export const CalendarSearchFilter = ({ from, to, onChange }: Props) => {
  const [open, setOpen] = React.useState(false);

  const [localRange, setLocalRange] = React.useState<DateRange | undefined>({
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  React.useEffect(() => {
    if (open) {
      setLocalRange({
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      });
    }
  }, [open, from, to]);

  const handleApply = () => {
    if (!localRange?.from) {
      onChange(undefined);
      setOpen(false);
      return;
    }

    const fromDate = startOfDay(localRange.from);
    const toDate = endOfDay(localRange.to || localRange.from);

    onChange({
      from: format(fromDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      to: format(toDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    });

    setOpen(false);
  };

  const handleClear = () => {
    setLocalRange(undefined);
    onChange(undefined);
    setOpen(false);
  };

  const isActive = !!from || !!to;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors focus:outline-none",
              isActive && "text-primary bg-primary/10",
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="p-0 border border-border shadow-lg"
        >
          <div className="flex items-center justify-between p-2 border-b bg-background">
            <span className="text-[12px] font-semibold px-1">Период</span>
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="mr-1 h-3 w-3" /> Очистить
              </Button>
            )}
          </div>

          <div className="bg-background p-1">
            <Calendar
              mode="range"
              selected={localRange}
              onSelect={setLocalRange}
              numberOfMonths={1}
              className="p-2"
              captionLayout="dropdown"
            />
          </div>

          <div className="p-2 border-t bg-muted/20 flex gap-2">
            <Button
              size="sm"
              className="w-full h-8 text-xs gap-1.5"
              onClick={handleApply}
            >
              <Check className="h-3.5 w-3.5" />
              Применить
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
