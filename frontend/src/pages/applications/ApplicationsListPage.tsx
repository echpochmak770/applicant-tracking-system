import { useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { AgGridReact } from "ag-grid-react"
import type { ColDef, ValueGetterParams, ICellRendererParams, RowClickedEvent } from "ag-grid-community"

import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

import { useApplicationsQuery } from "@/api/applications/model/queries"
import { useVacancyStagesQuery } from "@/api/vacancies/model/queries"

import { SortDropdown } from "@/components/sorters/SortDropdown"
import { TextSearchFilter } from "@/components/filters/TextSearchFilter"
import { StatusVacancyFilter } from "@/components/filters/StatusVacancyFilter"

import type {
  ApplicationItemDto,
  ApplicationsParamsDto
} from "@/api/applications/model/types"
import type { ColumnFilter } from "@/api/types"

const mockStages = [
  { label: "Все", val: undefined },
  { label: "Applied", val: "Applied" },
  { label: "HR Interview", val: "HR Interview" },
  { label: "Tech Interview", val: "Tech Interview" },
  { label: "Offer", val: "Offer" },
]

export default function ApplicationsListPage() {

  const navigate = useNavigate()
  const { vacancyId } = useParams<{ vacancyId: string }>()

  const [filters, setFilters] = useState<ApplicationsParamsDto>({
    vacancyId: vacancyId!,
    page: 1,
    pageSize: 10,
    columnFilters: []
  })

  const { data, isLoading } = useApplicationsQuery(filters, {
    enabled: !!vacancyId
  })

  const { data: stages } = useVacancyStagesQuery(vacancyId!)

  const getColumnFilter = (field: string) =>
    filters.columnFilters?.find(f => f.field === field)

  const updateColumnFilter = (field: string, update: Partial<ColumnFilter>) => {

    setFilters(prev => {

      const others = prev.columnFilters?.filter(f => f.field !== field) ?? []

      if (!update.sort && !update.filter) {
        return { ...prev, columnFilters: others }
      }

      return {
        ...prev,
        columnFilters: [
          ...others,
          {
            field,
            ...getColumnFilter(field),
            ...update
          }
        ],
        page: 1
      }
    })
  }

  const handleSort = (field: string, direction?: "asc" | "desc") => {
    updateColumnFilter(field, { sort: direction })
  }

  const handleTextFilter = (field: string, value?: string) => {
    updateColumnFilter(field, { filter: value })
  }

  const handleStageFilter = (value?: string) => {
    updateColumnFilter("currentStageName", { filter: value })
  }

  const HeaderWithActions = ({
    title,
    field,
    filterType
  }: {
    title: string
    field: keyof ApplicationItemDto
    filterType?: "text" | "stage"
  }) => {

    const columnFilter = getColumnFilter(field)

    return (
      <div className="flex items-center justify-between w-full">

        <span className="font-semibold">{title}</span>

        <div
          className="flex items-center gap-1"
          onClick={e => e.stopPropagation()}
        >

          <SortDropdown
            field={field}
            currentSort={columnFilter?.sort}
            onSort={handleSort}
          />

          {filterType === "text" && (
            <TextSearchFilter
              value={columnFilter?.filter}
              onChange={(v) => handleTextFilter(field, v)}
            />
          )}
          {filterType === "stage" && (
            <StatusVacancyFilter
              value={columnFilter?.filter}
              onChange={handleStageFilter}
              options={mockStages}
            />
          )}
        </div>
      </div>
    )
  }

  const colDefs = useMemo<ColDef<ApplicationItemDto>[]>(() => [

    {
      headerName: "#",
      width: 70,
      valueGetter: (params: ValueGetterParams<ApplicationItemDto>) =>
        (filters.page - 1) * filters.pageSize + (params.node?.rowIndex ?? 0) + 1,
    },

    {
      field: "candidateFullName",
      headerComponent: () =>
        <HeaderWithActions
          title="Кандидат"
          field="candidateFullName"
          filterType="text"
        />,
      flex: 1,
    },

    {
      field: "email",
      headerComponent: () =>
        <HeaderWithActions
          title="Email"
          field="email"
          filterType="text"
        />,
      flex: 1,
    },

    {
      field: "currentStageName",
      headerComponent: () =>
        <HeaderWithActions
          title="Стадия"
          field="currentStageName"
          filterType="stage"
        />,
      width: 160,
      cellClass: "font-medium text-primary",
    },

    {
      field: "resumeName",
      headerName: "Резюме",
      flex: 1,
      cellRenderer: (params: ICellRendererParams<ApplicationItemDto>) => {

        if (!params.value) return "—"

        return (
          <a
            href={params.data?.resumeFileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            {params.value}
          </a>
        )
      },
    },

  ], [filters, stages])

  const onRowClicked = (event: RowClickedEvent<ApplicationItemDto>) => {

    const appId = event.data?.id

    if (appId && vacancyId) {
      navigate(`${appId}/history`)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">

        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/vacancies")}
          >
            <ArrowLeft className="size-6" />
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            Отклики
          </h1>
        </div>

        <Button className="gap-2" onClick={() => navigate(`create`)}>
          <Plus className="h-4 w-4" />
          Добавить
        </Button>

      </div>

      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">

        <div
          className="ag-theme-quartz"
          style={{ height: 600, width: "100%" }}
        >
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
            onClick={() =>
              setFilters(prev => ({ ...prev, page: prev.page - 1 }))
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
              setFilters(prev => ({ ...prev, page: prev.page + 1 }))
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