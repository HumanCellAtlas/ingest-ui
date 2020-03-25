export interface MetadataSchema {
  highLevelEntity: string;
  schemaVersion: string;
  domainEntity: string;
  subDomainEntity: string;
  concreteEntity: string;
  compoundKeys: string;
  _links: Links;
}

interface Links {
  self: Self;
  schema: Self;
  'json-schema': Self;
}

interface Self {
  href: string;
}

interface Uuid {
  uuid: string;
}
