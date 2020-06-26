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
