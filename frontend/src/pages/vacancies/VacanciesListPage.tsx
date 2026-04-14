import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVacanciesQuery } from "@/api/vacancies/model/queries";
import { type VacancyItemDto } from "@/api/vacancies/model/types";
import type { ColumnFilter } from "@/api/types";
import { Input } from "@/components/ui/input";
import { ColumnActions } from "@/components/tables/ColumnActions";
import { useVacancyStore } from "@/store/useVacanciesStore";
import { VacancyActions } from "@/components/tables/VacancyActions";

export default function VacanciesListPage() {
  const navigate = useNavigate();
  const { filters, setFilters } = useVacancyStore();

  const [pageSizeDraft, setPageSizeDraft] = useState(
    filters.pageSize.toString(),
  );

  const { data, isLoading, isError } = useVacanciesQuery(filters);

  useEffect(() => {
    setPageSizeDraft(filters.pageSize.toString());
  }, [filters.pageSize]);

  const handlePageSizeCommit = () => {
    const newSize = parseInt(pageSizeDraft);
    if (
      !isNaN(newSize) &&
      newSize > 0 &&
      newSize <= 100 &&
      newSize !== filters.pageSize
    ) {
      setFilters({ pageSize: newSize, page: 1 });
    } else {
      setPageSizeDraft(filters.pageSize.toString());
    }
  };

  const updateColumnFilter = (
    field: keyof VacancyItemDto,
    update: Partial<ColumnFilter>,
  ) => {
    const currentFilters = filters.columnFilters ?? [];
    const others = currentFilters.filter((f) => f.field !== field);

    const hasValues = Object.values(update).some(
      (v) => v !== undefined && v !== null && v !== "",
    );
    const current = currentFilters.find((f) => f.field === field);

    if (!hasValues && !update.sort) {
      setFilters({ columnFilters: others, page: 1 });
      return;
    }

    setFilters({
      columnFilters: [
        ...others,
        {
          ...current,
          field: field as string,
          ...update,
        },
      ],
      page: 1,
    });
  };

  const handleFilter = (
    field: keyof VacancyItemDto,
    value: string | { from?: string; to?: string } | undefined,
  ) => {
    if (typeof value === "object" && value !== null) {
      updateColumnFilter(field, { from: value.from, to: value.to });
    } else {
      updateColumnFilter(field, { filter: value });
    }
  };

  const renderHeader = (
    title: string,
    field: keyof VacancyItemDto,
    type?: "text" | "status" | "date",
  ) => (
    <ColumnActions<VacancyItemDto>
      title={title}
      field={field}
      filterType={type}
      currentFilter={filters.columnFilters.find((f) => f.field === field)}
      onSort={(f, d) =>
        updateColumnFilter(f as keyof VacancyItemDto, { sort: d })
      }
      onFilter={(f, v) => handleFilter(f as keyof VacancyItemDto, v)}
    />
  );

  const colDefs = useMemo<ColDef<VacancyItemDto>[]>(
    () => [
      {
        headerName: "#",
        width: 70,
        valueGetter: (params) =>
          (filters.page - 1) * filters.pageSize +
          (params.node?.rowIndex ?? 0) +
          1,
      },
      {
        field: "title",
        headerComponent: () => renderHeader("Название", "title", "text"),
        onCellClicked: (params) =>
          navigate(`/vacancies/${params.data?.id}/applications`),
        cellClass:
          "cursor-pointer hover:text-primary hover:underline font-medium transition-colors",
        cellRenderer: VacancyActions,
      },
      {
        field: "description",
        headerComponent: () => renderHeader("Описание", "description", "text"),
        flex: 1,
      },
      {
        field: "status",
        headerComponent: () => renderHeader("Статус", "status", "status"),
        width: 160,
        cellClass: "font-medium text-primary",
      },
      {
        field: "createdAt",
        headerComponent: () => renderHeader("Создана", "createdAt", "date"),
        width: 170,
        valueFormatter: (params) =>
          params.value
            ? new Intl.DateTimeFormat("ru-RU").format(new Date(params.value))
            : "",
      },
    ],
    [filters, navigate],
  );

  if (isError)
    return (
      <div className="p-10 text-center text-destructive">
        Ошибка загрузки вакансий
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Вакансии</h1>
        <Button
          className="gap-2 shadow-sm"
          onClick={() => navigate("/vacancies/create")}
        >
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div
          className="ag-theme-quartz w-full"
          style={{ minHeight: `${43 * filters.pageSize + 52}px` }}
        >
          <AgGridReact<VacancyItemDto>
            rowData={data?.items ?? []}
            columnDefs={colDefs}
            loading={isLoading}
            domLayout="autoHeight"
            pagination={false}
            suppressMenuHide={true}
            enableCellTextSelection={true}
            overlayNoRowsTemplate="Вакансий не найдено"
            rowClass="hover:bg-muted/30 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between p-3 border-t border-border bg-muted/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Показывать по:
            </span>
            <Input
              value={pageSizeDraft}
              onChange={(e) => setPageSizeDraft(e.target.value)}
              onBlur={handlePageSizeCommit}
              onKeyDown={(e) => e.key === "Enter" && handlePageSizeCommit()}
              className="h-8 w-12 text-center text-xs p-1 focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground min-w-[100px] text-right">
              Стр.{" "}
              <span className="font-semibold text-foreground">
                {filters.page}
              </span>{" "}
              из {data?.totalPages ?? 1}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFilters({ page: filters.page - 1 })}
                disabled={filters.page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFilters({ page: filters.page + 1 })}
                disabled={filters.page >= (data?.totalPages ?? 1) || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
