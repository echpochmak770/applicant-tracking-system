export type ColumnFilter = {
  field: string
  sort?: "asc" | "desc"
  filter?: string
  from?: string
  to?: string
}