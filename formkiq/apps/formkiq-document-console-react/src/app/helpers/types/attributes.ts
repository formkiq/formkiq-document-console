export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export type AttributeDataType =
  | 'STRING'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'KEY_ONLY'
  | 'COMPOSITE_STRING'
  | 'WATERMARK';
export type AttributeType = 'STANDARD' | 'OPA';

export interface AdditionalFields {
  text?: string;
  imageDocumentId?: string;
}

interface BaseAttribute {
  type: AttributeType;
  key: string;
  dataType: AttributeDataType; // Allowing flexibility for multiple data types.
  [key: string]: AdditionalFields | AttributeType | AttributeDataType | string;
}

/**
 * Attribute type that covers all cases, ensuring the field name matches `dataType`.
 */
export type Attribute = BaseAttribute; // For attributes that do not have extra fields.

export type DocumentAttribute = {
  key: string;
  stringValue?: string;
  stringValues?: string[];
  numberValue?: number;
  numberValues?: number[];
  booleanValue?: boolean;
  insertedDate?: string;
  valueType?: string;
  userId?: string;
};

export type OpaAttributeType = {
  key: string;
  eq?: {
    input: {
      matchUsername: boolean;
    };
    stringValue?: string;
    numberValue?: number;
    booleanValue?: boolean;
  };
  gt?: {
    numberValue?: number;
  };
  gte?: {
    numberValue?: number;
  };
  lt?: {
    numberValue?: number;
  };
  lte?: {
    numberValue?: number;
  };
  neq?: {
    stringValue?: string;
  };
};

export type RelationshipType =
  | 'PRIMARY'
  | 'ATTACHMENT'
  | 'APPENDIX'
  | 'SUPPLEMENT'
  | 'ASSOCIATED'
  | 'RENDITION';
