import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useState, useEffect } from "react";
import { type PendingMove } from "@/pages/stages/StagesBoardPage";
import { cn } from "@/lib/utils";

type UpdateStageDialogProps = {
  pendingMove: PendingMove | null;
  dialogData: {
    targetApp?: string;
    targetStage?: string;
  };
  setPendingMove: (arg: PendingMove | null) => void;
  isUpdateStagePending: boolean;
  handleConfirmMove: (comment: string) => void;
};

export default function UpdateStageDialog({
  pendingMove,
  dialogData,
  setPendingMove,
  isUpdateStagePending,
  handleConfirmMove,
}: UpdateStageDialogProps) {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!pendingMove) setComment("");
  }, [pendingMove]);

  const type = pendingMove?.type;

  const config = {
    update: {
      title: "Изменить стадию",
      description: (
        <span>
          Вы точно хотите перенести <b>{dialogData.targetApp}</b> на стадию{" "}
          <b>{dialogData.targetStage}</b>?
        </span>
      ),
      buttonClass: "bg-primary hover:bg-primary/90",
    },
    reject: {
      title: "Отказ",
      description: (
        <span>
          Вы точно хотите отклонить кандидатуру <b>{dialogData.targetApp}</b>?
        </span>
      ),
      buttonClass: "bg-destructive hover:bg-destructive-hover",
    },
    offer: {
      title: "Выставление оффера",
      description: (
        <span>
          Вы точно хотите перевести <b>{dialogData.targetApp}</b> на этап
          оффера?
        </span>
      ),
      buttonClass: "bg-success hover:bg-success/90 text-success-foreground",
    },
  };

  const currentConfig = type ? config[type] : config.update;

  const handleConfirm = () => {
    handleConfirmMove(comment);
  };

  return (
    <Dialog
      open={!!pendingMove}
      onOpenChange={(open) =>
        !open && !isUpdateStagePending && setPendingMove(null)
      }
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          <DialogDescription className="pt-2">
            {currentConfig.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Добавьте комментарий к этому решению..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setPendingMove(null)}
            disabled={isUpdateStagePending}
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUpdateStagePending}
            className={cn("min-w-[140px]", currentConfig.buttonClass)}
          >
            {isUpdateStagePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Подтвердить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
