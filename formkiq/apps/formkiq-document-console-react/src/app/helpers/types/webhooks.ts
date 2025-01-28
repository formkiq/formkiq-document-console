export type Webhook = {
  siteId: string;
  name	: string;
  url	: string;
  insertedDate	: string;
  webhookId	: string;
  userId	: string;
  enabled: string;
};

export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
};
