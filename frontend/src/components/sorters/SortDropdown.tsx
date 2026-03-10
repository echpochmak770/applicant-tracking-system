import { ArrowUp, ArrowDown, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Props = {
  field: string
  currentSort?: "asc" | "desc" | undefined
  onSort: (field: string, direction?: "asc" | "desc") => void
}

export const SortDropdown = ({ field, currentSort, onSort }: Props) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted",
              currentSort && "text-primary"
            )}
          >
            {currentSort === "asc" && <ArrowUp className="h-4 w-4" />}
            {currentSort === "desc" && <ArrowDown className="h-4 w-4" />}
            {!currentSort && <ArrowUp className="h-4 w-4 opacity-50" />}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[170px]">
          <DropdownMenuItem onClick={() => onSort(field, "asc")}>
            <ArrowUp className="mr-2 h-4 w-4" />
            По возрастанию
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onSort(field, "desc")}>
            <ArrowDown className="mr-2 h-4 w-4" />
            По убыванию
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onSort(field, undefined)}>
            <X className="mr-2 h-4 w-4" />
            Сбросить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}