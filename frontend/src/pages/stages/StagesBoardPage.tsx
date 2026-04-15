import React, { useState, useRef, useCallback, useEffect } from "react";
import { useVacancyStagesQuery } from "@/api/stage/model/queries";
import { useApplicationsQuery } from "@/api/applications/model/queries";
import {
  useUpdateStageMutation,
  useRejectMutation,
  useOfferMutation,
} from "@/api/stage/model/mutations";
import { useVacanciesQuery } from "@/api/vacancies/model/queries";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  pointerWithin,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import UpdateStageDialog from "@/components/stages/updateStageDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, InboxIcon, GripVertical } from "lucide-react";
import { useNavigate } from "react-router";

type ColumnTagType = "reject" | "update" | "offer";

function ApplicationItem({
  id,
  vacancyId,
  children,
}: {
  id: string;
  vacancyId: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id });
  const navigate = useNavigate();

  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className="group relative flex items-center gap-2 rounded-xl border bg-card p-3 shadow-sm hover:shadow-md transition-all"
    >
      <div
        className="flex-1 cursor-pointer"
        onClick={() =>
          navigate(`/vacancies/${vacancyId}/applications/${id}/history`)
        }
      >
        {children}
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded"
      >
        <GripVertical size={18} />
      </div>
    </div>
  );
}

function Column({
  id,
  vacancyId,
  title,
  items,
}: {
  id: string;
  vacancyId: string;
  title: string;
  items: { id: string; candidateFullName: string }[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className="px-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {items.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-row flex-wrap flex-1 content-start items-start rounded-2xl border-2 border-dashed p-3 gap-3 transition-all duration-200",
          "border-border bg-muted/20",
          isOver &&
            "border-primary ring-4 ring-primary/10 bg-primary/5 shadow-inner",
        )}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((app) => (
            <ApplicationItem key={app.id} vacancyId={vacancyId} id={app.id}>
              <div className="text-sm font-medium text-nowrap">
                {app.candidateFullName}
              </div>
            </ApplicationItem>
          ))}
        </SortableContext>

        {items.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/50 italic">
            Пусто
          </div>
        )}
      </div>
    </div>
  );
}

function RejectColumn({
  id,
  vacancyId,
  items,
}: {
  id: string;
  vacancyId: string;
  items: { id: string; candidateFullName: string }[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="px-3 text-sm font-semibold text-destructive/80 uppercase tracking-wider flex items-center gap-2">
        Отказ
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-row flex-wrap flex-shrink-0 content-start items-start min-h-[70px] rounded-2xl border-2 border-dashed p-3 gap-3 transition-all duration-200",
          "border-destructive/20 bg-destructive/[0.02]",
          isOver &&
            "border-destructive ring-4 ring-destructive/10 bg-destructive/5 shadow-inner",
        )}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((app) => (
            <ApplicationItem key={app.id} vacancyId={vacancyId} id={app.id}>
              <div className="text-sm font-medium">{app.candidateFullName}</div>
            </ApplicationItem>
          ))}
        </SortableContext>

        {items.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center text-xs text-destructive/30 font-medium">
            Перетащите сюда для отказа
          </div>
        )}
      </div>
    </div>
  );
}

function HireColumn({
  id,
  vacancyId,
  items,
}: {
  id: string;
  vacancyId: string;
  items: { id: string; candidateFullName: string }[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="px-3 text-sm font-semibold text-success uppercase tracking-wider flex items-center gap-2">
        Оффер
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-row flex-wrap flex-shrink-0 content-start items-start min-h-[70px] rounded-2xl border-2 border-dashed p-3 gap-3 transition-all duration-200",
          "border-success/20 bg-success/[0.02]",
          isOver &&
            "border-success ring-4 ring-success/10 bg-success/5 shadow-inner",
        )}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((app) => (
            <ApplicationItem key={app.id} vacancyId={vacancyId} id={app.id}>
              <div className="text-sm font-medium">{app.candidateFullName}</div>
            </ApplicationItem>
          ))}
        </SortableContext>

        {items.length === 0 && !isOver && (
          <div className="flex-1 flex items-center justify-center text-xs text-success/40 font-medium">
            Перетащите сюда для оффера
          </div>
        )}
      </div>
    </div>
  );
}

export type PendingMove = {
  type: ColumnTagType;
  applicationId: string;
  targetStageId: string;
};

export default function StagesBoardPage() {
  const [vacancyId, setVacancyId] = useState("");
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const lastOverColumnId = useRef<string | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setVacancyId(localStorage.getItem("vacancyId") ?? "");
  }, []);

  const { data } = useVacanciesQuery({
    page: 1,
    pageSize: 100,
    columnFilters: [],
  });

  const { data: apiStages, isLoading: isStagesLoading } =
    useVacancyStagesQuery(vacancyId);
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    refetch,
  } = useApplicationsQuery(
    vacancyId,
    { page: 1, pageSize: 100, columnFilters: [] },
    { select: (res) => res.items, enabled: !!vacancyId },
  );

  const stages = apiStages?.filter((stage) => stage.name !== "Оффер");

  const { mutate: updateStage, isPending: isUpdateStagePending } =
    useUpdateStageMutation();
  const { mutate: reject, isPending: isRejectPending } = useRejectMutation();
  const { mutate: offer, isPending: isOfferPending } = useOfferMutation();

  const sensors = useSensors(useSensor(PointerSensor));

  const activeApp = applications?.find((a) => a.id === activeId);

  const collisionDetection = useCallback((args: any) => {
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    return closestCenter(args);
  }, []);

  const getColumnForItem = (itemId: string) => {
    const app = applications?.find((a) => a.id === itemId);
    if (!app) return null;

    if (app.currentStageName === "Отказ") return "reject";
    if (app.currentStageName === "Оффер") return "offer";

    return stages?.find((stage) => stage.name === app.currentStageName)?.id;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;

    const overId = String(over.id);

    const isColumn =
      stages?.some((s) => s.id === overId) ||
      overId === "reject" ||
      overId === "offer";

    const columnId = isColumn ? overId : getColumnForItem(overId);

    if (columnId) {
      lastOverColumnId.current = columnId;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    const applicationId = String(active.id);
    const sourceStageId = getColumnForItem(applicationId);
    const targetId = lastOverColumnId.current;

    lastOverColumnId.current = null;
    setActiveId(null);

    if (!targetId || targetId === sourceStageId) return;

    let moveType: ColumnTagType = "update";
    if (targetId === "reject") moveType = "reject";
    else if (targetId === "offer") moveType = "offer";

    setPendingMove({
      applicationId,
      targetStageId: targetId,
      type: moveType,
    });
  };

  const handleConfirmMove = (comment: string) => {
    if (!pendingMove) return;

    const { type, applicationId, targetStageId } = pendingMove;

    switch (type) {
      case "offer":
        console.log("offer");
        offer(
          { applicationId, body: { comment } },
          {
            onSuccess: () => {
              refetch();
              setPendingMove(null);
            },
          },
        );
        break;

      case "reject":
        reject(
          { applicationId, body: { comment } },
          {
            onSuccess: () => {
              refetch();
              setPendingMove(null);
            },
          },
        );
        break;

      case "update":
        updateStage(
          {
            applicationId,
            body: { targetStageId, comment },
          },
          {
            onSuccess: () => {
              refetch();
              setPendingMove(null);
            },
          },
        );
        break;
    }
  };

  if (isStagesLoading || isApplicationsLoading || !data)
    return <div className="p-6">Loading...</div>;

  const selectedVacancy = data.items.find((item) => item.id === vacancyId);

  return (
    <>
      <div className="mb-7">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-between">
              {selectedVacancy ? selectedVacancy.title : "Выберите вакансию"}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[280px]">
            {data.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onSelect={() => {
                  setVacancyId(item.id);
                  localStorage.setItem("vacancyId", item.id);
                  console.log("Selected ID:", item.id);
                }}
                className="cursor-pointer"
              >
                {item.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {vacancyId === "" ? (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center animate-in fade-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <InboxIcon className="h-10 w-10 text-slate-400" />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-slate-900">
            Нет доступных откликов
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            По выбранной вакансии пока нет ни одного отклика. Попробуйте выбрать
            другой ID в списке или обновите данные.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={({ active }) => setActiveId(String(active.id))}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="flex flex-col h-[calc(100vh-160px)] gap-4">
            <div className="shrink-0 bg-background/50 backdrop-blur pb-2">
              <HireColumn
                id="offer"
                vacancyId={vacancyId}
                items={
                  applications?.filter(
                    (app) => app.currentStageName === "Оффер",
                  ) ?? []
                }
              />
            </div>

            <div className="flex-1 min-h-0 flex gap-4 overflow-x-auto pb-4">
              {stages?.map((stage) => (
                <div key={stage.id} className="h-full min-w-[300px] w-full">
                  <Column
                    id={stage.id}
                    vacancyId={vacancyId}
                    title={stage.name}
                    items={
                      applications?.filter(
                        (app) => app.currentStageName === stage.name,
                      ) ?? []
                    }
                  />
                </div>
              ))}
            </div>

            <div className="shrink-0 bg-background/50 backdrop-blur pt-2">
              <RejectColumn
                id="reject"
                vacancyId={vacancyId}
                items={
                  applications?.filter(
                    (app) => app.currentStageName === "Отказ",
                  ) ?? []
                }
              />
            </div>
          </div>

          <DragOverlay>
            {activeApp ? (
              <div className="cursor-grabbing rounded-xl border bg-card text-card-foreground shadow-lg px-4 py-3 opacity-95">
                <div className="text-sm font-medium">
                  {activeApp.candidateFullName}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <UpdateStageDialog
        pendingMove={pendingMove}
        dialogData={{
          targetApp: applications?.find(
            (item) => item.id === pendingMove?.applicationId,
          )?.candidateFullName,
          targetStage: stages?.find(
            (stage) => stage.id === pendingMove?.targetStageId,
          )?.name,
        }}
        setPendingMove={setPendingMove}
        isUpdateStagePending={
          isUpdateStagePending || isRejectPending || isOfferPending
        }
        handleConfirmMove={handleConfirmMove}
      />
    </>
  );
}
