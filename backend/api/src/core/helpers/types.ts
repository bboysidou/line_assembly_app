export type SortOrderType = "asc" | "desc";

export interface QueryParams<T> {
  [key: string]: string | undefined;
  sortField?: keyof T & string;
  sortOrder?: SortOrderType;
}

export type ProductFilters<T> = {
  companyId?: string;
  search?: string;
  sortOrder?: SortOrderType;
  sortField?: keyof T;
  page?: string;
  pageSize?: string;
  categoryId?: string;
  trending?: string;
  minPrice?: string;
  maxPrice?: string;
  availableOnly?: string;
};
