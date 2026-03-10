import type { ColumnFilter } from "@/api/types";

export type ApplicationItemDto = {
  id: string;
  candidateFullName: string;
  email: string;
  phone: string;
  currentStageName: string;
  creatorFullName: string;
  resumeFileUrl: string;
  resumeName: string;
  isDeleted: boolean;
};

export type ApplicationsResponse = {
  items: ApplicationItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export interface ApplicationsParamsDto {
  vacancyId: string
  search?: string
  page: number
  pageSize: number
  columnFilters?: ColumnFilter[]
}

export type ApplicationHistoryDto = {
  applicationId: string, 
  vacancyId: string,
}

export type ApplicationHistoryItemDto = {
  id: string;
  fromStageName: string;
  toStageName: string;
  order: number;
  changedAt: string;
  comment: string;
  changedByName: string;
};