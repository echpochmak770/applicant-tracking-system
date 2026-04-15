import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { useApplicationHistoryQuery } from "@/api/applications/model/queries";
import type { ApplicationHistoryItemDto } from "@/api/applications/model/types";
import StageVisualizer from "@/components/application/stageVisualizer";
import { useDownloadFile } from "@/api/applications/model/mutations";
import { useApplicationQuery } from "@/api/applications/model/queries";
import { useVacancyStagesQuery } from "@/api/stage/model/queries";
import Loader from "@/components/ui/loader";

export default function ApplicationHistoryPage() {
  const { vacancyId, applicationId } = useParams();
  const navigate = useNavigate();

  const { data: currentApplication, isLoading: isApplicationLoading } =
    useApplicationQuery(applicationId!);

  const { mutate: downloadFile } = useDownloadFile();
  const { data: stages = [], isLoading: isStagesLoading } =
    useVacancyStagesQuery(vacancyId!);

  const {
    data,
    isError,
    isLoading: isHistoryLoading,
  } = useApplicationHistoryQuery(
    {
      vacancyId: vacancyId!,
      applicationId: applicationId!,
    },
    { enabled: !!vacancyId && !!applicationId },
  );

  const colDefs = useMemo<ColDef<ApplicationHistoryItemDto>[]>(
    () => [
      {
        headerName: "Этап",
        flex: 1,
        cellClass: "font-bold text-primary",
        valueGetter: (p) => {
          const from = p.data?.fromStageName;
          const to = p.data?.toStageName;
          return from && from !== "Начало"
            ? `${from} → ${to}`
            : `Начало: ${to}`;
        },
      },
      {
        field: "changedAt",
        headerName: "Дата",
        width: 200,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleString("ru-RU") : "",
      },
      {
        field: "changedByName",
        headerName: "Сотрудник",
        flex: 1,
      },
      {
        field: "comment",
        headerName: "Комментарий",
        flex: 1.5,
        wrapText: true,
        autoHeight: true,
        cellClass: "italic text-muted-foreground",
      },
    ],
    [],
  );

  if (isApplicationLoading || isStagesLoading || isHistoryLoading) {
    return (
      <div className="flex flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-6">
          <Loader />
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Загрузка информации об отклике...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (
    !currentApplication ||
    isError ||
    !data ||
    data.length === 0 ||
    !applicationId
  ) {
    return (
      <div className="p-10 text-center flex flex-col gap-4 items-center">
        <p>Данные кандидата не найдены</p>
        <Button onClick={() => navigate(-1)}>Вернуться к списку</Button>
      </div>
    );
  }

  const currentStage = data[0];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentApplication.candidateFullName}
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/vacancies/${vacancyId}/applications/${applicationId}/update`,
              )
            }
          >
            Редактировать
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("vacancyId", vacancyId || "");
              navigate(`/stages`);
            }}
          >
            Изменить стадию
          </Button>
        </div>
      </div>

      <StageVisualizer
        stages={stages}
        isRejected={currentStage.isRejection}
        isCompleted={currentStage.isHired}
        currentStage={
          currentStage.toStageName !== "Отказ"
            ? currentStage.toStageName
            : currentStage.fromStageName
        }
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[350px] space-y-6">
          <div className="bg-card rounded-xl border shadow-sm divide-y">
            <div className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <User className="size-4" /> Личные данные
              </h3>
              <div className="space-y-4">
                <DetailRow
                  label="Email"
                  value={currentApplication.email}
                  icon={<Mail className="size-4" />}
                  isLink
                  href={`mailto:${currentApplication.email}`}
                />
                <DetailRow
                  label="Телефон"
                  value={currentApplication.phone || "Не указан"}
                  icon={<Phone className="size-4" />}
                />
                <DetailRow
                  label="Добавил"
                  value={currentApplication.creatorFullName}
                  icon={<Calendar className="size-4" />}
                />
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <FileText className="size-4" /> Документы
              </h3>
              <Button
                variant="ghost"
                size="lg"
                onClick={() =>
                  downloadFile(
                    {
                      applicationId: applicationId,
                    },
                    {
                      onSuccess: (data) => {
                        const url = window.URL.createObjectURL(data);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = currentApplication.resumeName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      },
                    },
                  )
                }
                className="flex items-center cursor-pointer justify-between p-3 rounded-lg border border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {currentApplication.resumeName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                      Открыть резюме
                    </span>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-card rounded-xl border shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <h3 className="font-bold">Лог перемещений и комментарии</h3>
            </div>
            <div
              className="ag-theme-quartz flex-grow"
              style={{ minHeight: 400 }}
            >
              <AgGridReact
                rowData={data as unknown as ApplicationHistoryItemDto[]}
                columnDefs={colDefs}
                defaultColDef={{
                  resizable: true,
                  sortable: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, isLink, href }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        {isLink ? (
          <a
            href={href}
            className="text-primary hover:underline font-medium break-all"
          >
            {value}
          </a>
        ) : (
          <span className="font-medium text-foreground">{value}</span>
        )}
      </div>
    </div>
  );
}
