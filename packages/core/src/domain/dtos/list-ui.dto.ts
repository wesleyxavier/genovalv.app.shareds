export interface ListFilterOption {
  value: string;
  label: string;
}

export interface ListFilterConfig {
  id: string;
  label: string;
  value: string;
  options: readonly ListFilterOption[];
}

export interface PaginationSummary {
  currentPage: number;
  totalPages: number;
  start: number;
  end: number;
  totalItems: number;
}
