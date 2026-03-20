import { SortDropdown } from "@/components/tables/SortDropdown";
import { TextSearchFilter } from "@/components/tables/TextSearchFilter";
import { StatusSearchFilter } from "@/components/tables/StatusSearchFilter";
import { type ColumnFilter } from "@/api/types";
import { CalendarSearchFilter } from "./CalendarSearchFilter";

interface ColumnActionsProps<T> {
  title: string;
  field: keyof T & string;
  filterType?: "text" | "status" | "date";
  currentFilter?: ColumnFilter;
  onSort: (field: string, direction: "asc" | "desc" | undefined) => void;
  onFilter: (
    field: string,
    value?: string | { from?: string; to?: string },
  ) => void;
  statusOptions?: any[];
}

export const ColumnActions = <T,>({
  title,
  field,
  filterType,
  currentFilter,
  onSort,
  onFilter,
  statusOptions,
}: ColumnActionsProps<T>) => {
  return (
    <div className="flex items-center justify-between w-full group">
      <span className="font-semibold">{title}</span>

      <div
        className="flex items-center gap-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <SortDropdown
          field={field}
          currentSort={currentFilter?.sort}
          onSort={onSort}
        />

        {filterType === "text" && (
          <TextSearchFilter
            value={currentFilter?.filter}
            onChange={(v) => onFilter(field, v)}
          />
        )}

        {filterType === "status" && (
          <StatusSearchFilter
            value={currentFilter?.filter}
            onChange={(v) => onFilter(field, v)}
            options={statusOptions}
          />
        )}

        {filterType === "date" && (
          <CalendarSearchFilter
            from={currentFilter?.from}
            to={currentFilter?.to}
            onChange={(range) => onFilter(field, range)}
          />
        )}
      </div>
    </div>
  );
};
