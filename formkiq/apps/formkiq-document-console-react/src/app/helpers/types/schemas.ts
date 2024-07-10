export interface Schema {
  name: string;
  attributes: SchemaAttributes;
}

export interface SchemaAttributes {
  compositeKeys?: { attributeKeys: string[] }[];
  required?: {
    attributeKey: string;
    defaultValue?: string;
    defaultValues?: string[];
    allowedValues?: string[];
  }[];
  optional?: {
    attributeKey: string;
    allowedValues?: string[];
  }[];
  allowAdditionalAttributes: boolean;
}

export interface Classification {
  name: string;
  userId: string;
  insertedDate: string;
}

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}
