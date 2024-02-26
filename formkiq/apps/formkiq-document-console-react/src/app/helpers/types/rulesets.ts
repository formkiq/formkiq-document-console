export type RulesetStatus = 'ACTIVE' | 'INACTIVE';

export interface Ruleset {
  rulesetId: string;
  description: string;
  priority: number;
  version: number;
  insertedDate: string;
  status: RulesetStatus;
}

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

type RuleConditionAttribute = 'TEXT' | 'CONTENT_TYPE' | 'BARCODE' | 'FIELD';
type RuleConditionOperation = 'EQ' | 'CONTAINS';

export interface Rule {
  ruleId: string;
  priority: number;
  description: string;
  workflowId: string;
  status: RulesetStatus;
  conditions: {
    must: [
      {
        attribute: RuleConditionAttribute;
        fieldName: string;
        value: string;
        operation: RuleConditionOperation;
      }
    ];
  };
}
