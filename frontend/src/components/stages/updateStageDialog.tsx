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
import { useState } from "react";
import { type PendingMove } from "@/pages/stages/StagesBoardPage";
import { twMerge } from "tailwind-merge";

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
  const type = pendingMove?.type;

  const handleConfirm = () => {
    handleConfirmMove(comment);
    setComment("");
  };
  return (
    <Dialog
      open={!!pendingMove}
      onOpenChange={(open) =>
        !open && !isUpdateStagePending && setPendingMove(null)
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "UPDATE" ? "Изменить стадию" : "Отказ"}
          </DialogTitle>
          <DialogDescription>
            {type === "UPDATE" ? (
              <span>
                Вы точно хотите перенести <b>{dialogData.targetApp}</b> на
                стадию <b>{dialogData.targetStage}</b>?
              </span>
            ) : (
              <span>
                Вы точно хотите отклонить <b>{dialogData.targetApp}</b>?
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарии..."
        />
        <DialogFooter>
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
            className={twMerge(
              "min-w-[120px]",
              type === "REJECT" && "bg-destructive hover:bg-destructive-hover",
            )}
          >
            {isUpdateStagePending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Подтвердить"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
