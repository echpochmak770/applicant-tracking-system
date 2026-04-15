export type ColumnFilter = {
  field: string
  sort?: "asc" | "desc"
  filter?: string
  from?: string
  to?: string
}

export type FilterValue = string | { from?: string; to?: string } | undefined;

export type ApplicationFilters = {
  page: number;
  pageSize: number;
  columnFilters: ColumnFilter[];
}