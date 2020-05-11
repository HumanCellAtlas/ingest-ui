export interface OlsHttpResponse {
  responseHeader: OlsResponseHeader;
  response: OlsResponse;
  highlighting: string[];
}

export interface OlsResponse {
  numFound: number;
  start: number;
  docs: OlsDoc[];
}

export interface OlsDoc {
  id: string;
  iri: string;
  short_form: string;
  obo_id: string;
  label: string;
  ontology_name: string;
  ontology_prefix: string;
  type: string;
}

interface OlsResponseHeader {
  status: number;
  QTime: number;
  params: OlsParams;
}

export interface OlsParams {
  hl: string;
  fl: string;
  start: string;
  fq: string[];
  rows: string;
  'hl.simple.pre': string;
  bq: string;
  q: string;
  defType: string;
  'hl.simple.post': string;
  qf: string;
  'hl.fl': string[];
  wt: string;
}
