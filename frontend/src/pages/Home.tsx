import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Plus } from "lucide-react"; // Опционально для иконки
import { vacancies } from "./mock";
import { useNavigate } from "react-router";
import type { CustomCellRendererProps } from "ag-grid-react";

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
      cellRenderer: (params: CustomCellRendererProps<IVacancy>) => {
        return (
          <span className="cursor-pointer hover:text-primary hover:underline font-medium">
            {params.value}
          </span>
        );
      },
      onCellClicked: (params) => navigate(`/applications/${params?.data?.id}`),
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
      filter: true,
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
            Управление текущими позициями и откликами
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
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
          />
        </div>
      </div>
    </div>
  );
}
