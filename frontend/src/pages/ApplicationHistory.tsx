import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, FileText, User, Calendar, MessageSquare } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { vacancyApplications } from "./mock";
import StageVisualizer from "@/components/stageVisualizer";

// История перемещений
export const applicationHistory = [
  {
    id: 101,
    fromStage: null,
    toStage: "Новый",
    changedAt: "2023-10-01 10:00",
    comment: "Автоматический импорт из HeadHunter",
    changedBy: "Система",
  },
  {
    id: 102,
    fromStage: "Новый",
    toStage: "Интервью",
    changedAt: "2023-10-03 14:20",
    comment: "Кандидат проявил интерес, назначен созвон",
    changedBy: "Иван Иванов",
  },
];

export default function ApplicationHistory() {
  const { vacancyId, applicationId } = useParams();
  const navigate = useNavigate();

  // Ищем данные конкретного кандидата в моках по id вакансии и id отклика
  const candidate = useMemo(() => {
    const apps = vacancyApplications[Number(vacancyId) as keyof typeof vacancyApplications] || [];
    return apps.find(app => app.id === Number(applicationId));
  }, [vacancyId, applicationId]);

  // Колонки для таблицы истории перемещений
  const colDefs = useMemo<ColDef[]>(() => [
    { 
      field: "toStage", 
      headerName: "Этап", 
      flex: 1, 
      cellClass: "font-bold text-primary",
      valueFormatter: (p) => p.data.fromStage ? `${p.data.fromStage} → ${p.data.toStage}` : `Начало: ${p.data.toStage}`
    },
    { field: "changedAt", headerName: "Дата", width: 160 },
    { field: "changedBy", headerName: "Сотрудник", flex: 1 },
    { 
      field: "comment", 
      headerName: "Комментарий", 
      flex: 1.5,
      wrapText: true,
      autoHeight: true,
      cellClass: "py-2 italic text-muted-foreground"
    },
  ], []);

  if (!candidate) return <div className="p-10 text-center">Отклик не найден</div>;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">ID отклика: {applicationId} • Вакансия: #{vacancyId}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">Редактировать</Button>
          <Button color="primary">Изменить стадию</Button>
        </div>
      </div>

        <StageVisualizer currentStage={candidate.stage}/>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Левая колонка: Профиль кандидата */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm divide-y">
            <div className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4"><User className="size-4" /> Личные данные</h3>
              <div className="space-y-4">
                <DetailRow label="Email" value={candidate.email} icon={<Mail className="size-4" />} isLink href={`mailto:${candidate.email}`} />
                <DetailRow label="Телефон" value={candidate.phone || "Не указан"} icon={<Phone className="size-4" />} />
                <DetailRow label="Добавил" value={candidate.createdBy} icon={<Calendar className="size-4" />} />
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4"><FileText className="size-4" /> Документы</h3>
              <a 
                href={candidate.resumeFileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border shadow-sm text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[150px]">{candidate.resumeName}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Нажмите, чтобы открыть</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Правая колонка: Таблица истории */}
        <div className="lg:col-span-8">
          <div className="bg-card rounded-xl border shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <h3 className="font-bold">Лог перемещений и комментарии</h3>
            </div>
            <div className="ag-theme-quartz flex-grow" style={{ minHeight: 400 }}>
              <AgGridReact 
                rowData={applicationHistory} 
                columnDefs={colDefs}
                defaultColDef={{ resizable: true }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательный компонент для строк деталей
function DetailRow({ label, value, icon, isLink, href }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        {isLink ? (
          <a href={href} className="text-primary hover:underline font-medium">{value}</a>
        ) : (
          <span className="font-medium text-foreground">{value}</span>
        )}
      </div>
    </div>
  );
}