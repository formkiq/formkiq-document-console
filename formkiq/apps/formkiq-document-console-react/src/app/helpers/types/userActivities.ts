export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

type UserActivityType = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE';

export interface UserActivity {
  activityId: string;
  type: UserActivityType;
  insertedDate: string;
  userId: string;
  versionKey: string;
  timeToLive: string;
  document?: {
    siteId?: string;
    path?: string;
    deepLinkPath?: string;
    insertedDate?: string;
    lastModifiedDate?: string;
    checksum?: string;
    checksumType?: 'SHA1' | 'SHA256';
    documentId?: string;
    contentType?: string;
    userId?: string;
    contentLength?: number;
    version?: string;
    versionKey?: string;
    s3version?: string;
    belongsToDocumentId?: string;
    metadata?: {
      key: string;
      value?: string;
      values?: string[];
    }[];
  };
}
