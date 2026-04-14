import { MoreHorizontal, ListTree, PenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CustomCellRendererProps } from "ag-grid-react";
import { useNavigate } from "react-router";

export const VacancyActions = (params: CustomCellRendererProps) => {
  const navigate = useNavigate();
  const id = params.data?.id;

  return (
    <div className="flex items-center justify-between w-full group">
      <span className="truncate">{params.value}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              localStorage.setItem("vacancyId", id);
              navigate("/stages");
            }}
          >
            <ListTree className="mr-2 h-4 w-4" />
            <span>Стадии</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/vacancies/update/${id}`)}>
            <PenIcon className="mr-2 h-4 w-4" />
            <span>Редактировать</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
