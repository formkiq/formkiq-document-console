export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export type LocaleResourceItemType = 'INTERFACE' | 'SCHEMA' | 'CLASSIFICATION';

export interface LocaleResourceItem {
  itemKey: string;
  itemType: LocaleResourceItemType;
  localizedValue: string;
  interfaceKey?: string;
  classificationId?: string;
  attributeKey?: string;
  allowedValue?: string;
}

export interface Locale {
  locale: string;
  resourceItems: LocaleResourceItem[];
}
