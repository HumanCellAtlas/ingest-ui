import {Type} from '@angular/core';

export interface MetadataFormLayout {
  tabs: Tab[];
}

interface Tab {
  title: string;
  key: string;
  items: (Item | string) [];
}

interface Item {
  key: string;
  items: Item[];
}

interface ItemGroup {
  keys: string[];
  component: Type<any>;
}
