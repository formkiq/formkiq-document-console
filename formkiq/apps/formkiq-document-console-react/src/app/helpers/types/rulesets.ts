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

type RuleConditionCriterion =
  | 'TEXT'
  | 'CONTENT_TYPE'
  | 'BARCODE'
  | 'FIELD'
  | 'ATTRIBUTE';
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
        criterion: RuleConditionCriterion;
        fieldName?: string;
        attributeKey?: string;
        value: string;
        operation: RuleConditionOperation;
      }
    ];
  };
}
