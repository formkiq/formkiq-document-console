export interface TagSchema {
  tagSchemaId: string;
  name: string;
  userId: string;
  inUse:  boolean;
  insertedDate:  string;
  tags:TagSchemaTags;
}

export interface TagSchemaTags {
  compositeKeys: {key:string[]}[];
  required: {
    key: string;
    defaultValues: string[];
    allowedValues: string[];
  }[];
  optional: {
    key: string;
    defaultValues: string[];
    allowedValues: string[];
  }[];
  allowAdditionalTags: boolean;
}

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}
