import { type StageType } from "@/api/stage/model/types";
import { cn } from "@/lib/utils";

interface StageVisualizerProps {
  stages: StageType[];
  currentStage: string;
  isRejected?: boolean;
  isCompleted?: boolean;
}

export default function StageVisualizer({
  stages,
  currentStage,
  isRejected = false,
  isCompleted = false,
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
          const isPast = currentStageIdx > idx;

          let statusClass = "";

          // 1. Logic for COMPLETED (The override)
          if (isCompleted) {
            statusClass =
              "bg-success text-success-foreground border-success shadow-sm";
          }
          // 2. Logic for REJECTED
          else if (isCurrent && isRejected) {
            statusClass =
              "bg-destructive text-destructive-foreground border-destructive shadow-lg z-10";
          }
          // 3. Logic for CURRENT ACTIVE
          else if (isCurrent) {
            statusClass =
              "bg-primary text-primary-foreground border-primary shadow-lg z-10 scale-105";
          }
          // 4. Logic for PAST STAGES
          else if (isPast) {
            statusClass = "bg-success/20 text-success border-success/30";
          }
          // 5. Logic for FUTURE STAGES
          else {
            statusClass =
              "bg-background border-border text-muted-foreground opacity-50";
          }

          return (
            <div key={stage.id}>
              <div className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "relative flex flex-col items-center px-6 py-3 rounded-lg border transition-all duration-300",
                    statusClass,
                  )}
                >
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {stage.name}
                  </span>
                </div>

                {/* Connector Line */}
                {idx < stages.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-8 transition-colors duration-500 mx-1",
                      // Line is green if current stage is ahead of it or process is completed
                      isCompleted || currentStageIdx > idx
                        ? "bg-success/50"
                        : "bg-border",
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
