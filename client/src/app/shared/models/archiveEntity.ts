export interface ArchiveEntity {
  created: string;
  type: string;
  alias: string;
  dspUuid: string;
  dspUrl: string;
  accession: string;
  conversion: object;
  metadataUuids: string[];
  accessionedMetadataUuids: string[];
  errors: any[];
  _links: object;
}
