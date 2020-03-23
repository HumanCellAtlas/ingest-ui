export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
  sort?: string;
}


export interface PagedData<T> {
  data: T[];
  page: Page;
}
