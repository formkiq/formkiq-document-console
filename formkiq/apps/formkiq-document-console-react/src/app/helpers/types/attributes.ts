export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export type AttributeDataType = "STRING"| "NUMBER"|"BOOLEAN"| "KEY_ONLY"| "COMPOSITE_STRING";
export type AttributeType = "STANDARD"|"OPA";

export type Attribute = {
  key: string;
  dataType: AttributeDataType;
  type: AttributeType;
  inUse?: boolean;
};

export type DocumentAttribute = {
  key: string;
  stringValue?: string,
  stringValues?:string[],
  numberValue?: number,
  numberValues?: number[],
  booleanValue?: boolean,
};
