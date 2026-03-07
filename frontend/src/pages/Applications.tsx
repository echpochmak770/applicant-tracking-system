import { useState } from "react";
import { useParams } from "react-router";
import { AgGridReact } from "ag-grid-react";
//import { vacancyApplications } from "./mock";
import type { ColDef } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface IApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  stage: string;
  createdBy: string;
  resumeFileUrl: string;
  resumeName: string;
  isDeleted: boolean;
}

const vacancyApplications =   {
  1: [
    {
      id: 101,
      firstName: "Алексей",
      lastName: "Смирнов",
      email: "a.smirnov@example.com",
      phone: "+7 (916) 123-45-67",
      stage: "Новый",
      createdBy: "Елена Петрова",
      resumeFileUrl: "",
      resumeName: "Смирнов_Алексей_резюме.pdf",
      isDeleted: false,
    },
    {
      id: 102,
      firstName: "Дмитрий",
      lastName: "Козлов",
      email: "d.kozlov@example.com",
      phone: "+7 (925) 234-56-78",
      stage: "Телефонное интервью",
      createdBy: "Елена Петрова",
      resumeFileUrl: "",
      resumeName: "Козлов_Дмитрий_резюме.pdf",
      isDeleted: false,
    },
    {
      id: 103,
      firstName: "Иван",
      lastName: "Морозов",
      email: "i.morozov@example.com",
      phone: null,
      stage: "Отказ",
      createdBy: "Михаил Сидоров",
      resumeFileUrl: "",
      resumeName: "Морозов_Иван_резюме.pdf",
      isDeleted: true,
    },
  ]}

export default function Applications() {
  const navigate = useNavigate();
  const { id } = useParams();
  const vacancyId = Number(id);
  const applications =
    vacancyApplications[vacancyId as keyof typeof vacancyApplications];
  const [rowData] = useState<IApplication[]>(applications);
  const [colDefs] = useState<ColDef<IApplication>[]>([
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "firstName",
      headerName: "Имя",
      flex: 0.8,
      filter: true,
    },
    {
      field: "lastName",
      headerName: "Фамилия",
      flex: 0.8,
      filter: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      filter: true,
    },
    {
      field: "phone",
      headerName: "Телефон",
      flex: 0.8,
      filter: true,
      valueFormatter: (params: { value: string | null }) => params.value || "—",
    },
    {
      field: "stage",
      headerName: "Стадия",
      width: 160,
      filter: true,
      cellClass: "font-medium",
    },
    {
      field: "createdBy",
      headerName: "Создатель",
      flex: 0.8,
      filter: true,
    },
    {
      field: "resumeName",
      headerName: "Резюме",
      flex: 1,
      filter: true,
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return "—";
        return `<span class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        ${params.value}
      </span>`;
      },
    },
    {
      field: "isDeleted",
      headerName: "Статус",
      width: 100,
      cellClass: "font-medium text-primary",
    },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Отклики
          </h1>
        </div>

        <Button className="gap-2 shadow-lg transition-all hover:opacity-90">
          <Plus className="h-4 w-4" />
          Добавить отклик
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
