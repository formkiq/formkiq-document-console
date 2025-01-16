type ApiKeyPermission = "READ" | "WRITE" | "DELETE" | "GOVERN";

export type ApiKey = {
  name: string,
  apiKey: string,
  userId: string,
  siteId: string,
  insertedDate: string,
  permissions: ApiKeyPermission[]
};

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}
