export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
  sort?: string;
}


export interface PagedData {
  data: object[];
  page: Page;
}
