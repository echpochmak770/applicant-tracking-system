import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useVacanciesQuery } from "@/api/vacancies/model/queries"
import { type VacancyItemDto, type VacancyStatus } from "@/api/vacancies/model/types"

import { SortDropdown } from "@/components/sorters/SortDropdown"
import { StatusVacancyFilter } from "@/components/filters/StatusVacancyFilter"
import { TextSearchFilter } from "@/components/filters/TextSearchFilter"
import type { ColumnFilter } from "@/api/types";

export default function VacanciesListPage() {
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    columnFilters: [] as ColumnFilter[],
  })

  const { data, isLoading, isError } = useVacanciesQuery(filters)

  const getColumnFilter = (field: string) : ColumnFilter | undefined =>
    filters.columnFilters.find((f) => f.field === field)

  const updateColumnFilter = (field: string, update: Partial<ColumnFilter>) => {
    setFilters((prev) => {
      const others = prev.columnFilters.filter((f) => f.field !== field)

      if (!update.sort && !update.filter) {
        return {
          ...prev,
          columnFilters: others,
        }
      }

      return {
        ...prev,
        columnFilters: [
          ...others,
          {
            field,
            ...getColumnFilter(field),
            ...update,
          },
        ],
        page: 1,
      }
    })
  }

  const handleSort = (field: string, direction: "asc" | "desc" | undefined) => {
    updateColumnFilter(field, { sort: direction })
  }

  const handleTextFilter = (field: string, value?: string) => {
    updateColumnFilter(field, { filter: value })
  }

  const handleStatusFilter = (value?: string) => {
    updateColumnFilter("status", { filter: value })
  }

  const HeaderWithActions = ({
    title,
    field,
    filterType,
  }: {
    title: string
    field: string
    filterType?: "text" | "status"
  }) => {
    const columnFilter = getColumnFilter(field)

    return (
      <div className="flex items-center justify-between w-full group">
        <span className="font-semibold">{title}</span>

        <div
          className="flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <SortDropdown
            field={field}
            currentSort={columnFilter?.sort}
            onSort={handleSort}
          />

          {filterType === "text" && (
            <TextSearchFilter
                value={columnFilter?.filter}
                onChange={(v) => handleTextFilter("title", v)}
            />
          )}

          {filterType === "status" && (
            <StatusVacancyFilter
              value={columnFilter?.filter as VacancyStatus}
              onChange={handleStatusFilter}
            />
          )}
        </div>
      </div>
    )
  }

  const colDefs = useMemo<ColDef<VacancyItemDto>[]>(() => [
    {
      headerName: "#",
      width: 60,
      valueGetter: (params) =>
        (filters.page - 1) * filters.pageSize +
        (params.node?.rowIndex ?? 0) +
        1,
    },
    {
      field: "title",
      headerComponent: () => (
        <HeaderWithActions
          title="Название"
          field="title"
          filterType="text"
        />
      ),
      flex: 1,
      onCellClicked: (params) =>
        navigate(`/vacancies/${params.data?.id}/applications`),
      cellClass:
        "cursor-pointer hover:text-primary hover:underline font-medium",
    },
    {
      field: "description",
      headerComponent: () => (
        <HeaderWithActions
          title="Описание"
          field="description"
          filterType="text"
        />
      ),
      flex: 1.2,
    },
    {
      field: "status",
      headerComponent: () => (
        <HeaderWithActions
          title="Статус"
          field="status"
          filterType="status"
        />
      ),
      width: 150,
      cellClass: "font-medium text-primary",
    },
    {
      field: "createdAt",
      headerComponent: () => (
        <HeaderWithActions title="Создана" field="createdAt" />
      ),
      width: 160,
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("ru-RU").format(
              new Date(params.value)
            )
          : "",
    },
  ], [filters.page, filters.pageSize, navigate])

  if (isError) return <div className="p-6">Ошибка загрузки...</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Вакансии</h1>

        <Button
          className="gap-2 h-full"
          onClick={() => navigate("/vacancies/create")}
        >
          <Plus className="h-4 w-4" />
          Добавить
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
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page - 1,
              }))
            }
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
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: prev.page + 1,
              }))
            }
            disabled={filters.page >= (data?.totalPages ?? 1) || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}