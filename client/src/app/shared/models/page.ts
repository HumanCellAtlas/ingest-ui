export class Page {
  //The number of elements in the page
  size: number = 0;
  //The total number of elements
  totalElements: number = 0;
  //The total number of pages
  totalPages: number = 0;
  //The current page number
  page: number = 0;

}


export class PagedData {
  data: Object[];
  page: Page;
}
