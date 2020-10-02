import {Type} from '@angular/core';

export interface MetadataFormLayout {
  tabs: MetadataFormTab[];
}

export interface MetadataFormTab {
  title: string;
  key: string;
  items: (MetadataFieldGroup | string) [];
}

export interface MetadataFieldGroup {
  keys?: string[];
  component: Type<any>;
}
