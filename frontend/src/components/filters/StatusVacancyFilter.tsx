import { Filter, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { VacancyStatus } from "@/api/vacancies/model/types"

type Option = {
  label: string
  val?: string
}

type Props = {
  value?: string
  onChange: (value?: string) => void
  options?: Option[]
}

export const StatusVacancyFilter = ({ value, onChange, options }: Props) => {

  const defaultStatuses: Option[] = [
    { label: "Все", val: undefined },
    { label: "Open", val: "Open" },
    { label: "Draft", val: "Draft" },
    { label: "Paused", val: "Paused" },
    { label: "Closed", val: "Closed" },
  ]

  const statuses = options ?? defaultStatuses

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted",
              value && "text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[150px]">
          {statuses.map((s) => (
            <DropdownMenuItem
              key={s.val ?? "all"}
              className="flex justify-between"
              onClick={() => onChange(s.val)}
            >
              {s.label}

              {value === s.val && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}