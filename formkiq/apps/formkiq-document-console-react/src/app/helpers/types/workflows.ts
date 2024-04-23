import {Position} from 'reactflow';

export interface Step {
  id: string;
  name: WorkflowStepActionType | ''; // TODO: check later!
  type?: string;
  position?: { x: number; y: number };
  parameters?: WorkflowStepActionParameters;
  queue?: Queue;
}

export type WorkflowNodeProps = {
  label: WorkflowStepActionType | ''; // TODO: check later!
  parameters?: WorkflowStepActionParameters;
  sourceId?: string | null;
  sourceHandleId?: string | null;
  queue?: Queue;
};

export type NodeType = {
  id: string;
  position: { x: number; y: number };
  data: WorkflowNodeProps;
  type?: string;
  targetPosition?: Position;
};

type Queue = {
  queueId?: string;
  approvalGroups?: string[];
}

type WorkflowStatus = 'ACTIVE' | 'INACTIVE';
export type WorkflowStepActionType =
  | 'OCR'
  | 'FULLTEXT'
  | 'ANTIVIRUS'
  | 'WEBHOOK'
  | 'DOCUMENTTAGGING'
  | 'NOTIFICATION'
  | 'QUEUE';
export type DecisionType = 'APPROVE' | 'REJECT';
type OcrEngine = 'TESSERACT' | 'TEXTRACT';
type OcrParseTypes = 'TEXT' | 'FORMS' | 'TABLES';
type TaggingEngine = 'chatgpt';
type NotificationType = 'email';

export type WorkflowStepActionParameters = {
  ocrParseTypes?: OcrParseTypes;
  ocrEngine?: OcrEngine;
  addPdfDetectedCharactersAsText?: boolean;
  url?: string;
  characterMax?: string;
  engine?: TaggingEngine;
  notificationEmail?: string;
  notificationType?: NotificationType;
  notificationToCc?: string;
  notificationToBcc?: string;
  notificationSubject?: string;
  notificationText?: string;
  notificationHtml?: string;
  tags?: string;
};
export type WorkflowStep = {
  stepId: string;
  action?: {
    type: WorkflowStepActionType;
    parameters?: WorkflowStepActionParameters;
    queueId?: string;
  };
  queue?: Queue;
  decisions?: {
    type: DecisionType;
    nextStepId: string;
  }[];
};

export type Workflow = {
  name: string;
  description?: string;
  inUse?: boolean;
  status: WorkflowStatus;
  steps: WorkflowStep[];
};
type WorkflowSummary = {
  name?: string;
  workflowId?: string;
  description?: string;
  insertedDate?: string;
  userId?: string;
  inUse?: boolean;
  status?: WorkflowStatus;
};
export type Workflows = {
  next?: string;
  workflows?: WorkflowSummary[];
}[];

export type parametersDoubleInnerType = {
  description: string;
  options: Record<string, string>;
};
export type parametersInnerType = {
  title: string;
  textInputParameters: Record<string, {title: string, editDescription?: string, defaultValue?: string}>;
  selectParameters: Record<string, parametersDoubleInnerType>;
  checkboxParameters: Record<string, string>;
  decisions: DecisionType[];
  queue?: boolean;
  approvalGroups?: boolean;
};
