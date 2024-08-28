import { store } from '../../Store/store';
import FormkiqClient from '../../lib/formkiq-client-sdk-es6';
import {
  TagsForFilterAndDisplay,
  TagsForSharedFavoriteAndDeletedDocuments,
} from '../constants/primaryTags';
import { formkiqAPIHandler } from '../decorators/formkiqAPIHandler';
import { Attribute } from '../types/attributes';

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
  public static deleteDocument(id: string, siteId = '', softDelete: null|string = null): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteDocument({
      documentId: id,
      siteId,
      softDelete,
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
    siteId: string,
    documentId: string,
    versionKey: string
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.deleteDocumentVersion({
      siteId,
      documentId,
      versionKey,
    });
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
    allTags = [] as any[],
    attribute: string | null = null,
    allAttributes = [] as any[]
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
    // NOTE: only KEY_ONLY attributes are required on list view (i.e., "tags")
    const attributesKeys = allAttributes
      .filter((attribute: Attribute) => attribute.dataType === 'KEY_ONLY')
      .map((attribute: Attribute) => attribute.key);
    if (attribute) {
      const searchBody = {
        query: {
          attribute: {
            key: attribute,
          },
        },
        responseFields: {
          tags: customIncludeTags,
          attributes: attributesKeys,
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
    const searchBody = {
      query: {
        meta: {
          indexType: 'folder',
          eq: folderValue,
        },
      },
      responseFields: {
        tags: customIncludeTags,
        attributes: attributesKeys,
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
    next = null,
    attribute: string | null = null,
    allAttributes = [] as any[]
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
    const attributesKeys = allAttributes.map((attribute: any) => attribute.key);
    const searchBody = {
      query: {
        tag: {
          key: 'sysSharedWith',
          eq: (user as any).email,
        },
        attribute: attribute ? { key: attribute } : null,
      },
      responseFields: {
        tags: customIncludeTags,
        attributes: attributesKeys,
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
    next = null,
    attribute: string | null = null,
    allAttributes = [] as any[]
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
    const attributesKeys = allAttributes.map((attribute: any) => attribute.key);
    const searchBody = {
      query: {
        tag: {
          key: 'sysFavoritedBy',
          eq: folderValue,
        },
        attribute: attribute ? { key: attribute } : null,
      },
      responseFields: {
        tags: customIncludeTags,
        attributes: attributesKeys,
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
    previous = null,
    next = null,
    deleted: string | null = null
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }

    return this.getFormkiqClient().documentsApi.getDocuments({
      siteId,
      previous,
      next,
      deleted,
    });
  }

  @formkiqAPIHandler
  public static async getAllDocuments(
    siteId = '',
    tag: string | null = null,
    previous = null,
    next = null,
    attribute: string | null = null,
    allAttributes = [] as any[]
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
    const attributesKeys = allAttributes.map((attribute: any) => attribute.key);
    if (attribute) {
      const searchBody = {
        query: {
          attribute: {
            key: attribute,
          },
        },
        responseFields: {
          tags: customIncludeTags,
          attributes: attributesKeys,
        },
      };
      return this.getFormkiqClient().searchApi.search({
        searchParameters: searchBody,
        siteId,
        previous,
        next,
      });
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
        attributes: attributesKeys,
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
    allTags = [] as any[],
    allAttributes = [] as any[],
    searchAttributes: any = null,
    limit=20
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
    const attributesKeys = allAttributes.map((attribute: any) => attribute.key);
    if (formkiqVersion.modules.indexOf('opensearch') === -1) {
      const searchBody:any = {
        query: {},
        responseFields: {
          tags: customIncludeTags,
          attributes: attributesKeys,
        },
      };
      if (searchText&&searchText!=='') {
        searchBody.query["text"] = searchText + '*';
      }
      if (searchAttributes) {
        searchBody.query["attributes"] = searchAttributes;
      }
      return this.getFormkiqClient().searchApi.search({
        searchParameters: searchBody,
        siteId,
        limit
      });
    } else {
      const searchBody:any = {
        query: {
          page: page,
        },
        responseFields: {
          tags: customIncludeTags,
          attributes:  attributesKeys,
        },
      };
      if (searchText&&searchText!=='') {
        searchBody.query["text"] = searchText + '*';
      }
      if (searchAttributes) {
        searchBody.query["attributes"] = searchAttributes;
      }
      return this.getFormkiqClient().searchApi.searchFulltext({
        documentFulltextSearchBody: searchBody,
        siteId,
        limit
      });
    }
  }

  @formkiqAPIHandler
  public static async searchDocumentsInFolder(
    siteId = '',
    tag: string | null = null,
    searchText: string,
    folder: string,
    page: number,
    allAttributes = [] as any[],
    searchAttributes: any = null
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
    const attributesKeys = allAttributes.map((attribute: any) => attribute.key);
    const searchBody:any = {
      query: {
        text: searchText + '*',
        meta: {
          indexType: 'folder',
          eq: folder,
        },
        page: page,
        responseFields: {
          tags: customIncludeTags,
          attributes: attributesKeys,
        },
      },
    };
    if (searchAttributes) {
      searchBody.query["attributes"] = searchAttributes;
    }
    return this.getFormkiqClient().searchApi.searchFulltext({
      documentFulltextSearchBody: searchBody,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateDocumentTag(
    documentId: string,
    tagKey: string,
    newValue: string | string[],
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    let body = {};
    if ( typeof newValue === 'string'){
      body = {
        value: newValue,
      };
    } else {
      body = {
        values: newValue,
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
  public static async retryDocumentActions(
    siteId = '',
    documentId: string
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.retryDocumentActions({
      siteId,
      documentId,
    });
  }

  @formkiqAPIHandler
  public static async patchDocumentDetails(
    documentId: string,
    details: any,
    siteId = ''
  ): Promise<any> {
    if (!siteId || !siteId.length) {
      siteId = this.determineSiteId();
    }
    const documentParams = {
      ...details,
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
    return this.getFormkiqClient().sitesApi.getConfiguration({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async updateConfiguration(
    configuration: any,
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().sitesApi.updateConfiguration({
      updateConfigurationParameters: configuration,
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getOpenPolicyAgentPolicies(): Promise<any> {
    return this.getFormkiqClient().sitesApi.getOpenPolicyAgentPolicies();
  }

  @formkiqAPIHandler
  public static async getOpenPolicyAgentPolicy(siteId: string): Promise<any> {
    return this.getFormkiqClient().sitesApi.getOpenPolicyAgentPolicies({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async getOpenPolicyAgentPolicyItems(
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().sitesApi.getOpenPolicyAgentPolicyItems({
      siteId,
    });
  }

  @formkiqAPIHandler
  public static async setOpenPolicyAgentPolicyItems(
    siteId: string,
    updateConfigurationParameters: any
  ): Promise<any> {
    return this.getFormkiqClient().sitesApi.setOpenPolicyAgentPolicyItems({
      siteId,
      updateConfigurationParameters,
    });
  }

  @formkiqAPIHandler
  public static async deleteOpenPolicyAgentPolicyItems(
    siteId: string
  ): Promise<any> {
    return this.getFormkiqClient().sitesApi.deleteOpenPolicyAgentPolicyItems({
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
    return this.getFormkiqClient().sitesApi.getApiKeys({ siteId });
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
    return this.getFormkiqClient().sitesApi.addApiKey({
      addApiKeyParameters: { name, permissions },
      siteId,
    });
  }

  @formkiqAPIHandler
  public static deleteApiKey(apiKey: string, siteId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().sitesApi.deleteApiKey({
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
  public static async getDocumentsInWorkflow(
    siteId: string,
    workflowId: string,
    limit = 20,
    next = null
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getDocumentsInWorkflow({
      siteId,
      workflowId,
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async getWorkflowsInDocument(
    siteId: string,
    documentId: string,
    limit = 20,
    next = null
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getWorkflowsInDocument({
      siteId,
      documentId,
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async addWorkflowToDocument(
    siteId: string,
    documentId: string,
    workflowId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.addWorkflowToDocument({
      siteId,
      documentId,
      workflowId,
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
  public static async getQueue(siteId: string, queueId: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().workflowsApi.getQueue({
      siteId,
      queueId,
    });
  }

  @formkiqAPIHandler
  public static async getGroups(
    next = null,
    limit = 20
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.getGroups({
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
  public static async getExaminePdfUploadUrl(siteId: string): Promise<any> {
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
  public static async addDecisionToDocumentWorkflow(
    siteId: string,
    documentId: string,
    workflowId: string,
    addDecisionParameters: any
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.addDecisionToDocumentWorkflow({
      siteId,
      documentId,
      workflowId,
      addDecisionParameters,
    });
  }

  @formkiqAPIHandler
  public static async getAttributes(
    siteId: string,
    next = null,
    limit = 100
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getAttributes({
      siteId,
      next,
      limit,
    });
  }

  @formkiqAPIHandler
  public static async addAttribute(
    siteId: string,
    addAttributeParameters: any
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.addAttribute({
      siteId,
      addAttributeParameters,
    });
  }

  @formkiqAPIHandler
  public static async getAttribute(siteId: string, key: string): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getAttribute({
      siteId,
      key,
    });
  }

  @formkiqAPIHandler
  public static async deleteAttribute(
    siteId: string,
    key: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteAttribute({
      siteId,
      key,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentAttributes(
    siteId: string,
    next = null,
    limit = 20,
    documentId: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentAttributes({
      siteId,
      limit,
      documentId,
      next,
    });
  }

  @formkiqAPIHandler
  public static async addDocumentAttributes(
    siteId: string,
    ws: string,
    documentId: string,
    addDocumentAttributesParameters: any
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.addDocumentAttributes({
      siteId,
      ws,
      documentId,
      addDocumentAttributesParameters,
    });
  }

  @formkiqAPIHandler
  public static async setDocumentAttributes(
    siteId: string,
    documentId: string,
    setDocumentAttributesParameters: any
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.setDocumentAttributes({
      siteId,
      documentId,
      setDocumentAttributesParameters,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentAttribute(
    siteId: string,
    documentId: string,
    attributeKey: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.getDocumentAttribute({
      siteId,
      documentId,
      attributeKey,
    });
  }

  @formkiqAPIHandler
  public static async setDocumentAttributeValue(
    siteId: string,
    documentId: string,
    attributeKey: string,
    setDocumentsAttributeValueParameters: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.setDocumentAttributeValue({
      siteId,
      documentId,
      attributeKey,
      setDocumentsAttributeValueParameters,
    });
  }

  @formkiqAPIHandler
  public static async deleteDocumentAttribute(
    siteId: string,
    documentId: string,
    attributeKey: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteDocumentAttribute({
      siteId,
      documentId,
      attributeKey,
    });
  }

  @formkiqAPIHandler
  public static async deleteDocumentAttributeValue(
    siteId: string,
    documentId: string,
    attributeKey: string,
    attributeValue: string
  ): Promise<any> {
    if (!siteId) {
      siteId = this.determineSiteId();
    }
    return this.getFormkiqClient().documentsApi.deleteDocumentAttributeValue({
      siteId,
      documentId,
      attributeKey,
      attributeValue,
    });
  }

  @formkiqAPIHandler
  public static async addGroup(
    groupBody: any,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.addGroup({
      groupBody,
    });
  }

  @formkiqAPIHandler
  public static async deleteGroup(
    groupName: string,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.deleteGroup({
      groupName,
    });
  }

  @formkiqAPIHandler
  public static async getGroupUsers(
      groupName: string,
      limit = 20,
      next = null,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.getGroupUsers({
      groupName,
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async addUserToGroup(
      groupName: string,
      userBody: string,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.addUserToGroup({
      groupName,
      userBody,
    });
  }

  @formkiqAPIHandler
    public static async deleteUserFromGroup(
        groupName: string,
        username: string,
    ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.deleteUserFromGroup({
      groupName,
      username,
    });
  }

  @formkiqAPIHandler
  public static async getUsers(
      limit = 20,
      next = null,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.getUsers({
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async addUser(
      userBody: any,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.addUser({
      userBody,
    });
  }

  @formkiqAPIHandler
  public static async getUser(
      username: string,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.getUser({
      username,
    });
  }

  @formkiqAPIHandler
  public static async deleteUser(
      username: string,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.deleteUser({
      username,
    });
  }

  @formkiqAPIHandler
  public static async getUserGroups(
      username: string,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.getUserGroups({
      username,
    });
  }

  @formkiqAPIHandler
  public static async setUserOperation(
      username: string,
      userOperation: any,
  ): Promise<any> {
    return this.getFormkiqClient().userManagementApi.setUserOperation({
      username,
      userOperation,
    });
  }

  @formkiqAPIHandler
    public static async getGroup(
      groupName: string,
  ): Promise<any> {
      return this.getFormkiqClient().userManagementApi.getGroup({
          groupName,
      });
  }

  @formkiqAPIHandler
    public static async getSiteSchema(
      siteId: string,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.getSiteSchema({
      siteId,
    });
  }
  @formkiqAPIHandler
    public static async setSiteSchema(
      siteId: string,
      schema: any,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.setSiteSchema({
      siteId,
      schema,
    })
  }

  @formkiqAPIHandler
    public static async getSiteClassifications(
      siteId: string,
      limit = 20,
      next = null,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.getSiteClassifications({
      siteId,
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async addSiteClassification(
    siteId: string,
    classification: any,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.addSiteClassification({
      siteId,
      classification,
    });
  }

  @formkiqAPIHandler
  public static async getClassification(
      siteId: string,
      classificationId: string,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.getClassification({
      siteId,
      classificationId,
    });
  }

  @formkiqAPIHandler
  public static async deleteClassification(
      siteId: string,
      classificationId: string,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.deleteClassification({
      siteId,
      classificationId,
    });
  }

  @formkiqAPIHandler
  public static async setClassification(
      siteId: string,
      classificationId: string,
      classification: any,
  ): Promise<any> {
    return this.getFormkiqClient().schemasApi.setClassification({
      siteId,
      classificationId,
      classification,
    });
  }



  @formkiqAPIHandler
  public static async addDocument(
    siteId: string,
    addOrUpdateDocumentParameters: any
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.addDocument({
      siteId,
      addOrUpdateDocumentParameters,
    });
  }

  @formkiqAPIHandler
  public static async getUserActivities(
      siteId: string,
      userId = null,
      limit = 20,
      next = null,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getUserActivities({
      siteId,
      limit,
      next,
      userId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentUserActivities(
    siteId: string,
    limit = 20,
    next = null,
    documentId: string,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getDocumentUserActivities({
      siteId,
      limit,
      next,
      documentId,
    });
  }

  @formkiqAPIHandler
  public static async getDocumentContent(
    siteId: string,
    documentId: string,
    versionKey: any,
    inline = false,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getDocumentContent({
      siteId,
      documentId,
      versionKey,
      inline,
    });
  }

  @formkiqAPIHandler
  public static async getMappings(
      siteId: string,
      limit = 20,
      next = null,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getMappings({
      siteId,
      limit,
      next,
    });
  }

  @formkiqAPIHandler
  public static async restoreDocument(
      siteId: string,
      documentId: string,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.restoreDocument({
      siteId,
      documentId,
    });
  }

  @formkiqAPIHandler
    public static async addMapping(
        siteId: string,
        addMappingParameters: any,
    ): Promise<any> {
    return this.getFormkiqClient().documentsApi.addMapping({
      siteId,
      addMappingParameters,
    });
  }

  @formkiqAPIHandler
  public static async getMapping(
      siteId: string,
      mappingId: string,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.getMapping({
      siteId,
      mappingId,
    });
  }

  @formkiqAPIHandler
  public static async setMapping(
      siteId: string,
      mappingId: string,
      setMappingParameters: any,
  ): Promise<any> {
    return this.getFormkiqClient().documentsApi.setMapping({
      siteId,
      mappingId,
      setMappingParameters,
    });
  }

  @formkiqAPIHandler
    public static async deleteMapping(
        siteId: string,
        mappingId: string,
    ): Promise<any> {
    return this.getFormkiqClient().documentsApi.deleteMapping({
      siteId,
      mappingId,
    });
  }

}
