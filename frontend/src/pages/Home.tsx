import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { Plus } from "lucide-react"; // Опционально для иконки
import { mock } from "./mock";

// Типизация для вакансии
interface Vacancy {
  id: number;
  title: string;
  position: string;
  applications: number;
}

export default function Home() {
  // Моки
  const [rowData] = useState<Vacancy[]>(mock);

  // Определение колонок
  const [colDefs] = useState<ColDef<Vacancy>[]>([
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "title",
      headerName: "Название проекта",
      flex: 1,
      filter: true,
    },
    {
      field: "position",
      headerName: "Должность",
      flex: 1.2,
      filter: true,
    },
    {
      field: "applications",
      headerName: "Отклики",
      width: 150,
      cellClass: "font-medium text-primary", // Используем наш фиолетовый для акцента
      filter: true,
    },
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Заголовок и Действия */}
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

      {/* Контейнер таблицы */}
      <div className="rounded-xl border border-border bg-card p-2 shadow-sm">
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={{
              sortable: true,
              resizable: true,
            }}
            // Включаем пагинацию для красоты
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
          />
        </div>
      </div>
    </div>
  );
}
