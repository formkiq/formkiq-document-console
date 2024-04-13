export interface Queue {
  queueId: string;
  name: string;
}

export interface Group {
  name: string;
  description: string;
  insertedDate: string;
  lastModifiedDate: string;
}

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}
