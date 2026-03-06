import { applicationStages } from "@/pages/mock";

export default function StageVisualizer({ currentStage }: { currentStage: string }) {
  return (
      <div className="bg-card p-6 rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Маршрут кандидата</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Текущая стадия: {currentStage}</span>
        </div>
        <div className="flex items-center w-full overflow-x-auto pb-2 no-scrollbar">
          {applicationStages.map((stage, idx) => {
            const isCurrent = stage.name === currentStage;
            const isCompleted = applicationStages.findIndex(s => s.name === currentStage) > idx;

            return (
              <div key={stage.id} className="flex items-center flex-shrink-0">
                <div className={`
                  relative flex flex-col items-center px-6 py-3 rounded-lg border transition-all
                  ${isCurrent ? "bg-primary text-primary-foreground border-primary shadow-lg z-10 scale-105" : ""}
                  ${isCompleted ? "bg-muted/50 border-primary/30 text-muted-foreground" : "bg-background border-border text-muted-foreground"}
                `}>
                  <span className="text-sm font-semibold">{stage.name}</span>
                  {isCompleted && <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5 text-[10px]">✓</span>}
                </div>
                {idx < applicationStages.length - 1 && (
                  <div className={`h-[2px] w-8 ${isCompleted ? "bg-primary/50" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
  );
}