export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export type MappingAttributeSourceType = 'CONTENT' | 'CONTENT_KEY_VALUE' | 'METADATA';
export type MappingAttributeLabelMatchingType =
  | 'FUZZY'
  | 'EXACT'
  | 'BEGINS_WITH'
  | 'CONTAINS';
export type MappingAttributeMetadataField = 'USERNAME' | 'PATH' | 'CONTENT_TYPE';

export interface MappingAttribute {
  attributeKey: string;
  sourceType: MappingAttributeSourceType;
  defaultValue?: string;
  defaultValues?: string[];
  labelTexts: string[];
  labelMatchingType: MappingAttributeLabelMatchingType;
  metadataField?: MappingAttributeMetadataField;
  validationRegex?: string;
}

export interface Mapping {
  mappingId?: string;
  name: string;
  description: string;
  attributes: MappingAttribute[];
}
