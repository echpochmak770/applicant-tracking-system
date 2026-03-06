export interface VacanciesParamsDto {
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | string;
  page: number;
  pageSize: number;
  status?: VacancyStatus
}

export type VacancyStatus = 'Draft' | 'Paused' | 'Open' | 'Closed';

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