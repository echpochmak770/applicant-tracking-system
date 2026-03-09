import { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router";
import { AgGridReact } from "ag-grid-react";
import { vacancyApplications } from "./mock";
import type { ColDef, RowClickedEvent } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";

interface IApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  stage: string;
  createdBy: string;
  resumeName: string;
}

export default function Applications() {
  const navigate = useNavigate();
  const { vacancyId } = useParams();
  
  const applications = vacancyApplications[Number(vacancyId) as keyof typeof vacancyApplications] || [];
  const [rowData] = useState<IApplication[]>(applications);

  const [colDefs] = useState<ColDef<IApplication>[]>([
    { field: "id", headerName: "ID", width: 80 },
    { field: "firstName", headerName: "Имя", flex: 1, filter: true },
    { field: "lastName", headerName: "Фамилия", flex: 1, filter: true },
    { field: "stage", headerName: "Стадия", width: 150, cellClass: "font-medium text-blue-600" },
    { field: "resumeName", headerName: "Резюме", flex: 1 },
  ]);

  const onRowClicked = (event: RowClickedEvent<IApplication>) => {
    const appId = event.data?.id;
    if (appId) {
      navigate(`${appId}/history`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vacancies")}>
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Отклики вакансии #{vacancyId}</h1>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Добавить</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-2 shadow-sm">
          <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              onRowClicked={onRowClicked}
              rowClass="cursor-pointer hover:bg-slate-50 transition-colors"
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}