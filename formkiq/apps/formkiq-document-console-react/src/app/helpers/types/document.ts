export interface IDocument {
  checksum: string;
  contentLength: number;
  contentType: string;
  documentId: string;
  insertedDate: string;
  lastModifiedDate: string;
  path: string;
  siteId: string;
  userId: string;
  tags: object[];
  filename: string;
}
export enum RequestStatus {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export const specialFolders = {
  favorites: {
    name: 'favorites',
    diaplayName: 'Favorites',
    key: 'sysFavoritedBy',
  },
  recent: {
    diaplayName: 'Recent files',
    key: '',
  },
  deleted: {
    name: 'deleted',
    diaplayName: 'Trash',
    key: 'sysDeletedBy',
  },
  shared: {
    name: 'shared',
    diaplayName: 'Shared with me',
    key: 'sysSharedWith',
  },
};
