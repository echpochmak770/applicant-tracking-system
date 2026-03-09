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
  vacancyId: string;
  search?: string;
  sortBy?: keyof ApplicationItemDto;
  sortDirection?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}