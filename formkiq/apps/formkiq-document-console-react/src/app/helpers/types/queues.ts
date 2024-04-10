export interface Queue {
  queueId: string;
  name: string;
}

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}
