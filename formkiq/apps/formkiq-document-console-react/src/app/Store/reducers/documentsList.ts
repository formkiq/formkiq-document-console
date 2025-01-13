import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addOrCreateTagValue,
  excludeDocumentsWithTagFromAll,
  findFolderAndParent,
  findParentForDocument,
  isTagValueIncludes,
  isUUIDv4orV5,
  removeTagOrTagValue,
} from '../../helpers/services/toolService';
import {
  getAllAttributes,
  getAllTags,
  setAllAttributes,
  setAllTags,
} from '../../helpers/tools/useCacheStorage';
import { IDocument, RequestStatus } from '../../helpers/types/document';
import { IFolder } from '../../helpers/types/folder';
import { RootState } from '../store';
import { DocumentsService } from './../../helpers/services/documentsService';
import { setAllAttributesData, setAllTagsData } from './attributesData';
import { User } from './auth';
import { openDialog as openNotificationDialog } from './globalNotificationControls';

let callCounter = 0;
export const fetchDocuments = createAsyncThunk(
  'documentsList/fetchDocuments',
  async (data: any, thunkAPI) => {
    const currentCallId = ++callCounter;
    const {
      siteId,
      formkiqVersion,
      searchWord,
      searchFolder,
      subfolderUri,
      queueId,
      filterTag,
      filterAttribute,
      nextToken,
      page,
      searchAttributes,
    } = data;
    const user = (thunkAPI.getState() as any)?.authState.user;
    const tagParam = filterTag ? filterTag.split(':')[0] : null;
    const attributeParam = filterAttribute ? filterAttribute : null;
    const allAttributesState = (thunkAPI.getState() as any)?.attributesDataState
      .allAttributes;
    const allTagsState = (thunkAPI.getState() as any)?.attributesDataState
      .allTags;
    const attributesLastRefreshed = (thunkAPI.getState() as any)
      ?.attributesDataState.attributesLastRefreshed;
    const attributesSiteId = (thunkAPI.getState() as any)?.attributesDataState
      .attributesSiteId;
    let allAttributes = allAttributesState;
    let allTags = allTagsState;
    const dateDiff =
      new Date().getTime() - new Date(attributesLastRefreshed).getTime();

    async function loadTagsAndAttributes() {
      await DocumentsService.getAllTagKeys(siteId).then((response: any) => {
        const allTagData = {
          allTags: response?.values,
          tagsLastRefreshed: new Date(),
          tagsSiteId: siteId,
        };
        allTags = response?.values;
        setAllTags(allTagData);
        thunkAPI.dispatch(setAllTagsData(allTagData));
      });
      await DocumentsService.getAttributes(siteId).then((response: any) => {
        const allAttributesData = {
          allAttributes: response?.attributes,
          attributesLastRefreshed: new Date(),
          attributesSiteId: siteId,
        };
        allAttributes = response?.attributes;
        setAllAttributes(allAttributesData);
        thunkAPI.dispatch(setAllAttributesData(allAttributesData));
      });
    }

    // check if data in state is valid
    if (dateDiff / 1000 > 30 || attributesSiteId !== siteId) {
      const allAttributesCache = await getAllAttributes();
      const allTagsCache = await getAllTags();
      // check if data in cache is valid
      if (allAttributesCache && allTagsCache) {
        const dateDiff =
          new Date().getTime() -
          new Date(allAttributesCache.attributesLastRefreshed).getTime();
        const isCachedDataValid =
          dateDiff / 1000 < 30 &&
          allAttributesCache.attributesSiteId === siteId;
        if (isCachedDataValid) {
          // use data from cache and update state
          allAttributes = allAttributesCache.allAttributes;
          allTags = allTagsCache.allTags;
          thunkAPI.dispatch(setAllAttributesData(allAttributesCache));
          thunkAPI.dispatch(setAllTagsData(allTagsCache));
        } else {
          // load the data and save it in cache and in state
          await loadTagsAndAttributes();
        }
      } else {
        // load the data and save it in cache and in state
        await loadTagsAndAttributes();
      }
    }
    if (searchWord || searchAttributes) {
      const cleanedSearchWord = searchWord
        ? searchWord.replace(/\s+/g, ' ').trim()
        : '';
      if (isUUIDv4orV5(cleanedSearchWord)) {
        // UUID detected, use document ID search
        DocumentsService.searchById(
          siteId,
          searchWord.trim(),
          allTags,
          allAttributes
        ).then((response: any) => {
          if (response) {
            if (currentCallId !== callCounter) return;
            const data = {
              siteId,
              documents: response.documents,
              user,
              page,
              isLoadingMore: false,
              isLastSearchPageLoaded: response.documents?.length === 0,
              next: response.next,
            };
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      } else if (cleanedSearchWord.split(' ').every(isUUIDv4orV5)) {
        const uniqueDocumentIds: string[] = Array.from(
          new Set(cleanedSearchWord.split(' '))
        );
        DocumentsService.searchByIds(
          siteId,
          uniqueDocumentIds,
          allTags,
          allAttributes
        ).then((response: any) => {
          if (response) {
            if (currentCallId !== callCounter) return;
            const data = {
              siteId,
              documents: response.documents,
              user,
              page,
              isLoadingMore: false,
              isLastSearchPageLoaded: response.documents?.length === 0,
              next: response.next,
            };
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      } else if (searchFolder && searchFolder.length) {
        // TODO: see if now implemented on backend
        // NOTE: not yet implemented on backend
        DocumentsService.searchDocumentsInFolder(
          siteId,
          tagParam,
          searchWord,
          searchFolder,
          page,
          allAttributes,
          searchAttributes
        ).then((response: any) => {
          if (response) {
            if (currentCallId !== callCounter) return; // After the async operation completes,this check ensures that only the result from the most recent call is used to update the state.
            const data = {
              siteId,
              documents: response.documents,
              user: user,
              page,
              isLoadingMore: false,
              isLastSearchPageLoaded: false,
              next: response.next,
            };
            if (page > 1) {
              data.isLoadingMore = true;
            }
            if (response.documents?.length === 0) {
              data.isLastSearchPageLoaded = true;
            }
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      } else {
        DocumentsService.searchDocuments(
          siteId,
          formkiqVersion,
          tagParam,
          searchWord,
          page,
          allTags,
          allAttributes,
          searchAttributes
        ).then((response: any) => {
          if (response) {
            if (currentCallId !== callCounter) return;
            const temp: any = response.documents?.filter(
              (document: IDocument) => {
                return document.path;
              }
            );
            const data = {
              siteId,
              documents: temp,
              user: user,
              page,
              isLoadingMore: false,
              isLastSearchPageLoaded: false,
              next: response.next,
            };
            if (page > 1) {
              data.isLoadingMore = true;
            }
            if (response.documents?.length === 0) {
              data.isLastSearchPageLoaded = true;
            }
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      }
    } else {
      if (queueId && queueId.length) {
        DocumentsService.getDocumentsInQueue(
          queueId,
          siteId,
          null,
          nextToken,
          20
        ).then((response: any) => {
          // putting workflow under document object, for top-level object consistency with other search results
          if (response) {
            if (currentCallId !== callCounter) return;
            const mappedDocuments: any = [];
            response.documents.map((val: any) => {
              if (val.workflow) {
                val.document.workflow = val.workflow;
              }
              mappedDocuments.push(val.document);
            });
            const data = {
              siteId,
              documents: mappedDocuments,
              user: user,
              next: response.next,
              isLoadingMore: false,
              isLastSearchPageLoaded: false,
            };
            if (nextToken) {
              data.isLoadingMore = true;
            }
            if (response.documents?.length === 0) {
              data.isLastSearchPageLoaded = true;
            }
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      } else if (subfolderUri) {
        if (subfolderUri === 'shared') {
          DocumentsService.getDocumentsSharedWithMe(
            siteId,
            tagParam,
            null,
            nextToken,
            attributeParam,
            allAttributes
          ).then((response: any) => {
            if (response) {
              if (currentCallId !== callCounter) return;
              const data = {
                siteId,
                documents: response.documents,
                user: user,
                tag: filterTag,
                folder: subfolderUri,
                next: response.next,
                isLoadingMore: false,
                isLastSearchPageLoaded: false,
              };
              if (nextToken) {
                data.isLoadingMore = true;
              }
              if (response.documents?.length === 0) {
                data.isLastSearchPageLoaded = true;
              }
              thunkAPI.dispatch(setDocuments(data));
            }
          });
        } else if (subfolderUri === 'favorites') {
          DocumentsService.getDocumentsFavoritedByMe(
            siteId,
            tagParam,
            null,
            nextToken,
            attributeParam,
            allAttributes
          ).then((response: any) => {
            if (response) {
              if (currentCallId !== callCounter) return;
              const data = {
                siteId,
                documents: response.documents,
                user: user,
                tag: filterTag,
                folder: subfolderUri,
                next: response.next,
                isLoadingMore: false,
                isLastSearchPageLoaded: false,
              };
              if (nextToken) {
                data.isLoadingMore = true;
              }
              if (response.documents?.length === 0) {
                data.isLastSearchPageLoaded = true;
              }
              thunkAPI.dispatch(setDocuments(data));
            }
          });
        } else if (subfolderUri === 'deleted') {
          DocumentsService.getDeletedDocuments(
            siteId,
            null,
            nextToken,
            'true'
          ).then((response: any) => {
            if (response) {
              if (currentCallId !== callCounter) return;
              const data = {
                siteId,
                documents: response.documents,
                user: user,
                tag: filterTag,
                folder: subfolderUri,
                next: response.next,
                isLoadingMore: false,
                isLastSearchPageLoaded: false,
              };
              if (nextToken) {
                data.isLoadingMore = true;
              }
              if (response.documents?.length === 0) {
                data.isLastSearchPageLoaded = true;
              }
              thunkAPI.dispatch(setDocuments(data));
            }
          });
        } else if (subfolderUri === 'all') {
          DocumentsService.getAllDocuments(
            siteId,
            tagParam,
            null,
            nextToken,
            attributeParam,
            allAttributes
          ).then((response: any) => {
            if (response) {
              if (currentCallId !== callCounter) return;
              const data = {
                siteId,
                documents: response.documents,
                user: user,
                tag: filterTag,
                folder: subfolderUri,
                next: response.next,
                isLoadingMore: false,
                isLastSearchPageLoaded: false,
              };
              if (nextToken) {
                data.isLoadingMore = true;
              }
              if (response.documents?.length === 0) {
                data.isLastSearchPageLoaded = true;
              }
              thunkAPI.dispatch(setDocuments(data));
            }
          });
        } else {
          DocumentsService.getDocumentsInFolder(
            subfolderUri,
            siteId,
            tagParam,
            null,
            nextToken,
            20,
            allTags,
            attributeParam,
            allAttributes
          ).then((response: any) => {
            if (response) {
              if (currentCallId !== callCounter) return;
              const data = {
                siteId,
                documents: response.documents,
                user: user,
                tag: filterTag,
                folder: subfolderUri,
                next: response.next,
                isLoadingMore: false,
                isLastSearchPageLoaded: false,
                page,
              };
              if (nextToken) {
                data.isLoadingMore = true;
              }
              if (response.documents?.length === 0) {
                data.isLastSearchPageLoaded = true;
              }
              thunkAPI.dispatch(setDocuments(data));
            }
          });
        }
      } else {
        DocumentsService.getDocumentsInFolder(
          '',
          siteId,
          tagParam,
          null,
          nextToken,
          20,
          allTags,
          attributeParam,
          allAttributes
        ).then((response: any) => {
          if (response) {
            if (currentCallId !== callCounter) return;
            const data = {
              siteId,
              documents: response.documents,
              user: user,
              folder: '',
              tag: filterTag,
              next: response.next,
              isLoadingMore: false,
              attribute: filterAttribute,
              page,
            };
            if (nextToken) {
              data.isLoadingMore = true;
            }
            thunkAPI.dispatch(setDocuments(data));
          }
        });
      }
    }
  }
);
export const toggleExpandFolder = createAsyncThunk(
  'documentsList/toggleExpandFolder',
  async (data: any, thunkAPI) => {
    const {
      folder,
      subfolderUri,
      siteId,
      user,
    }: {
      folder: IFolder;
      subfolderUri: string;
      siteId: string;
      user: User;
    } = data;
    const allAttributesState = (thunkAPI.getState() as any)?.attributesDataState
      .allAttributes;
    const allTagsState = (thunkAPI.getState() as any)?.attributesDataState
      .allTags;
    const attributesLastRefreshed = (thunkAPI.getState() as any)
      ?.attributesDataState.attributesLastRefreshed;
    const attributesSiteId = (thunkAPI.getState() as any)?.attributesDataState
      .attributesSiteId;
    let allAttributes = allAttributesState;
    let allTags = allTagsState;

    // check if attributes state is valid
    async function loadTagsAndAttributes() {
      await DocumentsService.getAllTagKeys(siteId).then((response: any) => {
        const allTagData = {
          allTags: response?.values,
          tagsLastRefreshed: new Date(),
          tagsSiteId: siteId,
        };
        allTags = response?.values;
        setAllTags(allTagData);
        thunkAPI.dispatch(setAllTagsData(allTagData));
      });

      await DocumentsService.getAttributes(siteId).then((response: any) => {
        const allAttributesData = {
          allAttributes: response?.attributes,
          attributesLastRefreshed: new Date(),
          attributesSiteId: siteId,
        };
        allAttributes = response?.attributes;
        setAllAttributes(allAttributesData);
        thunkAPI.dispatch(setAllAttributesData(allAttributesData));
      });
    }

    const dateDiff =
      new Date().getTime() - new Date(attributesLastRefreshed).getTime();
    if (dateDiff / 1000 > 30 || attributesSiteId !== siteId) {
      const allAttributesCache = await getAllAttributes();
      const allTagsCache = await getAllTags();
      if (allAttributesCache && allTagsCache) {
        // check if data in cache is valid
        const dateDiff =
          new Date().getTime() -
          new Date(allAttributesCache.attributesLastRefreshed).getTime();
        const isCachedDataValid =
          dateDiff / 1000 < 30 &&
          allAttributesCache.attributesSiteId === siteId;
        if (isCachedDataValid) {
          // use data from cache and update state
          allAttributes = allAttributesCache.allAttributes;
          allTags = allTagsCache.allTags;
          thunkAPI.dispatch(setAllAttributesData(allAttributesCache));
          thunkAPI.dispatch(setAllTagsData(allTagsCache));
        } else {
          // console.log('fetching all tags for refresh - EXPAND')
          await loadTagsAndAttributes();
        }
      } else {
        await loadTagsAndAttributes();
      }
    }
    const folderPath = subfolderUri;
    if (folder.isExpanded) {
      const newValue = { ...folder, isExpanded: false };
      thunkAPI.dispatch(
        updateFolderValue({ folderToUpdate: folder, newValue })
      );
    } else {
      if (folder.documents?.length > 0 || folder.folders?.length > 0) {
        const newValue = { ...folder, isExpanded: true };
        thunkAPI.dispatch(
          updateFolderValue({ folderToUpdate: folder, newValue })
        );
      } else {
        await DocumentsService.getDocumentsInFolder(
          folderPath,
          siteId,
          null,
          null,
          null,
          25,
          allTags,
          null,
          allAttributes
        ).then((response: any) => {
          if (response) {
            let insertedDate = '';
            if (folder && folder.insertedDate) {
              insertedDate = folder.insertedDate;
            }
            let lastModifiedDate = '';
            if (folder && folder.lastModifiedDate) {
              lastModifiedDate = folder.lastModifiedDate;
            }
            // NOTE: adding siteId and FULL path on expanding folder, but FULL path is not added to folders when loading a folder page (vs. expanding)
            const childFolders = response.documents
              .filter((val: any) => val.folder === true)
              .map((val: any) => {
                val.siteId = siteId;
                val.path = folderPath + '/' + val.path;
                return val;
              });
            const childDocs = response.documents.filter(
              (val: any) => val.folder !== true
            );
            const newValue: IFolder = {
              ...folder,
              siteId: siteId,
              documentId: folder.documentId,
              path: folderPath,
              insertedDate,
              lastModifiedDate,
              isExpanded: true,
              documents: childDocs,
              folders: childFolders,
              tags: [],
            };
            thunkAPI.dispatch(
              updateFolderValue({ folderToUpdate: folder, newValue })
            );
          }
        });
      }
    }
  }
);
export const fetchDeleteFolder = createAsyncThunk(
  'documentsList/fetchDeleteFolder',
  async (data: any, thunkAPI) => {
    const {
      folder,
      siteId,
    }: {
      folder: IFolder;
      siteId: string;
    } = data;
    DocumentsService.deleteFolder(folder.indexKey, siteId).then((response) => {
      if (response.status && response.status === 200) {
        thunkAPI.dispatch(removeFolderFromList({ folderToDelete: folder }));
      } else {
        if (response.message === 'Folder not empty') {
          thunkAPI.dispatch(
            openNotificationDialog({
              dialogTitle:
                'This folder is not empty; please note that there may be files from this folder currently stored under "Deleted Documents".',
            })
          );
        } else {
          thunkAPI.dispatch(
            openNotificationDialog({ dialogTitle: response.message })
          );
        }
      }
    });
  }
);
export const deleteDocument = createAsyncThunk(
  'documentsList/deleteDocument',
  async (data: any, thunkAPI) => {
    const {
      siteId,
      user,
      documentId,
      softDelete,
    }: {
      siteId: string;
      user: User;
      documentId: string;
      softDelete: boolean;
    } = data;
    await DocumentsService.deleteDocument(
      documentId,
      siteId,
      softDelete.toString()
    ).then((res) => {
      if (res.status !== 200) {
        const errors = res?.errors;
        throw new Error(errors ? errors[0].error : 'Error deleting document.');
      }
      const infoDocumentId = window.location.hash.match(/id=(.*)/);
      if (
        infoDocumentId &&
        infoDocumentId.length > 0 &&
        documentId === infoDocumentId[1]
      ) {
        // close info tab if viewing deleted document
        window.location.hash = '';
      }
      // remove file from document list
      const state = thunkAPI.getState() as any;
      const { documents, folders } = state?.documentListState || {};
      const newDocs = documents.filter((doc: any) => {
        return doc.documentId !== documentId;
      });
      const newFolders = [...folders].map((folder: any) => {
        return {
          ...folder,
          documents: folder.documents
            ? folder.documents.filter(
                (doc: any) => doc.documentId !== documentId
              )
            : [],
        };
      });
      thunkAPI.dispatch(
        updateDocumentsList({
          documents: newDocs,
          folders: newFolders,
          user: user,
          isSystemDeletedByKey: false,
        })
      );
    });
  }
);
const defaultState = {
  documents: [] as any[],
  folders: [] as any[],
  loadingStatus: RequestStatus.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false,
};

export const documentsListSlice = createSlice({
  name: 'documentsList',
  initialState: defaultState,
  reducers: {
    setDocumentLoadingStatusPending: (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.pending,
      };
    },
    setDocuments: (state, action: PayloadAction<any>) => {
      if (action.payload) {
        const {
          siteId,
          documents,
          folder,
          tag,
          isLoadingMore = false,
          attribute,
          next,
          page = 1,
        } = action.payload;

        let { isLastSearchPageLoaded = false } = action.payload;

        if (next) {
          isLastSearchPageLoaded = false;
        } else {
          isLastSearchPageLoaded = true;
        }

        if (documents) {
          let folders = documents
            .filter((doc: any) => {
              return doc.folder;
            })
            .map((val: any) => {
              val.siteId = siteId;
              return val;
            });
          // format date, filter deleted
          const actualDocuments: IDocument[] = documents.filter((doc: any) => {
            return !doc.folder;
          });
          let docsRes = actualDocuments.filter((doc: any) => {
            if (folder && (folder === 'deleted' || folder === 'all')) {
              if (tag) {
                if (tag.indexOf(':') === -1) {
                  type ObjectKey = keyof typeof doc.tags;
                  const tagProperty = tag as ObjectKey;
                  return doc.tags[tagProperty] !== undefined;
                } else {
                  type ObjectKey = keyof typeof doc.tags;
                  const tagProperty = tag.split(':')[0] as ObjectKey;
                  const tagValues = tag.split(':')[1].split('|');
                  if (doc.tags[tagProperty] !== undefined) {
                    return isTagValueIncludes(doc.tags[tagProperty], tagValues);
                  } else {
                    return false;
                  }
                }
              } else {
                return true;
              }
            } else if (tag) {
              if (tag.indexOf(':') === -1) {
                type ObjectKey = keyof typeof doc.tags;
                const tagProperty = tag as ObjectKey;
                return doc.tags[tagProperty] !== undefined;
              } else {
                type ObjectKey = keyof typeof doc.tags;
                const tagProperty = tag.split(':')[0] as ObjectKey;
                const tagValues = tag.split(':')[1].split('|');
                if (doc.tags[tagProperty] !== undefined) {
                  return isTagValueIncludes(doc.tags[tagProperty], tagValues);
                } else {
                  return false;
                }
              }
            } else {
              return true;
            }
          });
          if (isLoadingMore && state.documents) {
            const docsToAdd: IDocument[] = [];
            (docsRes as IDocument[]).forEach((compareDoc) => {
              let inState = false;
              (state.documents as unknown as IDocument[]).forEach(
                (stateDoc) => {
                  if (stateDoc && stateDoc.path === compareDoc.path) {
                    inState = true;
                  }
                }
              );
              if (!inState) {
                docsToAdd.push(compareDoc);
              }
            });
            docsRes = (state.documents as IDocument[]).concat(docsToAdd);
          }
          if (isLoadingMore && state.folders) {
            const foldersToAdd: IFolder[] = [];
            (folders as IFolder[]).forEach((compareSubfolder) => {
              let inState = false;
              (state.folders as unknown as IFolder[]).forEach(
                (stateSubfolder) => {
                  if (
                    stateSubfolder &&
                    stateSubfolder.path === compareSubfolder.path
                  ) {
                    inState = true;
                  }
                }
              );
              if (!inState) {
                foldersToAdd.push(compareSubfolder);
              }
            });
            folders = (state.folders as IFolder[]).concat(foldersToAdd);
          }
          return {
            ...state,
            nextToken: next,
            documents: docsRes,
            folders,
            currentSearchPage: page,
            //Because we don't set the documents in the .fulfilled handler of the thunk, there is a brief desync between the fulfilled status
            //and the documents beings set which leads to the empty table being briefly shown
            loadingStatus: RequestStatus.fulfilled,
            isLastSearchPageLoaded: isLastSearchPageLoaded,
          };
        }
      }
      return {
        ...state,
        documents: [] as any[],
        folders: [] as any[],
        nextToken: null,
      };
    },
    updateDocumentsList: (state, action) => {
      if (action.payload && state.documents) {
        const { documents, folders } = action.payload;
        const temp = {
          folders: folders ? folders : state.folders,
          documents: documents,
        };
        state.folders = temp.folders as any;
        state.documents = temp.documents as any;
      }
      return state as any;
    },
    removeFolderFromList: (state, action) => {
      const { folderToDelete }: { folderToDelete: IFolder } = action.payload;
      if (state.folders) {
        const [folder, index, parentFolder] = findFolderAndParent(
          folderToDelete.documentId,
          state
        );
        if (parentFolder?.folders && folder) {
          const newFolders = [...parentFolder.folders];
          newFolders.splice(index, 1);
          parentFolder.folders = newFolders;
        }
      }
      return state;
    },
    addDocumentTag: (state, action) => {
      if (state.documents) {
        const { doc, tagKey, valueToAdd } = action.payload;
        const newTags = addOrCreateTagValue(
          tagKey,
          doc?.tags[tagKey],
          valueToAdd,
          doc.tags
        );
        const [document, index, folder] = findParentForDocument(
          doc.documentId,
          { ...state }
        );
        if (document && folder) {
          const newDocuments: any = [...folder.documents] as any[];
          newDocuments[index] = { ...document, tags: newTags };
          folder.documents = newDocuments;
        }
      }
      return state;
    },
    removeDocumentTag: (state, action) => {
      if (state.documents) {
        const { doc, tagKey, valueToRemove } = action.payload;
        const newTags = removeTagOrTagValue(
          tagKey,
          doc.tags[tagKey],
          valueToRemove,
          doc.tags
        );
        const indexOfFile = ([...state.documents] as any).findIndex(
          (el: IDocument) => doc.documentId === el.documentId
        );
        const newDocuments: any = [...state.documents] as any[];
        newDocuments[indexOfFile] = { ...doc, tags: newTags };
        state.documents = newDocuments;
      }
      return state;
    },
    updateFolderValue: (state, action) => {
      const {
        folderToUpdate,
        newValue,
      }: { folderToUpdate: IFolder; newValue: IFolder } = action.payload;
      if (state.folders) {
        if (newValue === null) {
          console.error('Failed to update folder');
        } else {
          const [folder, index, parentFolder] = findFolderAndParent(
            folderToUpdate.documentId,
            state
          );
          if (parentFolder?.folders && folder) {
            parentFolder.folders[index] = newValue;
          }
        }
      }
      return state;
    },
    retrieveAndRefreshFolder: (state, action) => {
      const {
        folderPath,
        document,
        documentAction,
      }: {
        folderPath: string;
        document: IDocument;
        documentAction: string;
      } = action.payload;
      let foundFolder: any = folderPath ? null : state;
      let fullFolderPath = '';
      // TODO: determine why state.folders will not work in some cases (such as when current folder is not top-level)
      if (state.folders) {
        // TODO: create recursive function, for efficiency and allow deeper than five subfolders
        (state.folders as IFolder[]).forEach((folder: IFolder) => {
          if (folder.path === folderPath) {
            foundFolder = folder;
          } else if (
            folder.path === folderPath.substring(0, folderPath.indexOf('/'))
          ) {
            fullFolderPath = folder.path;
            let subfoldersPath = folderPath.substring(
              fullFolderPath.length + 1
            );
            (folder.folders as IFolder[]).forEach((subfolder01: IFolder) => {
              if (subfolder01.path === subfoldersPath) {
                foundFolder = subfolder01;
                fullFolderPath += '/' + subfolder01.path;
              } else if (
                subfolder01.path ===
                subfoldersPath.substring(0, subfoldersPath.indexOf('/'))
              ) {
                fullFolderPath += '/' + subfolder01.path;
                subfoldersPath = folderPath.substring(
                  fullFolderPath.length + 1
                );
                (subfolder01.folders as IFolder[]).forEach(
                  (subfolder02: IFolder) => {
                    if (subfolder02.path === subfoldersPath) {
                      foundFolder = subfolder02;
                      fullFolderPath += '/' + subfolder02.path;
                    } else if (
                      subfolder02.path ===
                      subfoldersPath.substring(0, subfoldersPath.indexOf('/'))
                    ) {
                      fullFolderPath += '/' + subfolder02.path;
                      subfoldersPath = folderPath.substring(
                        fullFolderPath.length + 1
                      );
                      (subfolder02.folders as IFolder[]).forEach(
                        (subfolder03: IFolder) => {
                          if (subfolder03.path === subfoldersPath) {
                            foundFolder = subfolder03;
                            fullFolderPath += '/' + subfolder03.path;
                          } else if (
                            subfolder03.path ===
                            subfoldersPath.substring(
                              0,
                              subfoldersPath.indexOf('/')
                            )
                          ) {
                            fullFolderPath += '/' + subfolder03.path;
                            subfoldersPath = folderPath.substring(
                              fullFolderPath.length + 1
                            );
                            (subfolder03.folders as IFolder[]).forEach(
                              (subfolder04: IFolder) => {
                                if (subfolder04.path === subfoldersPath) {
                                  foundFolder = subfolder04;
                                  fullFolderPath += '/' + subfolder04.path;
                                } else if (
                                  subfolder04.path ===
                                  subfoldersPath.substring(
                                    0,
                                    subfoldersPath.indexOf('/')
                                  )
                                ) {
                                  fullFolderPath += '/' + subfolder04.path;
                                  subfoldersPath = folderPath.substring(
                                    fullFolderPath.length + 1
                                  );
                                  (subfolder04.folders as IFolder[]).forEach(
                                    (subfolder05: IFolder) => {
                                      if (subfolder05.path === subfoldersPath) {
                                        foundFolder = subfolder05;
                                        fullFolderPath +=
                                          '/' + subfolder05.path;
                                      } else if (
                                        subfolder05.path ===
                                        subfoldersPath.substring(
                                          0,
                                          subfoldersPath.indexOf('/')
                                        )
                                      ) {
                                        fullFolderPath +=
                                          '/' + subfolder05.path;
                                        subfoldersPath = folderPath.substring(
                                          fullFolderPath.length + 1
                                        );
                                        (
                                          subfolder05.folders as IFolder[]
                                        ).forEach((subfolder06: IFolder) => {
                                          if (
                                            subfolder06.path === subfoldersPath
                                          ) {
                                            foundFolder = subfolder06;
                                            fullFolderPath +=
                                              '/' + subfolder06.path;
                                          } else if (
                                            subfolder06.path ===
                                            subfoldersPath.substring(
                                              0,
                                              subfoldersPath.indexOf('/')
                                            )
                                          ) {
                                            fullFolderPath +=
                                              '/' + subfolder06.path;
                                            subfoldersPath =
                                              folderPath.substring(
                                                fullFolderPath.length + 1
                                              );
                                            (
                                              subfolder06.folders as IFolder[]
                                            ).forEach(
                                              (subfolder07: IFolder) => {
                                                if (
                                                  subfolder07.path ===
                                                  subfoldersPath
                                                ) {
                                                  foundFolder = subfolder07;
                                                  fullFolderPath +=
                                                    '/' + subfolder07.path;
                                                } else if (
                                                  subfolder07.path ===
                                                  subfoldersPath.substring(
                                                    0,
                                                    subfoldersPath.indexOf('/')
                                                  )
                                                ) {
                                                  fullFolderPath +=
                                                    '/' + subfolder07.path;
                                                  subfoldersPath =
                                                    folderPath.substring(
                                                      fullFolderPath.length + 1
                                                    );
                                                  (
                                                    subfolder07.folders as IFolder[]
                                                  ).forEach(
                                                    (subfolder08: IFolder) => {
                                                      if (
                                                        subfolder08.path ===
                                                        subfoldersPath
                                                      ) {
                                                        foundFolder =
                                                          subfolder08;
                                                        fullFolderPath +=
                                                          '/' +
                                                          subfolder08.path;
                                                      } else if (
                                                        subfolder08.path ===
                                                        subfoldersPath.substring(
                                                          0,
                                                          subfoldersPath.indexOf(
                                                            '/'
                                                          )
                                                        )
                                                      ) {
                                                        (
                                                          subfolder08.folders as IFolder[]
                                                        ).forEach(
                                                          (
                                                            subfolder09: IFolder
                                                          ) => {
                                                            if (
                                                              subfolder09.path ===
                                                              subfoldersPath
                                                            ) {
                                                              foundFolder =
                                                                subfolder09;
                                                              fullFolderPath +=
                                                                '/' +
                                                                subfolder09.path;
                                                            } else if (
                                                              subfolder09.path ===
                                                              subfoldersPath.substring(
                                                                0,
                                                                subfoldersPath.indexOf(
                                                                  '/'
                                                                )
                                                              )
                                                            ) {
                                                              (
                                                                subfolder09.folders as IFolder[]
                                                              ).forEach(
                                                                (
                                                                  subfolder10: IFolder
                                                                ) => {
                                                                  if (
                                                                    subfolder10.path ===
                                                                    subfoldersPath
                                                                  ) {
                                                                    foundFolder =
                                                                      subfolder10;
                                                                    fullFolderPath +=
                                                                      '/' +
                                                                      subfolder10.path;
                                                                  }
                                                                }
                                                              );
                                                            }
                                                          }
                                                        );
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                            );
                                          }
                                        });
                                      }
                                    }
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
      if (foundFolder) {
        if (document) {
          if (documentAction === 'add') {
            if (foundFolder.documents) {
              foundFolder.documents.push(document);
              foundFolder.documents = foundFolder.documents.sort(
                (a: any, b: any) => (a.path > b.path ? 1 : -1)
              );
            }
            const newValue = { ...foundFolder };
            updateFolderValue({ folderToUpdate: foundFolder, newValue });
          } else if (documentAction === 'remove') {
            const index = foundFolder.documents?.indexOf(document);
            if (index > -1) {
              foundFolder.documents.splice(index, 1);
            } else {
              foundFolder.documents.forEach((doc: any, i: number) => {
                if (doc.documentId === document.documentId) {
                  foundFolder.documents.splice(i, 1);
                }
              });
            }
            const newValue = { ...foundFolder };
            updateFolderValue({ folderToUpdate: foundFolder, newValue });
          }
        }
      } else {
        // TODO: replace with proper alternative to "found folder"
        window.location.reload();
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDocuments.rejected, (state) => {
      return {
        ...state,
        loadingStatus: RequestStatus.rejected,
      };
    });
    builder.addCase(fetchDocuments.pending, (state) => {
      return {
        ...state,
        nextLoadingStatus: RequestStatus.pending,
      };
    });
  },
});

export const {
  setDocumentLoadingStatusPending,
  setDocuments,
  addDocumentTag,
  removeDocumentTag,
  updateDocumentsList,
  updateFolderValue,
  retrieveAndRefreshFolder,
  removeFolderFromList,
} = documentsListSlice.actions;

export const DocumentListState = (state: RootState) => state.documentListState;

export default documentsListSlice.reducer;
