import { type StageType } from "@/api/stage/model/types";

interface StageVisualizerProps {
  stages: StageType[];
  currentStage: string;
  isRejected?: boolean;
}

export default function StageVisualizer({
  stages,
  currentStage,
  isRejected = false,
}: StageVisualizerProps) {
  const currentStageIdx = stages.findIndex((s) => s.name === currentStage);

  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Маршрут кандидата
        </span>
      </div>

      <div className="flex items-center w-full overflow-x-auto pb-4 no-scrollbar">
        {stages.map((stage, idx) => {
          const isCurrent = stage.name === currentStage;
          const isCompleted = currentStageIdx > idx;

          let statusClass = "";

          if (isCurrent) {
            statusClass = isRejected
              ? "bg-destructive text-destructive-foreground border-destructive shadow-lg z-10"
              : "bg-primary text-primary-foreground border-primary shadow-lg z-10";
          } else if (isCompleted) {
            statusClass = "bg-green-600 text-white border-green-600";
          } else {
            statusClass =
              "bg-background border-border text-muted-foreground opacity-60";
          }

          return (
            <div key={stage.id} className="flex items-center flex-shrink-0">
              <div
                className={`
                  relative flex flex-col items-center px-6 py-3 rounded-lg border transition-all duration-300
                  ${statusClass}
                `}
              >
                <span className="text-sm font-semibold whitespace-nowrap">
                  {stage.name}
                </span>
              </div>

              {idx < stages.length - 1 && (
                <div className="h-[1px] w-8 transition-colors duration-300 bg-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
