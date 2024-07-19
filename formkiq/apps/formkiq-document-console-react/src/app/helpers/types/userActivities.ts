export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

type 	UserActivityType = "VIEW";

export interface UserActivity {
  activityId: string,
  type: UserActivityType,
  insertedDate: string,
  userId: string,
  versionKey: string,
  timeToLive: string,
}
