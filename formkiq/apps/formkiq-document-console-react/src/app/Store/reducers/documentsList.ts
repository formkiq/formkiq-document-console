import { DocumentsService } from './../../helpers/services/documentsService'
import { IDocument, requestStatusTypes } from '../../helpers/types/document'
import { IFolder } from '../../helpers/types/folder'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addOrCreateTagValue, excludeDocumentsWithTagFromAll, findFolderAndParent, findParentForDocument, isTagValueIncludes, removeTagOrTagValue } from '../../helpers/services/toolService';
import { openDialog as openNotificationDialog} from "./globalNotificationControls"
import { User } from './auth';
import { setAllTags } from '../../Store/reducers/data'

export const fetchDocuments = createAsyncThunk("documentsList/fetchDocuments", async (data: any, thunkAPI) => {
  const {
    siteId,
    formkiqVersion,
    searchWord,
    searchFolder, 
    subfolderUri,
    filterTag,
    nextToken,
    page
  } = data
  const { user } = (thunkAPI.getState() as any)?.authReducer
  let tagParam = null
  if (filterTag) {
    tagParam = filterTag.split(':')[0]
  }
  const dataCache = (thunkAPI.getState() as any)?.dataCacheReducer
  const dateDiff = new Date().getTime() - dataCache.tagsLastRefreshed.getTime();
  if (dateDiff / 1000 > 30 || dataCache.tagsSiteId !== siteId) {
    // console.log('fetching all tags for refresh')
    await DocumentsService.getAllTagKeys(siteId).then((response: any) => {
      const allTagData = {
        allTags: response?.values,
        tagsLastRefreshed: new Date(),
        tagsSiteId: siteId
      }
      thunkAPI.dispatch(setAllTags(allTagData))
    })
  }
  if (searchWord) {
    if (searchFolder && searchFolder.length) {
      // NOTE: not yet implemented on backend
      DocumentsService.searchDocumentsInFolder(siteId, tagParam, searchWord, searchFolder, page).then((response: any) => {
        if (response) {
          const data = { documents: response.documents, user: user, page, isLoadingMore: false, isLastSearchPageLoaded: false }
          if(page > 1){
            data.isLoadingMore = true
          }
          if(response.documents?.length === 0){
            data.isLastSearchPageLoaded = true
          }
          thunkAPI.dispatch(setDocuments(data))
        }
      })
    } else {
      const dataCache = (thunkAPI.getState() as any)?.dataCacheReducer
      DocumentsService.searchDocuments(siteId, formkiqVersion, tagParam, searchWord, page, dataCache.allTags).then((response: any) => {
        if (response) {
          const temp: any = []
          response.documents?.forEach((el: IDocument) => {
            if (el.path) {
              // el.insertedDate = moment(el.insertedDate).format('YYYY-MM-DD HH:mm')
              temp.push(el)
            }
          })
          const data = { documents: temp, user: user, page, isLoadingMore: false, isLastSearchPageLoaded: false }
          if(page > 1){
            data.isLoadingMore = true
          }
          if(response.documents?.length === 0){
            data.isLastSearchPageLoaded = true
          }
          thunkAPI.dispatch(setDocuments(data))
        }
      })
    }
  } else {
    if (subfolderUri) {
      if (subfolderUri === 'shared') {
        DocumentsService.getDocumentsSharedWithMe(siteId, tagParam, null, nextToken).then((response: any) => {
          if (response) {
            const data = { documents: response.documents, user: user, tag: filterTag, folder: subfolderUri, next: response.next, isLoadingMore: false, isLastSearchPageLoaded: false }
            if(nextToken){
              data.isLoadingMore = true
            }
            if(response.documents?.length === 0){
              data.isLastSearchPageLoaded = true
            }
            thunkAPI.dispatch(setDocuments(data))
          }
        })
      } else if (subfolderUri === 'favorites') {
        DocumentsService.getDocumentsFavoritedByMe(siteId, tagParam, null, nextToken).then((response: any) => {
          if (response) {
            const data = { documents: response.documents, user: user, tag: filterTag, folder: subfolderUri, next: response.next, isLoadingMore: false, isLastSearchPageLoaded: false }
            if(nextToken){
              data.isLoadingMore = true
            }
            if(response.documents?.length === 0){
              data.isLastSearchPageLoaded = true
            }
            thunkAPI.dispatch(setDocuments(data))
          }
        })
      } else if (subfolderUri === 'deleted') {
        DocumentsService.getDeletedDocuments(siteId, tagParam, null, nextToken).then((response: any) => {
          if (response) {
            const data = { documents: response.documents, user: user, tag: filterTag, folder: subfolderUri, next: response.next, isLoadingMore: false, isLastSearchPageLoaded: false }
            if(nextToken){
              data.isLoadingMore = true
            }
            if(response.documents?.length === 0){
              data.isLastSearchPageLoaded = true
            }
            thunkAPI.dispatch(setDocuments(data))
          }
        })
      } else if (subfolderUri === 'all') {
        DocumentsService.getAllDocuments(siteId, tagParam, null, nextToken).then((response: any) => {
          if (response) {
            const data = { documents: response.documents, user: user, tag: filterTag, folder: subfolderUri, next: response.next, isLoadingMore: false, isLastSearchPageLoaded: false }
            if(nextToken){
              data.isLoadingMore = true
            }
            if(response.documents?.length === 0){
              data.isLastSearchPageLoaded = true
            }
            thunkAPI.dispatch(setDocuments(data))
          }
        })
      } else {
        const dataCache = (thunkAPI.getState() as any)?.dataCacheReducer
        DocumentsService.getDocumentsInFolder(subfolderUri, siteId, tagParam, null, nextToken, 20, dataCache.allTags).then((response: any) => {
          if (response) {
            const data = { documents: response.documents, user: user, tag: filterTag, folder: subfolderUri, next: response.next, isLoadingMore: false, isLastSearchPageLoaded: false }
            if(nextToken){
              data.isLoadingMore = true
            }
            if(response.documents?.length === 0){
              data.isLastSearchPageLoaded = true
            }
            thunkAPI.dispatch(setDocuments(data))
          }
        })
      }
    } else {
      const dataCache = (thunkAPI.getState() as any)?.dataCacheReducer
      DocumentsService.getDocumentsInFolder('', siteId, tagParam, null, nextToken, 20, dataCache.allTags).then((response: any) => {
        if (response) {
          const data = { documents: response.documents, user: user, folder: '', tag: filterTag, next: response.next, isLoadingMore: false }
          if(nextToken){
            data.isLoadingMore = true
          }
          thunkAPI.dispatch(setDocuments(data))
        }
      })
    }
  }
})
export const toggleExpandFolder = createAsyncThunk("documentsList/toggleExpandFolder", async (data: any, thunkAPI) => {
  const {
    folder,
    subfolderUri,
    siteId,
    user
  } : {
    folder: IFolder,
    subfolderUri: string,
    siteId: string,
    user: User
  } = data

  const dataCache = (thunkAPI.getState() as any)?.dataCacheReducer
  const dateDiff = new Date().getTime() - dataCache.tagsLastRefreshed.getTime();
  if (dateDiff / 1000 > 30 || dataCache.tagsSiteId !== siteId) {
    // console.log('fetching all tags for refresh - EXPAND')
    await DocumentsService.getAllTagKeys(siteId).then((response: any) => {
      const allTagData = {
        allTags: response?.values,
        tagsLastRefreshed: new Date(),
        tagsSiteId: siteId
      }
      thunkAPI.dispatch(setAllTags(allTagData))
    })
  }
  const folderPath = subfolderUri
  if(folder.isExpanded) {
    const newValue = { ...folder, isExpanded: false }
    thunkAPI.dispatch(updateFolderValue({folderToUpdate: folder, newValue}))
  } else {
    if (folder.documents?.length > 0 || folder.folders?.length > 0){
      const newValue = { ...folder, isExpanded: true }
      thunkAPI.dispatch(updateFolderValue({folderToUpdate: folder, newValue}))
    } else {
      await DocumentsService.getDocumentsInFolder(folderPath, siteId, null, null, null, 25, dataCache.allTags).then((response: any) => {
        if (response) {
          let insertedDate = ''
          if (folder && folder.insertedDate) {
            insertedDate = folder.insertedDate
          }
          let lastModifiedDate = ''
          if (folder && folder.lastModifiedDate) {
            lastModifiedDate = folder.lastModifiedDate
          }
          const childFolders = response.documents.filter( (val: any) => val.folder === true)
          const childDocs = response.documents.filter( (val: any) => val.folder !== true)
            .filter((val: IDocument) => !(val.tags as any)['sysDeletedBy'])
          const path = folderPath.substring(folderPath.lastIndexOf('/') + 1)
          const newValue: IFolder = {
            ...folder,
            documentId: folder.documentId,
            path,
            insertedDate,
            lastModifiedDate,
            isExpanded: true,
            documents: childDocs,
            folders: childFolders,
            tags: []
          }
          thunkAPI.dispatch(updateFolderValue({folderToUpdate: folder, newValue}))
        }
      })
    }
  }
})
export const fetchDeleteFolder = createAsyncThunk("documentsList/fetchDeleteFolder", async (data: any, thunkAPI) => {
  const {
    user,
    folder
  } : {
    user: User,
    folder: IFolder
  } = data
  DocumentsService.deleteFolder(folder.indexKey).then((response) => {
    if (response.status && response.status === 200) {
      thunkAPI.dispatch(removeFolderFromList({ folderToDelete: folder }))
    } else {
      if (response.message === 'Folder not empty') {
        thunkAPI.dispatch(openNotificationDialog({ dialogTitle: 'This folder is not empty; please note that there may be files from this folder currently stored under "Deleted Documents".'}))
      } else {
        thunkAPI.dispatch(openNotificationDialog({ dialogTitle: response.message}))
      }
    }
  })
})
export const fetchDeleteDocument = createAsyncThunk("documentsList/fetchDeleteDocument", async (data: any, thunkAPI) => {
  const {
    siteId,
    user,
    document,
    documents, 
    isDocumentInfoPage
  } : {
    siteId: string,
    user: User,
    document: IDocument,
    documents: any,
    isDocumentInfoPage: boolean
  } = data
  DocumentsService.addTag(document.documentId, siteId, { key: 'sysDeletedBy', value: user.email}).then((response) => {
    if (documents) {
      thunkAPI.dispatch(addDocumentTag({ doc: document, tagKey: 'sysDeletedBy', valueToAdd: user.email }))
      const newDocs = documents.filter((doc: any) => {
        if (doc.documentId === document.documentId) {
          return false
        } else {
          return true
        }
      })
      thunkAPI.dispatch(updateDocumentsList({ documents: newDocs, user: user, isSystemDeletedByKey: false }))
    } else {
      if (!isDocumentInfoPage) {
        if (document.path.indexOf('/') > -1) {
          const folderPath = document.path.substring(0, document.path.lastIndexOf('/'))
          thunkAPI.dispatch(retrieveAndRefreshFolder({ folderPath: folderPath, document: document, documentAction: 'remove' }))
        }
      }
    }
  })
})
const defaultState = {
  documents: null,
  folders: null,
  nextLoadingStatus: requestStatusTypes.fulfilled,
  nextToken: null,
  currentSearchPage: 1,
  isLastSearchPageLoaded: false
}

export const documentsListSlice = createSlice({
  name: 'documentsList',
  initialState: defaultState,
  reducers: {
    setDocuments: (state, action: any) => {
      if (action.payload) {
        let { 
          documents,
          user, 
          folder,
          /*subfolderUri,*/
          tag,
          next,
          page = 1,
          isLoadingMore = false,
          isLastSearchPageLoaded = false,
        } = action.payload

        if(page > 1) {
          next = null
        } 
        if(next) {
          page = 1
          isLastSearchPageLoaded = false
        }

        if (documents) {
          let folders = documents.filter((doc: any) => {
            return doc.folder
          })
          // format date, filter deleted
          const actualDocuments: IDocument [] = documents.filter((doc: any) => {
            return !doc.folder
          })
          let docsRes = actualDocuments.filter((doc: any) => {
            if (folder && (folder === 'deleted' || folder === 'all')) {
              if (tag) {
                if (tag.indexOf(':') === -1) {
                  type ObjectKey = keyof typeof doc.tags;
                  const tagProperty = tag as ObjectKey;
                  if (doc.tags[tagProperty] !== undefined) {
                    return true
                  } else {
                    return false
                  }
                } else {
                  type ObjectKey = keyof typeof doc.tags;
                  const tagProperty = tag.split(':')[0] as ObjectKey;
                  const tagValues = tag.split(':')[1].split('|')
                  if (doc.tags[tagProperty] !== undefined) {
                    return isTagValueIncludes(doc.tags[tagProperty], tagValues)
                  } else {
                    return false
                  }
                }
              } else {
                return true
              }
            } else if (tag) {
              if (tag.indexOf(':') === -1) {
                type ObjectKey = keyof typeof doc.tags;
                const tagProperty = tag as ObjectKey;
                if (doc.tags[tagProperty] !== undefined) {
                  return !(doc.tags as any)['sysDeletedBy'] || (doc.tags as any)['sysDeletedBy'] !== undefined
                } else {
                  return false
                }
              } else {
                type ObjectKey = keyof typeof doc.tags;
                const tagProperty = tag.split(':')[0] as ObjectKey;
                const tagValues = tag.split(':')[1].split('|')
                if (doc.tags[tagProperty] !== undefined) {
                  if (!(doc.tags as any)['sysDeletedBy'] || (doc.tags as any)['sysDeletedBy'] !== undefined) {
                    return isTagValueIncludes(doc.tags[tagProperty], tagValues)
                  } else {
                    return false
                  }
                } else {
                  return false
                }
              }
            } else {
              return !(doc.tags as any)['sysDeletedBy']
            }
          })
          if (isLoadingMore && state.documents) {
            const docsToAdd: IDocument[] = [];
            (docsRes as IDocument []).forEach((compareDoc) => {
              let inState = false;
              (state.documents as unknown as IDocument []).forEach((stateDoc) => {
                if (stateDoc && stateDoc.path === compareDoc.path) {
                  inState = true;
                }
              })
              if (!inState) {
                docsToAdd.push(compareDoc)
              }
            })
            docsRes = (state.documents as IDocument []).concat(docsToAdd)
          }
          if (isLoadingMore && state.folders) {
            const foldersToAdd: IFolder[] = [];
            (folders as IFolder []).forEach((compareSubfolder) => {
              let inState = false;
              (state.folders as unknown as IFolder []).forEach((stateSubfolder) => {
                if (stateSubfolder && stateSubfolder.path === compareSubfolder.path) {
                  inState = true;
                }
              })
              if (!inState) {
                foldersToAdd.push(compareSubfolder)
              }
            })
            folders = (state.folders as IFolder []).concat(foldersToAdd)
          }
          return {
            ...state,
            nextToken: next,
            documents: docsRes,
            folders,
            nextLoadingStatus: requestStatusTypes.fulfilled as any, // for bottom spiner with scroll loading
            currentSearchPage: page,
            isLastSearchPageLoaded: isLastSearchPageLoaded
          }
        }
      }
      return {
        ...state,
        documents: null
      }
    },
    updateDocumentsList: (state, action) => {
      if (action.payload && state.documents) {
        const { user, documents, isSystemDeletedByKey } = action.payload
        const temp = {
          folders: state.folders,
          documents: documents,
          isSystemDeletedByKey: isSystemDeletedByKey
        }
        const res = excludeDocumentsWithTagFromAll(temp as any, 'sysDeletedBy', '', isSystemDeletedByKey)
        state.folders = res.folders as any
        state.documents = res.documents as any
      }
      return state as any
    },
    removeFolderFromList: (state, action) => {
      const {
        folderToDelete,
      }: { folderToDelete : IFolder } = action.payload
      if (state.folders) {
        const [folder, index, parentFolder] = findFolderAndParent(folderToDelete.documentId, state)
        if(parentFolder?.folders && folder) {
          const newFolders = [...parentFolder.folders]
          newFolders.splice(index, 1)
          parentFolder.folders = newFolders
        }
      }
      return state
    },
    addDocumentTag: (state, action) => {
      if(state.documents) {
        const { doc, tagKey, valueToAdd } = action.payload
        const newTags = addOrCreateTagValue(tagKey, doc?.tags[tagKey], valueToAdd, doc.tags)
        const [document, index, folder] = findParentForDocument(doc.documentId, { ...state })
        if(document && folder){
          const newDocuments: any = [...(folder.documents)] as any []
          newDocuments[index] = { ...document, tags: newTags}
          folder.documents = newDocuments
        }
      }
      return state
    },
    removeDocumentTag: (state, action) => {
      if(state.documents) {
        const { doc, tagKey, valueToRemove } = action.payload
        const newTags = removeTagOrTagValue(tagKey, doc.tags[tagKey], valueToRemove, doc.tags)
        const indexOfFile = ([ ...state.documents ] as any).findIndex((el: IDocument) => doc.documentId === el.documentId)
        const newDocuments: any = [...state.documents] as any []
        newDocuments[indexOfFile] = { ...doc, tags: newTags}
        state.documents = newDocuments
      }
      return state
    },
    updateFolderValue: (state, action) => {
      const {
        folderToUpdate,
        newValue
      }: { folderToUpdate : IFolder, newValue: IFolder} = action.payload
      if (state.folders) {
        if (newValue === null) {
          console.log('update folder failure')
        } else {
          const [folder, index, parentFolder] = findFolderAndParent(folderToUpdate.documentId, state)
          if (parentFolder?.folders && folder) {
            parentFolder.folders[index] = newValue
          }
        }
      }
      return state
    },
    retrieveAndRefreshFolder: (state, action) => {
      const {
        folderPath,
        document,
        documentAction,
        user
      }: { folderPath: string, document: IDocument, documentAction: string, user: User} = action.payload
      let foundFolder: any = folderPath ? null : state
      let fullFolderPath = '';     
      // TODO: determine why state.folders will not work in some cases (such as when current folder is not top-level) 
      if (state.folders) {
        // TODO: create recursive function, for efficiency and allow deeper than five subfolders
        (state.folders as IFolder[]).forEach((folder: IFolder) => {
          if (folder.path === folderPath) {
            foundFolder = folder
          } else if (folder.path === folderPath.substring(0, folderPath.indexOf('/'))) {
            fullFolderPath = folder.path;
            let subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
            (folder.folders as IFolder[]).forEach((subfolder01: IFolder) => {
              if (subfolder01.path === subfoldersPath) {
                foundFolder = subfolder01
                fullFolderPath += '/' + subfolder01.path;
              } else if (subfolder01.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                fullFolderPath += '/' + subfolder01.path;
                subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                (subfolder01.folders as IFolder[]).forEach((subfolder02: IFolder) => {
                  if (subfolder02.path === subfoldersPath) {
                    foundFolder = subfolder02
                    fullFolderPath += '/' + subfolder02.path;
                  } else if (subfolder02.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                    fullFolderPath += '/' + subfolder02.path;
                    subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                    (subfolder02.folders as IFolder[]).forEach((subfolder03: IFolder) => {
                      if (subfolder03.path === subfoldersPath) {
                        foundFolder = subfolder03
                        fullFolderPath += '/' + subfolder03.path;
                      } else if (subfolder03.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                        fullFolderPath += '/' + subfolder03.path;
                        subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                        (subfolder03.folders as IFolder[]).forEach((subfolder04: IFolder) => {
                          if (subfolder04.path === subfoldersPath) {
                            foundFolder = subfolder04
                            fullFolderPath += '/' + subfolder04.path;
                          } else if (subfolder04.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                            fullFolderPath += '/' + subfolder04.path;
                            subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                            (subfolder04.folders as IFolder[]).forEach((subfolder05: IFolder) => {
                              if (subfolder05.path === subfoldersPath) {
                                foundFolder = subfolder05
                                fullFolderPath += '/' + subfolder05.path;
                              } else if (subfolder05.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                                fullFolderPath += '/' + subfolder05.path;
                                subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                                (subfolder05.folders as IFolder[]).forEach((subfolder06: IFolder) => {
                                  if (subfolder06.path === subfoldersPath) {
                                    foundFolder = subfolder06
                                    fullFolderPath += '/' + subfolder06.path;
                                  } else if (subfolder06.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                                    fullFolderPath += '/' + subfolder06.path;
                                    subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                                    (subfolder06.folders as IFolder[]).forEach((subfolder07: IFolder) => {
                                      if (subfolder07.path === subfoldersPath) {
                                        foundFolder = subfolder07
                                        fullFolderPath += '/' + subfolder07.path;
                                      } else if (subfolder07.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                                        fullFolderPath += '/' + subfolder07.path;
                                        subfoldersPath = folderPath.substring(fullFolderPath.length + 1);
                                        (subfolder07.folders as IFolder[]).forEach((subfolder08: IFolder) => {
                                          if (subfolder08.path === subfoldersPath) {
                                            foundFolder = subfolder08
                                            fullFolderPath += '/' + subfolder08.path;
                                          } else if (subfolder08.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                                            (subfolder08.folders as IFolder[]).forEach((subfolder09: IFolder) => {
                                              if (subfolder09.path === subfoldersPath) {
                                                foundFolder = subfolder09
                                                fullFolderPath += '/' + subfolder09.path;
                                              } else if (subfolder09.path === subfoldersPath.substring(0, subfoldersPath.indexOf('/'))) {
                                                (subfolder09.folders as IFolder[]).forEach((subfolder10: IFolder) => {
                                                  if (subfolder10.path === subfoldersPath) {
                                                    foundFolder = subfolder10
                                                    fullFolderPath += '/' + subfolder10.path;
                                                  }
                                                })
                                              }
                                            })
                                          }
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      if (foundFolder) {
        if (document) {
          if (documentAction === 'add') {
            if (foundFolder.documents) {
              foundFolder.documents.push(document)
              foundFolder.documents = foundFolder.documents.sort((a: any, b: any) => (a.path > b.path) ? 1 : -1)
            }
            const newValue = { ...foundFolder}
            updateFolderValue({folderToUpdate: foundFolder, newValue})
          } else if (documentAction === 'remove') {
            const index = foundFolder.documents?.indexOf(document);
            if (index > -1) {
              foundFolder.documents.splice(index, 1)
            } else {
              foundFolder.documents.forEach((doc: any, i: number) => {
                if (doc.documentId === document.documentId) {
                  foundFolder.documents.splice(i, 1)
                }
              })
            }
            const newValue = { ...foundFolder}
            updateFolderValue({folderToUpdate: foundFolder, newValue})
          }
        }
      } else {
        // TODO: replace with proper alternative to "found folder"
        window.location.reload()
      }
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchDocuments.pending, (state, action) => {
      return {
        ...state,
        nextLoadingStatus: requestStatusTypes.pending
      }
    })
  },
})

export const {
  setDocuments,
  addDocumentTag, 
  removeDocumentTag, 
  updateDocumentsList,
  updateFolderValue,
  retrieveAndRefreshFolder,
  removeFolderFromList
} = documentsListSlice.actions

export default documentsListSlice.reducer