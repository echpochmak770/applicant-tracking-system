import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, RowClickedEvent } from "ag-grid-community";
import { Plus } from "lucide-react";
import { vacancies } from "./mock";
import { useNavigate } from "react-router";

interface IVacancy {
  id: number;
  title: string;
  description: string;
  status: string;
  createdById: number;
  createdAt: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [rowData] = useState<IVacancy[]>(vacancies);

  // Обработчик клика по всей строке
  const onRowClicked = (event: RowClickedEvent<IVacancy>) => {
    const vacancyId = event.data?.id;
    if (vacancyId) {
      // Переходим на список откликов для этой вакансии
      navigate(`/vacancies/${vacancyId}/applications`);
    }
  };

  const [colDefs] = useState<ColDef<IVacancy>[]>([
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "title",
      headerName: "Название вакансии",
      flex: 1,
      filter: true,
      cellClass: "font-medium text-primary underline-offset-4 hover:underline",
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
      filter: true,
      cellRenderer: (params: { value: string }) => {
        // Пример простой стилизации статуса
        const isClosed = params.value === "Closed";
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${isClosed ? 'bg-secondary' : 'bg-primary/10 text-primary'}`}>
            {params.value}
          </span>
        );
      }
    },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Вакансии
          </h1>
          <p className="text-muted-foreground">
            Управление текущими позициями и просмотр откликов
          </p>
        </div>

        <Button className="gap-2 shadow-lg transition-all hover:opacity-90">
          <Plus className="h-4 w-4" />
          Добавить вакансию
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="ag-theme-quartz" style={{ height: 700, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            onRowClicked={onRowClicked} // Клик по строке
            rowClass="cursor-pointer" // Указатель при наведении
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
          />
        </div>
      </div>
    </div>
  );
}