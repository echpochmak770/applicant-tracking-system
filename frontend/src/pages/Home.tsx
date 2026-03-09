import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVacanciesQuery } from "@/api/vacancies/model/queries";
import { type VacancyItemDto } from "@/api/vacancies/model/types";
import { SortDropdown } from "@/components/sorters/ColumnSortHeader";

export default function Home() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    sortBy: undefined as string | undefined,
    sortDirection: undefined as "asc" | "desc" | undefined,
  });

  const { data, isLoading, isError } = useVacanciesQuery(filters);

  const handleSort = (field: string, direction: "asc" | "desc" | undefined) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: direction ? field : undefined,
      sortDirection: direction,
      page: 1,
    }));
  };

  const HeaderWithActions = ({ title, field }: { title: string; field: string }) => (
    <div className="flex items-center justify-between w-full group">
      <span className="font-semibold">{title}</span>
      <div className="flex items-center gap-0.5">
        <SortDropdown 
          field={field} 
          currentSortBy={filters.sortBy} 
          currentDirection={filters.sortDirection} 
          onSort={handleSort} 
        />
      </div>
    </div>
  );

const colDefs = useMemo<ColDef<VacancyItemDto>[]>(() => [
    {
      headerName: "#",
      width: 60,
      valueGetter: (params) => (filters.page - 1) * filters.pageSize + (params.node?.rowIndex ?? 0) + 1,
    },
    {
      field: "title",
      headerComponent: () => <HeaderWithActions title="Название" field="title" />,
      flex: 1,
      onCellClicked: (params) => navigate(`/applications/${params.data?.id}`),
      cellClass: "cursor-pointer hover:text-primary hover:underline font-medium",
    },
    {
      field: "description",
      headerComponent: () => <HeaderWithActions title="Описание" field="description" />,
      flex: 1.2,
    },
    {
      field: "status",
      headerComponent: () => <HeaderWithActions title="Статус" field="status" />,
      width: 150,
      cellClass: "font-medium text-primary",
    },
    {
      field: "createdAt",
      headerComponent: () => <HeaderWithActions title="Создана" field="createdAt" />,
      width: 160,
      valueFormatter: (params) => params.value ? new Intl.DateTimeFormat("ru-RU").format(new Date(params.value)) : "",
    },
  ], [filters, navigate]);

  if (isError) return <div className="p-6">Ошибка загрузки...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Вакансии</h1>
        </div>
        <Button className="gap-2 h-full" onClick={() => navigate('/add-vacancy')}>
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={data?.items ?? []}
            columnDefs={colDefs}
            loading={isLoading}
            pagination={false}
            suppressMenuHide={true}
            enableCellTextSelection={true}
            overlayNoRowsTemplate="Вакансий не найдено"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={filters.page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          <div className="text-sm text-muted-foreground">
            Страница {filters.page} из {data?.totalPages ?? 1}
          </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={filters.page >= (data?.totalPages ?? 1) || isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}