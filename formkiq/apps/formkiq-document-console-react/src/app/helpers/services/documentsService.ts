import { store } from '../../Store/store';
import FormkiqClient from '../../lib/formkiq-client-sdk-es6';
import {
  TagsForFilterAndDisplay,
  TagsForSharedFavoriteAndDeletedDocuments,
} from '../constants/primaryTags';
import { formkiqAPIHandler } from '../decorators/formkiqAPIHandler';

export interface IFileUploadData {
  originalFile: File;
  uploadedSize: number;
}

export type DocumentUploadInfoType = {
  url: string;
  documentId: string;
};

export type DocumentUploadedInfo = {
  documentId: string;
  insertedDate: string;
  path: string;
  siteId: string;
  userId: string;
  contentType: string;
  processingOcrWorkflow: boolean;
  submittedOcrWorkflow: boolean;
};
export type DocumentUploadBody = {
  tagSchemaId?: string;
  path?: any;
  contentLength?: any;
  tags?: any[];
  actions?: { type?: string; parameters?: any }[];
};

const eSignatureConfigParams = {
  developmentMode: true,
};
export class DocumentsService {
  public static getFormkiqClient = () => {
    let { formkiqClient } = store.getState().dataCacheState;
    if (!formkiqClient.apiClient) {
      const { user } = store.getState().authState;
      const { documentApi, userPoolId, clientId } =
        store.getState().configState;
      formkiqClient = new FormkiqClient(documentApi, userPoolId, clientId);
      formkiqClient.resetClient(documentApi, userPoolId, clientId);
      formkiqClient.rebuildCognitoClient(
        user?.email,
        user?.idToken,
        user?.accessToken,
        user?.refreshToken
      );
    }
    return formkiqClient;
  };

  public static determineSiteId = () => {
    const { user } = store.getState().authState;
    let siteId = '';
    if (user) {
      if (user.currentSiteId) {
        siteId = user.currentSiteId;
      } else if (user.defaultSiteId) {
        siteId = user.defaultSiteId;
      }
    }
    // TODO: add currentSiteId
    return siteId;
  };

  @formkiqAPIHandler
  public static getDocuments(): Promise<any> {
    return this.getFormkiqClient().documentsApi.getDocuments({
      siteId: this.determineSiteId(),
    });
  }

  @formkiqAPIHandler
  public static getDocumentById(id: string, siteId = ''): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocument({
      documentId: id,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static getDocumentsById(ids: string[], siteId = ''): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const res = [];
    for (const id of ids) {
      res.push(this.getDocumentById(id, siteId));
    }
    return Promise.all(res);
  }

  @formkiqAPIHandler
  public static deleteDocument(id: string, siteId = ''): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteDocument({
      documentId: id,
      siteId,
    });
  }

  public static uploadDocuments(
    folder: string,
    siteId = '',
    formkiqVersion: any,
    files: IFileUploadData[],
    onprogress: any
  ): Promise<any[]> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const resInfo = [];
    for (const file of files) {
      resInfo.push(
        this.uploadDocument(
          folder,
          siteId,
          formkiqVersion,
          file.originalFile
        ).then((res) => {
          return { ...res, file: file.originalFile };
        })
      );
    }
    return Promise.all(resInfo).then((info) => {
      const uploadResults: Promise<any>[] = [];
      for (const item of info) {
        uploadResults.push(
          this.getFormkiqClient()
            .apiClient.uploadFile(
              item.url,
              item.file,
              onprogress({ originalFile: item.file, uploadedSize: 0 })
            )
            .then((val: any) => {
              if (val.message) {
                val = { ...val, ...item };
              }
              return val;
            })
        );
      }
      return Promise.all(uploadResults);
    });
  }

  public static uploadNewDocumentVersions(
    documentId: string,
    siteId = '',
    files: IFileUploadData[],
    onprogress: any
  ): Promise<any[]> {
    // NOTE: there should be only one file
    // NOTE: there are no automatic actions on new version upload within this service, as only a GET is allowed
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const resInfo = [];
    for (const file of files) {
      resInfo.push(
        this.uploadNewDocumentVersion(
          documentId,
          siteId,
          file.originalFile
        ).then((res) => {
          return { ...res, file: file.originalFile };
        })
      );
    }
    return Promise.all(resInfo).then((info) => {
      const uploadResults: Promise<any>[] = [];
      for (const item of info) {
        uploadResults.push(
          this.getFormkiqClient()
            .apiClient.uploadFile(
              item.url,
              item.file,
              onprogress({ originalFile: item.file, uploadedSize: 0 })
            )
            .then((val: any) => {
              if (val.message) {
                val = { ...val, ...item };
              }
              return val;
            })
        );
      }
      return Promise.all(uploadResults);
    });
  }

  public static deleteDocumentVersion(
    documentId: string,
    versionKey: string
  ): Promise<any> {
    const apiClient = this.getFormkiqClient().apiClient;
    const url = `${apiClient.host}/documents/${documentId}/versions/${versionKey}`;
    const options = apiClient.buildOptions('DELETE');
    return apiClient.fetchAndRespond(url, options);
  }

  @formkiqAPIHandler
  public static async uploadDocument(
    folder: string,
    siteId = '',
    formkiqVersion: any,
    file: File
  ): Promise<DocumentUploadInfoType> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let path;
    if (folder.length) {
      path = folder + '/' + file.name;
    } else {
      path = file.name;
    }
    const contentLength = file.size;
    const actions = [] as any[];
    if (formkiqVersion.modules.indexOf('fulltext') > -1) {
      // NOTE: 'fulltext' has been replaced with 'opensearch' and 'typesense', but this should not trigger for now
      actions.push({ type: 'fulltext' });
    }
    const uploadBody: DocumentUploadBody = {
      path,
      actions,
    };
    return await this.getFormkiqClient().documentsApi.getSignedUrlForNewDocumentUploadWithBody(
      {
        uploadBody,
        siteId,
        contentLength,
      }
    );
  }

  @formkiqAPIHandler
  public static async uploadNewDocumentVersion(
    documentId: string,
    siteId = '',
    file: File
  ): Promise<DocumentUploadInfoType> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return await this.getFormkiqClient().documentsApi.getSignedUrlForDocumentReplacementUpload(
      {
        documentId,
        siteId,
        contentLength: file.size,
      }
    );
  }

  @formkiqAPIHandler
  public static compressDocuments(
    documentIds: string[],
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.postDocumentCompress({
      documentIds,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentsInFolder(
    folder: string,
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null,
    limit = 20,
    allTags = [] as any[]
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let folderValue;
    if (folder.length) {
      folderValue = folder + '/';
    } else {
      folderValue = '';
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    allTags.forEach((allTag: any) => {
      if (customIncludeTags.indexOf(allTag.value) === -1) {
        customIncludeTags.push(allTag.value);
      }
    });
    const searchBody = {
      query: {
        meta: {
          indexType: 'folder',
          eq: folderValue,
        },
      },
      responseFields: {
        tags: customIncludeTags,
      },
    };
    return this.getFormkiqClient().searchApi.search({
      searchParameters: searchBody,
      siteId,
      previous,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentsSharedWithMe(
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const { user } = store.getState().authState;
    let folderValue;
    if (user) {
      folderValue = user.email;
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    const searchBody = {
      query: {
        tag: {
          key: 'sysSharedWith',
          eq: (user as any).email,
        },
      },
      responseFields: {
        tags: customIncludeTags,
      },
    };
    return this.getFormkiqClient().searchApi.search({
      searchParameters: searchBody,
      siteId,
      previous,
      next,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentsFavoritedByMe(
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const { user } = store.getState().authState;
    let folderValue;
    if (user) {
      folderValue = user.email;
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    const searchBody = {
      query: {
        tag: {
          key: 'sysFavoritedBy',
          eq: folderValue,
        },
      },
      responseFields: {
        tags: customIncludeTags,
      },
    };
    return this.getFormkiqClient().searchApi.search({
      searchParameters: searchBody,
      siteId,
      previous,
      next,
    });
  }

  @formkiqAPIHandler
  public static async getDeletedDocuments(
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    const searchBody = {
      query: {
        tag: {
          key: 'sysDeletedBy',
        },
      },
      responseFields: {
        tags: customIncludeTags,
      },
    };
    return this.getFormkiqClient().searchApi.search({
      searchParameters: searchBody,
      siteId,
      previous,
      next,
    });
  }

  @formkiqAPIHandler
  public static async getAllDocuments(
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    const searchBody = {
      query: {
        meta: {
          indexType: 'folder',
          eq: '',
        },
      },
      responseFields: {
        tags: customIncludeTags,
      },
    };
    return this.getFormkiqClient().searchApi.search({
      searchParameters: searchBody,
      siteId,
      previous,
      next,
    });
    // TODO: add tag handling (use search endpoint instead?)
    //return this.getFormkiqClient().documentsApi.getDocuments()
  }

  @formkiqAPIHandler
  public static async renameDocument(
    documentId: string,
    currentDocumentPath: string,
    newDocumentName: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let newDocumentPath = newDocumentName;
    if (currentDocumentPath.lastIndexOf('/') > -1) {
      newDocumentPath =
        currentDocumentPath.substring(
          0,
          currentDocumentPath.lastIndexOf('/') + 1
        ) + newDocumentPath;
    }
    const documentParams = {
      path: newDocumentPath,
    };
    return this.getFormkiqClient().documentsApi.updateDocument({
      documentId,
      addOrUpdateDocumentParameters: documentParams,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async setDocumentFolder(
    folder: string,
    path: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    if (folder.length > -1) {
      folder = folder + '/';
    }
    return this.getFormkiqClient().documentsApi.moveDocument({
      source: path,
      target: folder,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async createFolder(
    folder: string,
    newFolderName: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let path = '';
    if (folder.length) {
      path = folder;
    }
    path += '/' + newFolderName + '/';
    return this.getFormkiqClient().documentsApi.createFolder({ path, siteId });
  }

  @formkiqAPIHandler
  public static async deleteFolder(
    indexKey: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    indexKey = indexKey.replace('#', '%23');
    return this.getFormkiqClient().documentsApi.deleteFolder({
      indexKey,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async searchDocuments(
    siteId = '',
    formkiqVersion: any,
    tag: string | null = null,
    searchText: string,
    page = 1,
    allTags = [] as any[]
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    allTags.forEach((allTag: any) => {
      if (customIncludeTags.indexOf(allTag.value) === -1) {
        customIncludeTags.push(allTag.value);
      }
    });
    if (
      formkiqVersion.modules.indexOf('opensearch') === -1 &&
      formkiqVersion.modules.indexOf('typesense') === -1
    ) {
      const searchBody = {
        query: {
          text: searchText + '*',
        },
        responseFields: {
          tags: customIncludeTags,
        },
      };
      return this.getFormkiqClient().searchApi.search({
        searchParameters: searchBody,
        siteId,
      });
    } else {
      const searchBody = {
        query: {
          text: searchText + '*',
          page: page,
        },
        responseFields: {
          tags: customIncludeTags,
        },
      };
      return this.getFormkiqClient().searchApi.searchFulltext({
        documentFulltextSearchBody: searchBody,
        siteId,
      });
    }
  }

  @formkiqAPIHandler
  public static async searchDocumentsInFolder(
    siteId = '',
    tag: string | null = null,
    searchText: string,
    folder: string,
    page: number
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const customIncludeTags = TagsForSharedFavoriteAndDeletedDocuments;
    (TagsForFilterAndDisplay as string[]).forEach((primaryTag: string) => {
      if (customIncludeTags.indexOf(primaryTag) === -1) {
        customIncludeTags.push(primaryTag);
      }
    });
    if (tag) {
      if (customIncludeTags.indexOf(tag) === -1) {
        customIncludeTags.push(tag);
      }
    }
    const searchBody = {
      query: {
        text: searchText + '*',
        meta: {
          indexType: 'folder',
          eq: folder,
        },
        page: page,
        responseFields: {
          tags: customIncludeTags,
        },
      },
    };
    return this.getFormkiqClient().searchApi.searchFulltext({
      documentFulltextSearchBody: searchBody,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateDocumentTag(
    documentId: string,
    tagKey: string,
    newValue: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let body = {};
    if (newValue.includes(',')) {
      body = {
        values: newValue.split(','),
      };
    } else {
      body = {
        value: newValue,
      };
    }
    return this.getFormkiqClient().documentsApi.updateDocumentTag({
      documentId,
      tagKey,
      tagValues: body,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async addValueToTag(
    documentId: string,
    siteId = '',
    tagKey: string,
    oldValue: string | [],
    valueToAdd: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let body = {};
    if (typeof oldValue === 'string' || oldValue instanceof String) {
      body = {
        values: [oldValue, valueToAdd],
      };
    } else {
      body = {
        values: [...oldValue, valueToAdd],
      };
    }

    return this.getFormkiqClient().documentsApi.updateDocumentTag({
      documentId,
      tagKey,
      tagValues: body,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async deleteTagOrValueFromTag(
    documentId: string,
    siteId = '',
    tagKey: string,
    oldValue: string | string[],
    valueToDelete: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let body = {};
    if (typeof oldValue === 'string' || oldValue instanceof String) {
      if (oldValue === valueToDelete) {
        return this.deleteDocumentTag(documentId, siteId, tagKey);
      } else {
        return new Promise(() => 'values did not match');
      }
    } else {
      const indexOfEl: number = oldValue.indexOf(valueToDelete);
      if (indexOfEl > -1) {
        const newValues = [...oldValue];
        newValues.splice(indexOfEl, 1);
        if (newValues.length > 1) {
          body = {
            values: newValues,
          };
        } else {
          body = {
            value: newValues[0],
          };
        }
      } else {
        return new Promise(() => 'value did not found');
      }
    }

    return this.getFormkiqClient().documentsApi.updateDocumentTag({
      documentId,
      tagKey,
      tagValues: body,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async addValueOrCreateTag(
    documentId: string,
    siteId = '',
    tagKey: string,
    oldValue: string | [] | null,
    valueToAdd: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    if (oldValue) {
      // if tag was added
      return this.addValueToTag(
        documentId,
        siteId,
        tagKey,
        oldValue,
        valueToAdd
      );
    } else {
      return this.addTag(documentId, siteId, {
        key: tagKey,
        value: valueToAdd,
      });
    }
  }

  @formkiqAPIHandler
  public static async deleteDocumentTag(
    documentId: string,
    siteId = '',
    tagKey: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteDocumentTag({
      documentId,
      tagKey,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentTags(
    documentId: string,
    siteId = '',
    limit = 25
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentTags({
      documentId,
      siteId,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentAccessAttributes(
    siteId: string,
    documentId: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentAccessAttributes({
      siteId,
      documentId,
    });
  }

  // TODO: add other access attribute functions

  @formkiqAPIHandler
  public static async getDocumentVersions(
    documentId: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentVersions({
      documentId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async putDocumentVersion(
    documentId: string,
    versionKey: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.putDocumentVersion({
      documentId,
      versionKey,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentActions(
    documentId: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentActions({
      documentId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async postDocumentActions(
    documentId: string,
    actions: any,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.postDocumentActions({
      documentId,
      actions,
      siteId,
    });
  }

  // TODO: replace this PATCH with actions-specific PUT, once available
  @formkiqAPIHandler
  public static async putDocumentActions(
    documentId: string,
    actions: any,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const documentParams = {
      actions,
    };
    return this.getFormkiqClient().documentsApi.updateDocument({
      documentId,
      addOrUpdateDocumentParameters: documentParams,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentUrl(
    documentId: string,
    siteId = '',
    versionKey = '',
    inline = true
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentUrl({
      documentId,
      versionKey,
      inline,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async editDocumentWithOnlyoffice(
    documentId: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.editDocumentWithOnlyoffice({
      documentId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async createDocumentWithOnlyoffice(
    extension: string,
    path: string,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.createDocumentWithOnlyoffice({
      extension,
      path,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async addTag(
    documentId: string,
    siteId = '',
    data: { key: string; value: string }
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    if (!data.key) {
      return {
        message: 'Tag key must be specified.',
      };
    }
    let body;
    if (data.value !== undefined && data.value.length === 0) {
      body = {
        key: data.key,
      };
    } else if (data.value !== undefined && data.value.indexOf(',') > -1) {
      body = {
        key: data.key,
        values: data.value.split(','),
      };
    } else {
      body = {
        key: data.key,
        value: data.value,
      };
    }
    return this.getFormkiqClient().documentsApi.addDocumentTag({
      documentId,
      addDocumentTagParameters: body,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getAllTagKeys(siteId = ''): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    // TODO: allow paging
    return this.getFormkiqClient().searchApi.searchIndices({
      indexType: 'tags',
      siteId,
      limit: 100,
    });
  }

  @formkiqAPIHandler
  public static async getAllFolders(siteId = ''): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    // TODO: allow paging
    return this.getFormkiqClient().searchApi.searchIndices({
      indexType: 'folders',
      siteId,
      limit: 100,
    });
  }

  @formkiqAPIHandler
  public static async getConfiguration(siteId: string): Promise<any> {
    return this.getFormkiqClient().configurationApi.getConfiguration({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateConfiguration(
    configuration: any,
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().configurationApi.updateConfiguration({
      updateConfigurationParameters: configuration,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getOpenPolicyAgentConfiguration(
    siteId: string
  ): Promise<any> {
    console.log(siteId, 'getOpenPolicyAgent');
    return this.getFormkiqClient().configurationApi.getOpenPolicyAgentConfiguration(
      {
        siteId,
      }
    );
  }

  @formkiqAPIHandler
  public static async getOpenPolicyAgentConfigurations(
    siteId: string
  ): Promise<any> {
    console.log(siteId, 'getOpenPolicyAgent');
    return this.getFormkiqClient().configurationApi.getOpenPolicyAgentConfigurations(
      { siteId }
    );
  }

  @formkiqAPIHandler
  public static async deleteOpenPolicyAgent(siteId: string): Promise<any> {
    return this.getFormkiqClient().configurationApi.deleteOpenPolicyAgent({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async configureOpenPolicyAgent(
    updateConfigurationParameters: string,
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().configurationApi.configureOpenPolicyAgent({
      updateConfigurationParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getSites(): Promise<any> {
    return this.getFormkiqClient().sitesApi.getSites();
  }

  @formkiqAPIHandler
  public static async getVersion(): Promise<any> {
    return this.getFormkiqClient().versionApi.getVersion();
  }

  @formkiqAPIHandler
  public static async getApiKeys(siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().configurationApi.getApiKeys({ siteId });
  }

  @formkiqAPIHandler
  public static addApiKey(
    name: string,
    permissions: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().configurationApi.addApiKey({
      addApiKeyParameters: { name, permissions },
      siteId,
    });
  }

  @formkiqAPIHandler
  public static deleteApiKey(apiKey: string, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().configurationApi.deleteApiKey({
      apiKey,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getWebhooks(siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().webhooksApi.getWebhooks({ siteId });
  }

  @formkiqAPIHandler
  public static addWebhook(name: string, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().webhooksApi.addWebhook({
      addWebhookParameters: { name },
      siteId,
    });
  }

  @formkiqAPIHandler
  public static deleteWebhook(webhookId: string, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().webhooksApi.deleteWebhook({
      webhookId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getWorkflows(
    siteId: string,
    status = null,
    previous = null,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getWorkflows({
      siteId,
      status,
      previous,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async getWorkflow(
    workflowId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getWorkflow({
      workflowId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static addWorkflow(workflow: any, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.addWorkflow({
      addWorkflowParameters: workflow,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static putWorkflow(
    workflowId: string,
    addWorkflowParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }

    return this.getFormkiqClient().workflowsApi.putWorkflow({
      workflowId,
      addWorkflowParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static deleteWorkflow(
    workflowId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.deleteWorkflow({
      workflowId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getQueues(
    siteId: string,
    previous = null,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getQueues({
      siteId,
      previous,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async addQueue(name: string, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.addQueue({
      addQueueParameters: { name },
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async deleteQueue(
    queueId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.deleteQueue({
      queueId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentsInQueue(
    queueId: string,
    siteId: string,
    previous = null,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getDocumentsInQueue({
      queueId,
      siteId,
      limit,
      next,
      previous,
    });
  }

  @formkiqAPIHandler
  public static async getESignatureConfig(siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getESignatureConfig({ siteId });
  }

  @formkiqAPIHandler
  public static async setESignatureConfig(
    siteId: string,
    clientId: string,
    userId: string,
    privateKey: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.setESignatureConfig({
      siteId,
      privateKey,
      userId,
      clientId,
    });
  }

  @formkiqAPIHandler
  public static async sendForDocusignESignature(
    documentId: string,
    siteId: string,
    emailSubject: string,
    status: string,
    signers: [],
    carbonCopies: []
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.sendForDocusignESignature({
      documentId,
      siteId,
      emailSubject,
      status,
      developmentMode: eSignatureConfigParams.developmentMode,
      signers,
      carbonCopies,
    });
  }

  @formkiqAPIHandler
  public static async getRulesets(
    siteId: string,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.getRulesets({
      siteId,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async getRuleset(
    rulesetId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.getRuleset({
      rulesetId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async addRuleset(
    addRulesetParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.addRuleset({
      addRulesetParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateRuleset(
    rulesetId: string,
    addRulesetParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.patchRuleset({
      rulesetId,
      addRulesetParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async deleteRuleset(
    rulesetId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.deleteRuleset({
      rulesetId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getRules(
    rulesetId: string,
    siteId: string,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.getRules({
      rulesetId,
      siteId,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async addRule(
    rulesetId: string,
    addRuleParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.addRule({
      rulesetId,
      addRuleParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getRule(
    rulesetId: string,
    ruleId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.getRule({
      rulesetId,
      ruleId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateRule(
    rulesetId: string,
    ruleId: string,
    addRuleParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.patchRule({
      rulesetId,
      ruleId,
      addRuleParameters,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async deleteRule(
    rulesetId: string,
    ruleId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().rulesetsApi.deleteRule({
      rulesetId,
      ruleId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getExaminePdfUploadUrl(
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getExaminePdfUploadUrl({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getExaminePdfDetails(
    siteId: string,
    objectId: string
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getExaminePdfDetails({
      siteId,
      objectId,
    });
  }

  @formkiqAPIHandler
  public static async getTagSchemas(
    siteId: string,
    next = null,
    limit = 20
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().tagSchemasApi.getTagSchemas({
      siteId,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async getTagSchema(
    tagSchemaId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().tagSchemasApi.getTagSchema({
      tagSchemaId,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async addTagSchema(
    addTagSchemaParameters: any,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().tagSchemasApi.addTagSchema({
      addTagSchemaParameters,
      siteId,
    });
  }

  // @formkiqAPIHandler
  // public static async updateTagSchema(
  //   tagSchemaId: string,
  //   addTagSchemaParameters: any,
  //   siteId: string
  // ): Promise<any> {
  //   if (!siteId) {
  //     siteId = this.determineSiteId();
  //   }
  //   return this.getFormkiqClient().tagSchemasApi.patchTagSchema({
  //     tagSchemaId,
  //     addTagSchemaParameters,
  //     siteId,
  //   });
  // }

  @formkiqAPIHandler
  public static async deleteTagSchema(
    tagSchemaId: string,
    siteId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().tagSchemasApi.deleteTagSchema({
      tagSchemaId,
      siteId,
    });
  }
}
