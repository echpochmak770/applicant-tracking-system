import type { ColumnFilter } from "@/api/types";

export type VacancyStatus = "Draft" | "Paused" | "Open" | "Closed";

export type VacancyItemDto = {
  id: string;
  title: string;
  description: string;
  status: VacancyStatus;
  createdByName: string;
  createdAt: string;
};

export type VacanciesResponse = {
  items: VacancyItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CreateVacancyBody = {
  title: string;
  description: string;
  stagesNames: string[];
};

export interface VacanciesSearchRequest {
  search?: string;
  page: number;
  pageSize: number;
  columnFilters?: ColumnFilter[];
}

export interface VacanciesUpdatePayload {
  title: string;
  description: string;
  status: string;
}
