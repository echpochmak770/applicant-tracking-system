import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type Props = {
  value?: string
  onChange: (value?: string) => void
  placeholder?: string
}

export const TextSearchFilter = ({
  value,
  onChange,
  placeholder = "Поиск...",
}: Props) => {
  const [local, setLocal] = useState(value ?? "")

  useEffect(() => {
    setLocal(value ?? "")
  }, [value])

  const apply = () => {
    onChange(local.trim() || undefined)
  }

  const reset = () => {
    setLocal("")
    onChange(undefined)
  }

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

        <DropdownMenuContent align="end" className="w-[220px] p-3">
          <div className="flex flex-col gap-2">
            <input
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              placeholder={placeholder}
              className="border rounded-md px-2 py-1 text-sm"
            />

            <div className="flex justify-between">
              <button
                className="text-sm text-muted-foreground hover:underline"
                onClick={reset}
              >
                <X className="inline h-3 w-3 mr-1" />
                Сброс
              </button>

              <button
                className="text-sm text-primary font-medium"
                onClick={apply}
              >
                Применить
              </button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}