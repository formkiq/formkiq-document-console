export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export interface Group {
  name: string;
  description: string;
  insertedDate: string;
  lastModifiedDate: string;
}

export interface User {
  username: string,
  userStatus: string,
  insertedDate: string,
  lastModifiedDate: string,
}




