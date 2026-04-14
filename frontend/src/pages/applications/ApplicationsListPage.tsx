import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useApplicationsQuery } from "@/api/applications/model/queries";
import { useVacancyStagesQuery } from "@/api/stage/model/queries";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useStagesStore } from "@/store/useStagesStore";
import { Input } from "@/components/ui/input";
import type { ColumnFilter } from "@/api/types";
import { type ApplicationItemDto } from "@/store/useApplicationStore";
import { ColumnActions } from "@/components/tables/ColumnActions";
import { useVacancyQuery } from "@/api/vacancies/model/queries";

export default function ApplicationsListPage() {
  const navigate = useNavigate();
  const { vacancyId } = useParams<{ vacancyId: string }>();

  const { filters, setFilters, setApplication } = useApplicationStore();
  const { setStages } = useStagesStore();

  const [pageSizeDraft, setPageSizeDraft] = useState(
    filters.pageSize.toString(),
  );

  const { data, isLoading } = useApplicationsQuery(vacancyId!, filters, {
    enabled: !!vacancyId,
  });

  const { data: stages } = useVacancyStagesQuery(vacancyId!);

  const { data: vacancy } = useVacancyQuery(vacancyId!);

  useEffect(() => {
    if (stages && vacancyId) setStages(vacancyId, stages);
  }, [stages, vacancyId, setStages]);

  useEffect(() => {
    setPageSizeDraft(filters.pageSize.toString());
  }, [filters.pageSize]);

  const handlePageSizeCommit = () => {
    const newSize = parseInt(pageSizeDraft);
    if (!isNaN(newSize) && newSize > 0 && newSize <= 100) {
      setFilters({ pageSize: newSize, page: 1 });
    } else {
      setPageSizeDraft(filters.pageSize.toString());
    }
  };

  const updateColumnFilter = (
    field: keyof ApplicationItemDto,
    update: Partial<ColumnFilter>,
  ) => {
    const currentColumnFilters = filters.columnFilters ?? [];
    const others = currentColumnFilters.filter(
      (f: ColumnFilter) => f.field !== field,
    );
    const hasValue = Object.values(update).some(
      (v) => v !== undefined && v !== null && v !== "",
    );
    if (!hasValue) {
      setFilters({
        columnFilters: others,
        page: 1,
      });
      return;
    }
    const current = currentColumnFilters.find(
      (f: ColumnFilter) => f.field === field,
    );
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
    field: keyof ApplicationItemDto,
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
    field: keyof ApplicationItemDto,
    type?: "text" | "status" | "date",
  ) => (
    <ColumnActions<ApplicationItemDto>
      title={title}
      field={field}
      filterType={type}
      currentFilter={filters.columnFilters?.find(
        (f: ColumnFilter) => f.field === field,
      )}
      onSort={(f, d) =>
        updateColumnFilter(f as keyof ApplicationItemDto, { sort: d })
      }
      onFilter={(f, v) => handleFilter(f as keyof ApplicationItemDto, v)}
      statusOptions={type === "status" ? stages : undefined}
    />
  );

  const colDefs = useMemo<ColDef<ApplicationItemDto>[]>(
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
        field: "candidateFullName",
        headerComponent: () =>
          renderHeader("Кандидат", "candidateFullName", "text"),
        flex: 1,
      },
      {
        field: "email",
        headerComponent: () => renderHeader("Email", "email", "text"),
        flex: 1,
      },
      {
        field: "currentStageName",
        headerComponent: () =>
          renderHeader("Стадия", "currentStageName", "status"),
        width: 200,
        cellClass: "font-medium text-primary",
      },
      {
        field: "resumeName",
        headerName: "Резюме",
        flex: 1,
        cellRenderer: (params: ICellRendererParams<ApplicationItemDto>) => {
          if (!params.value)
            return <span className="text-muted-foreground">—</span>;
          return (
            <a
              href={params.data?.resumeFileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="rotate-45 h-3.5 w-3.5" />
              {params.value}
            </a>
          );
        },
      },
    ],
    [filters, stages, renderHeader],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vacancies")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Отклики {vacancy?.title}
          </h1>
        </div>

        <Button className="gap-2 shadow-sm" onClick={() => navigate(`create`)}>
          <Plus className="h-4 w-4" /> Добавить кандидата
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div
          className="ag-theme-quartz w-full"
          style={{ height: `${43 * filters.pageSize + 52}px` }}
        >
          <AgGridReact<ApplicationItemDto>
            rowData={data?.items ?? []}
            columnDefs={colDefs}
            loading={isLoading}
            domLayout="autoHeight"
            pagination={false}
            suppressMenuHide={true}
            overlayNoRowsTemplate="Откликов не найдено"
            onRowClicked={(e) => {
              if (e.data) {
                setApplication(e.data);
                navigate(`${e.data.id}/history`);
              }
            }}
            rowClass="cursor-pointer transition-colors hover:bg-muted/30"
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
