import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueGetterParams, ICellRendererParams, RowClickedEvent } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useApplicationsQuery } from "@/api/applications/model/queries";
import { SortDropdown } from "@/components/sorters/ColumnSortHeader";
import { type ApplicationItemDto, type ApplicationsParamsDto } from "@/api/applications/model/types";

export default function ApplicationsListPage() {
  const navigate = useNavigate();
const { vacancyId: vacancyId } = useParams<{ vacancyId: string }>();

const [filters, setFilters] = useState<ApplicationsParamsDto>({
  page: 1,
  pageSize: 10,
  vacancyId: vacancyId!,
  sortBy: undefined,
  sortDirection: undefined,
});

const { data, isLoading } = useApplicationsQuery(filters, { 
  enabled: !!vacancyId 
});

const handleSort = (field: keyof ApplicationItemDto, direction: "asc" | "desc" | undefined) => {
  setFilters((prev) => ({
    ...prev,
    sortBy: direction ? field : undefined,
    sortDirection: direction,
    page: 1,
  }));
};

const HeaderWithActions = ({ 
  title, 
  field 
}: { 
  title: string; 
  field: keyof ApplicationItemDto 
}) => (
  <div className="flex items-center justify-between w-full">
    <span className="font-semibold">{title}</span>
    <SortDropdown 
      field={field} 
      currentSortBy={filters.sortBy} 
      currentDirection={filters.sortDirection} 
      onSort={handleSort}
    />
  </div>
);

  const colDefs = useMemo<ColDef<ApplicationItemDto>[]>(() => [
    {
      headerName: "#",
      width: 70,
      valueGetter: (params: ValueGetterParams<ApplicationItemDto>) => 
        (filters.page - 1) * filters.pageSize + (params.node?.rowIndex ?? 0) + 1,
    },
    {
      field: "candidateFullName",
      headerComponent: () => <HeaderWithActions title="Кандидат" field="candidateFullName" />,
      flex: 1,
    },
    {
      field: "email",
      headerComponent: () => <HeaderWithActions title="Email" field="email" />,
      flex: 1,
    },
    {
      field: "currentStageName",
      headerComponent: () => <HeaderWithActions title="Стадия" field="currentStageName" />,
      width: 150,
      cellClass: "font-medium text-primary",
    },
    {
      field: "resumeName",
      headerName: "Резюме",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<ApplicationItemDto>) => {
        if (!params.value) return "—";
        return (
          <a 
            href={params.data?.resumeFileUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            {params.value}
          </a>
        );
      },
    },
  ], [filters]);

const onRowClicked = (event: RowClickedEvent<ApplicationItemDto>) => {
  const appId = event.data?.id;
  
  if (appId && vacancyId) {
    navigate(`${appId}/history`);
  }
};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vacancies")}>
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Отклики</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Добавить
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
          <AgGridReact<ApplicationItemDto>
            rowData={data?.items ?? []}
            columnDefs={colDefs}
            loading={isLoading}
            pagination={false}
            overlayNoRowsTemplate="Откликов не найдено"
            onRowClicked={onRowClicked}
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