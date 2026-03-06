import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVacanciesQuery } from "@/api/vacancies/model/queries";
import { type VacanciesParamsDto, type VacancyItemDto, type VacancyStatus } from "@/api/vacancies/model/types";
import { StatusVacancyFilter } from "@/components/filters/statusVacancyFilter";

export default function Home() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<VacanciesParamsDto>({
    page: 1,
    pageSize: 10,
    search: "",
    status: undefined
  });

  const { data, isLoading, isError } = useVacanciesQuery(filters);

  const colDefs = useMemo<ColDef<VacancyItemDto>[]>(() => [
    {
      headerName: "#",
      width: 70,
      valueGetter: (params) => {
        const index = params.node?.rowIndex ?? 0;
        return (filters.page - 1) * filters.pageSize + index + 1;
      },
      sortable: false,
      filter: false,
    },
    {
      field: "title",
      headerName: "Название вакансии",
      flex: 1,
      onCellClicked: (params) => navigate(`/applications/${params.data?.id}`),
      cellClass: "cursor-pointer hover:text-primary hover:underline font-medium",
    },
    {
      field: "description",
      headerName: "Описание",
      flex: 1.2,
      filter: true,   
    },
    {
      field: "status",
      headerName: "Статус",
      width: 150,
      cellClass: "font-medium text-primary",
      headerComponent: () => (
        <StatusVacancyFilter 
          value={filters.status || "all"} 
          onValueChange={(val: VacancyStatus) => setFilters(prev => ({ 
            ...prev, 
            status: val ?? undefined, 
            page: 1 
          }))} 
        />
      )
    },
    {
      field: "createdAt",
      headerName: "Дата создания",
      width: 130,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Intl.DateTimeFormat("ru-RU").format(new Date(params.value));
      },
    },
  ], [filters.page, filters.pageSize, navigate]);

  if (isError) return <div className="p-6">Ошибка загрузки...</div>;

  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Вакансии</h1>
          <p className="text-muted-foreground">Найдено всего: {data?.totalCount ?? 0}</p>
        </div>
        <Button className="gap-2 h-full">
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
            overlayNoRowsTemplate="Вакансий не найдено"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 px-2 ">
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