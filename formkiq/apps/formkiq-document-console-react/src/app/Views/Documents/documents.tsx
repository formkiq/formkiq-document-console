import { Dialog } from '@headlessui/react';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import AllTagsPopover from '../../Components/DocumentsAndFolders/AllTagsPopover/allTagsPopover';
import { useDocumentActions } from '../../Components/DocumentsAndFolders/DocumentActionsPopover/DocumentActionsContext';
import DocumentActionsPopover from '../../Components/DocumentsAndFolders/DocumentActionsPopover/documentActionsPopover';
import FolderDropWrapper from '../../Components/DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import NewModal from '../../Components/DocumentsAndFolders/NewModal/newModal';
import AdvancedSearchTab from '../../Components/DocumentsAndFolders/Search/advancedSearchTab';
import UploadModal from '../../Components/DocumentsAndFolders/UploadModal/uploadModal';
import ButtonGhost from '../../Components/Generic/Buttons/ButtonGhost';
import ButtonPrimary from '../../Components/Generic/Buttons/ButtonPrimary';
import ButtonPrimaryGradient from '../../Components/Generic/Buttons/ButtonPrimaryGradient';
import ButtonSecondary from '../../Components/Generic/Buttons/ButtonSecondary';
import ButtonTertiary from '../../Components/Generic/Buttons/ButtonTertiary';
import { CopyButton } from '../../Components/Generic/Buttons/CopyButton';
import QuantityButton from '../../Components/Generic/Buttons/QuantityButton';
import {
  ChevronRight,
  Close,
  Download,
  Edit,
  FolderOutline,
  Pencil,
  Retry,
  Spinner,
  Tag,
  Trash,
  Undo,
  View,
} from '../../Components/Icons/icons';
import {
  AttributesState,
  fetchDocumentAttributes,
} from '../../Store/reducers/attributes';
import { AttributesDataState } from '../../Store/reducers/attributesData';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import {
  ConfigState,
  setCurrentActionEvent,
  setPendingArchive,
} from '../../Store/reducers/config';
import { setCurrentDocumentPath } from '../../Store/reducers/data';
import {
  deleteDocument,
  DocumentListState,
  fetchDeleteFolder,
  fetchDocuments,
  setDocumentLoadingStatusPending,
  setDocuments,
  updateDocumentsList,
} from '../../Store/reducers/documentsList';
import { openDialog } from '../../Store/reducers/globalConfirmControls';
import { fetchQueues, QueuesState } from '../../Store/reducers/queues';
import {
  fetchUsers,
  UserManagementState,
} from '../../Store/reducers/userManagement';
import { fetchWorkflows, WorkflowsState } from '../../Store/reducers/workflows';
import { useAppDispatch } from '../../Store/store';
import {
  InlineEditableContentTypes,
  InlineViewableContentTypes,
  OnlyOfficeContentTypes,
  TextFileEditorEditableContentTypes,
  TextFileEditorViewableContentTypes,
} from '../../helpers/constants/contentTypes';
import { TopLevelFolders } from '../../helpers/constants/folders';
import { TagsForFilterAndDisplay } from '../../helpers/constants/primaryTags';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  formatDate,
  getCurrentSiteInfo,
  getFileIcon,
  getUserSites,
  transformRelationshipValueFromString,
} from '../../helpers/services/toolService';
import { Attribute, RelationshipType } from '../../helpers/types/attributes';
import { IDocument, RequestStatus } from '../../helpers/types/document';
import { IDocumentTag } from '../../helpers/types/documentTag';
import { IFolder } from '../../helpers/types/folder';
import { ILine } from '../../helpers/types/line';
import { Queue } from '../../helpers/types/queues';
import { User } from '../../helpers/types/userManagement';
import { WorkflowSummary } from '../../helpers/types/workflows';
import { useQueueId } from '../../hooks/queue-id.hook';
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import { DocumentsTable } from './documentsTable';

function Documents() {
  const documentsWrapperRef = useRef(null);
  const documentsScrollpaneRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthenticatedState();
  const {
    documents,
    nextToken,
    loadingStatus,
    currentSearchPage,
    isLastSearchPageLoaded,
  } = useSelector(DocumentListState);
  const {
    currentActionEvent,
    formkiqVersion,
    tagColors,
    useIndividualSharing,
    useFileFilter,
    useCollections,
    useSoftDelete,
    pendingArchive,
  } = useSelector(ConfigState);
  const { workflows } = useSelector(WorkflowsState);
  const { queues } = useSelector(QueuesState);
  const { users } = useSelector(UserManagementState);
  const { allTags, allAttributes } = useSelector(AttributesDataState);
  const { documentAttributes } = useSelector(AttributesState);
  const subfolderUri = useSubfolderUri();
  const queueId = useQueueId();
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const searchWord = new URLSearchParams(search).get('searchWord');
  const searchFolder = new URLSearchParams(search).get('searchFolder');
  const filterTag = new URLSearchParams(search).get('filterTag');
  const filterAttribute = new URLSearchParams(search).get('filterAttribute');
  const actionEvent = new URLSearchParams(search).get('actionEvent');
  const advancedSearch = new URLSearchParams(search).get('advancedSearch');
  const { hash } = useLocation();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {
    siteId,
    siteRedirectUrl,
    siteDocumentsRootUri,
    siteDocumentsRootName,
    isSiteReadOnly,
  } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );

  const {
    onDocumentVersionsModalClick,
    onDocumentWorkflowsModalClick,
    onEditAttributesModalClick,
    onAttributeQuantityClick,
    onDocumentRelationshipsModalClick,
  } = useDocumentActions();

  useEffect(() => {
    if (siteRedirectUrl.length) {
      navigate(
        {
          pathname: `${siteRedirectUrl}`,
        },
        {
          replace: true,
        }
      );
    }
  }, [siteRedirectUrl, navigate]);

  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] =
    useState(siteDocumentsRootUri);
  const [isCurrentSiteReadonly, setIsCurrentSiteReadonly] =
    useState<boolean>(isSiteReadOnly);
  const [isTagFilterExpanded, setIsTagFilterExpanded] = useState(false);
  const [isArchiveTabExpanded, setIsArchiveTabExpanded] = useState(false);
  const [infoDocumentId, setInfoDocumentId] = useState('');
  const [infoDocumentView, setInfoDocumentView] = useState('info');
  const [infoDocumentAction, setInfoDocumentAction] = useState('');
  // NOTE: not fully implemented;
  // using the edit metadata modal for now, to be replaced with new system to indicate diff between tag, metadata, and versioned metadata
  // const [infoMetadataEditMode, setInfoMetadataEditMode] = useState(false);
  const [currentDocument, setCurrentDocument]: [IDocument | null, any] =
    useState(null);
  const [currentDocumentTags, setCurrentDocumentTags]: [
    IDocumentTag[] | null,
    any
  ] = useState([]);
  const [currentDocumentVersions, setCurrentDocumentVersions] = useState(null);
  const [currentDocumentActions, setCurrentDocumentActions] = useState<any[]>(
    []
  );
  const [isCurrentDocumentSoftDeleted, setIsCurrentDocumentSoftDeleted] =
    useState(false);
  const [isUploadModalOpened, setUploadModalOpened] = useState(false);
  const [isFolderUploadModalOpened, setFolderUploadModalOpened] =
    useState(false);
  const [uploadModalDocumentId, setUploadModalDocumentId] = useState('');
  const [folderUploadModalDocumentId, setFolderUploadModalDocumentId] =
    useState('');
  const [newModalValue, setNewModalValue] = useState<ILine | null>(null);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const dispatch = useAppDispatch();
  const [sortedAttributesAndTags, setSortedAttributesAndTags] = useState<any[]>(
    []
  );
  const [dropUploadDocuments, setDropUploadDocuments] = useState<any>(null);
  const [dropFolderPath, setDropFolderPath] = useState<any>(null);
  const documentsPageWrapper = document.getElementById('documentsPageWrapper');
  const closeDropZoneRef = useRef(null);
  const [isDropZoneVisible, setIsDropZoneVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const [relationshipDocumentsMap, setRelationshipDocumentsMap] = useState<{
    [key: string]: string;
  }>({});
  const [relationships, setRelationships] = useState<
    {
      relationship: RelationshipType;
      documentId: string;
    }[]
  >([]);

  function handleDragEnter(event: any) {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.stopPropagation();
    setIsDropZoneVisible(true);
  }

  function handleDrop(event: any) {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    if (event.dataTransfer.files.length === 0) return;
    setIsDropZoneVisible(false);
    const folder = event.target.closest('.folder-drop-wrapper');
    if (folder) {
      const folderPath = folder.getAttribute('data-folder-path');
      setDropFolderPath(folderPath);
    }
    setDropUploadDocuments(event.dataTransfer.files);
    onUploadClick(event, '');
  }

  useEffect(() => {
    const handleDragOver = (event: any) => {
      if (!event.dataTransfer?.types.includes('Files')) return;
      event.preventDefault();
    };
    documentsPageWrapper?.addEventListener('dragover', function (event) {
      handleDragOver(event);
    });

    documentsPageWrapper?.addEventListener('drop', function (event) {
      handleDrop(event);
    });

    return () => {
      documentsPageWrapper?.removeEventListener('dragover', function (event) {
        handleDragOver(event);
      });
      documentsPageWrapper?.removeEventListener('drop', function (event) {
        handleDrop(event);
      });
    };
  }, [documentsPageWrapper]);

  function resetDropUploadDocuments() {
    setDropUploadDocuments(null);
    setDropFolderPath(null);
  }

  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 600 > el.scrollHeight;
      }
      return false;
    };
    const scrollpane = document.getElementById('documentsScrollpane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      nextToken &&
      loadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setDocumentLoadingStatusPending());
      if (nextToken) {
        await dispatch(
          fetchDocuments({
            siteId: currentSiteId,
            formkiqVersion: formkiqVersion,
            searchWord,
            searchFolder,
            subfolderUri,
            queueId,
            filterTag,
            filterAttribute,
            nextToken,
            page: currentSearchPage + 1,
          })
        );
      } else {
        if (!isLastSearchPageLoaded && searchWord) {
          await dispatch(
            fetchDocuments({
              // for next page results
              siteId: currentSiteId,
              formkiqVersion: formkiqVersion,
              searchWord,
              searchFolder,
              subfolderUri,
              queueId,
              filterTag,
              filterAttribute,
              page: currentSearchPage + 1,
            })
          );
        }
      }
    }
  }, [nextToken, loadingStatus, currentSearchPage, isLastSearchPageLoaded]);

  function onDocumentInfoClick() {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentById(infoDocumentId, currentSiteId).then(
        (response: any) => {
          setCurrentDocument(response);
          // TODO: set folder to selected document path?
          updateTags();
          updateDocumentActions();
          // close history tab if deeplink file
          if (
            infoDocumentView === 'history' &&
            response.deepLinkPath?.length > 0
          ) {
            setInfoDocumentView('info');
          }
          // CHECK FOR MODAL ACTION
          if (infoDocumentAction.length) {
            switch (infoDocumentAction) {
              case 'attributes':
                onEditAttributesModalClick(null, {
                  lineType: 'document',
                  folder: subfolderUri,
                  documentId: (response as IDocument).documentId,
                  documentInstance: response as IDocument,
                  folderInstance: null,
                });
                break;
              case 'submitForReview':
                /*
                onSubmitForReviewModalClick(null, {
                  lineType: 'document',
                  folder: subfolderUri,
                  documentId: (response as IDocument).documentId,
                  documentInstance: response as IDocument,
                  folderInstance: null,
                });
                */
                break;
              case 'reviewDocument':
                /*
                onDocumentReviewModalClick(null, {
                  lineType: 'document',
                  folder: subfolderUri,
                  documentId: (response as IDocument).documentId,
                  documentInstance: response as IDocument,
                  folderInstance: null,
                });
                */
                break;
            }
            setInfoDocumentAction('');
          }
        }
      );
    }
    dispatch(setCurrentDocumentPath(''));
    dispatch(
      fetchDocumentAttributes({
        siteId: currentSiteId,
        documentId: infoDocumentId,
        limit: 100,
        page: 1,
        nextToken: null,
      })
    );
  }

  const getDocumentNameFromDocuments = (documentId: string) => {
    const doc = documents.find(
      (document) => document.documentId === documentId
    );
    if (doc) return doc.path.substring(doc.path.lastIndexOf('/') + 1);
    return null;
  };

  // update document relationships
  useEffect(() => {
    const relationshipsAttribute = documentAttributes.find(
      (attribute) => attribute.key === 'Relationships'
    );
    if (!relationshipsAttribute) {
      setRelationships([]);
      return;
    }
    const newRelationships: {
      relationship: RelationshipType;
      documentId: string;
    }[] = [];
    if (relationshipsAttribute.stringValue) {
      newRelationships.push(
        transformRelationshipValueFromString(relationshipsAttribute.stringValue)
      );
    } else if (relationshipsAttribute.stringValues) {
      newRelationships.push(
        ...relationshipsAttribute.stringValues.map((val) =>
          transformRelationshipValueFromString(val)
        )
      );
    }

    setRelationships(newRelationships);
    for (const relationship of newRelationships) {
      if (relationshipDocumentsMap[relationship.documentId]) return;
      const documentName = getDocumentNameFromDocuments(
        relationship.documentId
      );
      if (documentName) {
        setRelationshipDocumentsMap((prev) => ({
          ...prev,
          [relationship.documentId]: documentName,
        }));
      } else {
        DocumentsService.getDocumentById(
          relationship.documentId,
          currentSiteId
        ).then((response: any) => {
          if (response.status === 200) {
            setRelationshipDocumentsMap((prev) => ({
              ...prev,
              [relationship.documentId]: response.path.substring(
                response.path.lastIndexOf('/') + 1
              ),
            }));
          } else {
            setRelationshipDocumentsMap((prev) => ({
              ...prev,
              [relationship.documentId]: 'NOT_FOUND',
            }));
          }
        });
      }
    }
  }, [documentAttributes]);

  useEffect(() => {
    onDocumentInfoClick();
  }, [infoDocumentId]);

  useEffect(() => {
    if (user.isAdmin) {
      dispatch(fetchUsers({ limit: 100, page: 1 }));
    }
  }, []);

  useEffect(() => {
    if (documentAttributes.length === 0 && currentDocumentTags) {
      setSortedAttributesAndTags([]);
      return;
    }
    const sortedDocumentAttributesAndTags = [
      ...currentDocumentTags,
      ...documentAttributes,
    ];
    sortedDocumentAttributesAndTags.sort((a, b) => a.key.localeCompare(b.key));
    setSortedAttributesAndTags(sortedDocumentAttributesAndTags);
  }, [documentAttributes, currentDocumentTags]);

  useEffect(() => {
    if (hash.indexOf('#id=') > -1) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const id = hashParams.get('id');
      const action = hashParams.get('action');
      if (id) {
        setInfoDocumentId(id);
      } else {
        setInfoDocumentId(''); // Handle case where id might be null
      }
      if (action) {
        setInfoDocumentAction(action);
        if (action === 'history') {
          setInfoDocumentView('history');
        }
      } else {
        setInfoDocumentAction('');
      }
    } else {
      setInfoDocumentId('');
    }
  }, [hash]);

  useEffect(() => {
    if (currentActionEvent && currentActionEvent.length) {
      switch (currentActionEvent) {
        case 'upload':
          onUploadClick({}, '');
          break;
        case 'new':
          onNewClick(
            {},
            {
              lineType: 'folder',
              folder: subfolderUri,
              documentId: '',
              documentInstance: null,
              folderInstance: null,
            }
          );
          break;
        case 'folderUpload':
          onFolderUploadClick({});
          break;
      }
    } else if (actionEvent && actionEvent.length > 0) {
      switch (actionEvent) {
        case 'upload':
          if (currentDocument) {
            onUploadClick({}, (currentDocument as IDocument).documentId);
          } else {
            onUploadClick({}, '');
          }
          break;
        case 'new':
          onNewClick(
            {},
            {
              lineType: 'folder',
              folder: subfolderUri,
              documentId: '',
              documentInstance: null,
              folderInstance: null,
            }
          );
          break;
        case 'folderUpload':
          onFolderUploadClick({});
          break;
      }
    }
  }, [currentActionEvent, actionEvent]);

  const updateTags = () => {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentTags(infoDocumentId, currentSiteId).then(
        (response: any) => {
          if (response) {
            let isDeleted = false;
            setCurrentDocumentTags(
              response.tags?.map((el: IDocumentTag) => {
                el.insertedDate = moment(el.insertedDate).format(
                  'YYYY-MM-DD HH:mm'
                );
                if (el.key === 'sysDeletedBy') {
                  isDeleted = true;
                }
                return el;
              })
            );
            setIsCurrentDocumentSoftDeleted(isDeleted);
          }
        }
      );
      if (formkiqVersion.type !== 'core') {
        DocumentsService.getDocumentVersions(
          infoDocumentId,
          currentSiteId
        ).then((response: any) => {
          if (response) {
            setCurrentDocumentVersions(response.documents);
          }
        });
      }
    }
  };

  const updateDocumentActions = () => {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentActions(infoDocumentId, currentSiteId).then(
        (response: any) => {
          if (response.status === 200) {
            const actions = [...response.actions];
            let isWorkflowsUpToDate = true;
            let isQueuesUpToDate = true;
            const addWorkflowNames = () => {
              actions.forEach((action: any) => {
                if (action.workflowId) {
                  const workflowName = workflows.find(
                    (workflow: WorkflowSummary) =>
                      workflow.workflowId === action.workflowId
                  )?.name;
                  if (!workflowName) {
                    isWorkflowsUpToDate = false;
                  } else {
                    action.workflowName = workflowName;
                  }
                }
              });
            };
            const addQueueNames = () => {
              actions.forEach((action: any) => {
                if (action.queueId) {
                  const queueName = queues.find(
                    (queue: Queue) => queue.queueId === action.queueId
                  )?.name;
                  if (!queueName) {
                    isQueuesUpToDate = false;
                  } else {
                    action.queueName = queueName;
                  }
                }
              });
            };
            const addUserEmails = () => {
              actions.forEach((action: any) => {
                if (action.userId) {
                  const userEmail = users.find(
                    (user: User) => user.username === action.userId
                  )?.email;
                  action.userEmail = userEmail;
                }
              });
            };
            addWorkflowNames();
            addQueueNames();
            if (user.isAdmin && users?.length) {
              addUserEmails();
            }

            // re-fetch workflows and queues only if new IDs appeared
            if (!isWorkflowsUpToDate || !isQueuesUpToDate) {
              if (!isWorkflowsUpToDate) {
                dispatch(
                  fetchWorkflows({
                    siteId: currentSiteId,
                    limit: 100,
                    page: 1,
                    nextToken: null,
                  })
                );
              }
              if (!isQueuesUpToDate) {
                dispatch(
                  fetchQueues({
                    siteId: currentSiteId,
                    limit: 100,
                    page: 1,
                    nextToken: null,
                  })
                );
              }
              setTimeout(() => {
                addWorkflowNames();
                addQueueNames();
                setCurrentDocumentActions(actions);
              }, 500);
            } else {
              setCurrentDocumentActions(actions);
            }
          }
        }
      );
    }
  };

  function retryFailedActions() {
    DocumentsService.retryDocumentActions(currentSiteId, infoDocumentId).then(
      (response: any) => {
        if (response.status === 200) {
          updateDocumentActions();
        } else if (response.status === 400) {
          dispatch(
            openDialog({
              dialogTitle: response.errors[0].error,
            })
          );
        } else {
          dispatch(
            openDialog({
              dialogTitle: 'Something went wrong. Please try again later.',
            })
          );
        }
      }
    );
  }

  // update document actions every 5 seconds
  useEffect(() => {
    if (infoDocumentId && infoDocumentView === 'actions') {
      const interval = setInterval(updateDocumentActions, 5000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [infoDocumentId, infoDocumentView, currentSiteId]);

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(
      pathname,
      user,
      hasUserSite,
      hasDefaultSite,
      hasWorkspaces,
      workspaceSites
    );
    if (recheckSiteInfo.siteRedirectUrl.length) {
      navigate(
        {
          pathname: `${recheckSiteInfo.siteRedirectUrl}`,
        },
        {
          replace: true,
        }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId);
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri);
    setSelectedDocuments([]);
    setIsCurrentSiteReadonly(recheckSiteInfo.isSiteReadOnly);
  }, [pathname]);

  useEffect(() => {
    dispatch(setDocumentLoadingStatusPending());
    dispatch(
      fetchDocuments({
        siteId: currentSiteId,
        formkiqVersion,
        searchWord,
        searchFolder,
        subfolderUri,
        queueId,
        filterTag,
        filterAttribute,
      })
    );
  }, [
    currentSiteId,
    dispatch,
    searchWord,
    searchFolder,
    subfolderUri,
    queueId,
    filterTag,
    filterAttribute,
    formkiqVersion,
  ]);

  const deleteFunc = async (id: string, softDelete: boolean) => {
    const res: any = await dispatch(
      deleteDocument({
        siteId: currentSiteId,
        user,
        documentId: id,
        softDelete,
      })
    );
    if (res.error) {
      dispatch(
        openDialog({
          dialogTitle: res.error.message,
        })
      );
      return;
    }
    setSelectedDocuments((docs) => docs.filter((doc: any) => doc !== id));
  };

  const onDeleteDocument = (id: string, softDelete: boolean) => {
    const dialogTitle = softDelete
      ? 'Are you sure you want to delete this document?'
      : 'Are you sure you want to delete this document permanently?';
    dispatch(
      openDialog({
        callback: () => deleteFunc(id, softDelete),
        dialogTitle,
      })
    );
  };

  const onDeleteSelectedDocuments = (softDelete: boolean) => {
    function deleteMultipleDocuments(
      documentIds: string[],
      softDelete: boolean
    ) {
      documentIds.forEach((id: string) => {
        deleteFunc(id, softDelete);
      });
    }

    dispatch(
      openDialog({
        callback: () => deleteMultipleDocuments(selectedDocuments, softDelete),
        dialogTitle: `Are you sure you want to delete ${
          selectedDocuments.length
        } selected document${selectedDocuments.length === 1 ? '' : 's'}${
          softDelete ? '' : ' permanently'
        }?`,
      })
    );
  };

  const deleteFolder = (folder: IFolder | IDocument) => () => {
    const deleteFunc = () => {
      dispatch(fetchDeleteFolder({ folder, siteId }));
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this folder?',
      })
    );
  };
  const restoreDocument = (documentId: string) => {
    DocumentsService.restoreDocument(currentSiteId, documentId).then((res) => {
      if (res.status !== 200) {
        dispatch(
          openDialog({
            dialogTitle: 'Error restoring document. Please try again later.',
          })
        );
        return;
      }
      let newDocs = null;
      if (documents) {
        newDocs = documents.filter((doc: any) => {
          return doc.documentId !== documentId;
        });
      }
      dispatch(
        updateDocumentsList({
          documents: newDocs,
          user: user,
        })
      );
      setSelectedDocuments((docs) =>
        docs.filter((doc: any) => doc !== documentId)
      );
    });
  };

  const onRestoreSelectedDocuments = async () => {
    await selectedDocuments.forEach((id: string) => {
      restoreDocument(id);
    });
  };

  const onTagDelete = (tagKey: string) => {
    if (infoDocumentId.length) {
      const deleteFunc = () => {
        updateTags();
        DocumentsService.deleteDocumentTag(
          infoDocumentId,
          currentSiteId,
          tagKey
        ).then(() => {
          updateTags();
        });
        setTimeout(() => {
          onDocumentDataChange(null, null);
        }, 500);
      };
      dispatch(
        openDialog({
          callback: deleteFunc,
          dialogTitle: 'Are you sure you want to delete this tag?',
        })
      );
    }
  };

  const onUploadClick = (event: any, documentId: string) => {
    dispatch(setCurrentActionEvent(''));
    setUploadModalOpened(true);
    setUploadModalDocumentId(documentId);
  };
  const onUploadClose = () => {
    setUploadModalOpened(false);
  };
  const onFolderUploadClick = (event: any) => {
    dispatch(setCurrentActionEvent(''));
    setFolderUploadModalOpened(true);
    setFolderUploadModalDocumentId('');
  };
  const onFolderUploadClose = () => {
    setFolderUploadModalOpened(false);
  };

  const onDocumentDataChange = (event: any, value: ILine | null) => {
    dispatch(setDocuments({ documents: null }));
    dispatch(
      fetchDocuments({
        siteId: currentSiteId,
        formkiqVersion,
        searchWord,
        searchFolder,
        queueId,
        subfolderUri,
        filterTag,
        filterAttribute,
      })
    );
  };
  const onNewClick = (event: any, value: ILine | null) => {
    dispatch(setCurrentActionEvent(''));
    if (TopLevelFolders.indexOf(subfolderUri) !== -1) {
      // TODO: add redirect or messaging of location of new file, as it won't be in the TopLevelFolder
      value = {
        lineType: 'folder',
        folder: '',
        documentId: '',
        documentInstance: null,
        folderInstance: null,
      };
    }
    setNewModalValue(value);
    setNewModalOpened(true);
  };
  const onNewClose = () => {
    setNewModalOpened(false);
  };

  const DownloadDocument = () => {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentUrl(
        infoDocumentId,
        currentSiteId,
        '',
        false
      ).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  };
  const viewDocument = () => {
    if (infoDocumentId.length) {
      navigate(`${currentDocumentsRootUri}/${infoDocumentId}/view`);
    }
  };

  const editDocument = () => {
    if (infoDocumentId.length) {
      navigate(`${currentDocumentsRootUri}/${infoDocumentId}/edit`);
    }
  };

  const onFilterTag = (event: any, tag: string) => {
    if (filterTag === tag || filterAttribute === tag) {
      if (subfolderUri && subfolderUri.length) {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}/folders/${subfolderUri}`,
          },
          {
            replace: true,
          }
        );
      } else {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}`,
          },
          {
            replace: true,
          }
        );
      }
    } else {
      if (subfolderUri && subfolderUri.length) {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}/folders/${subfolderUri}`,
            search: `?filterTag=${tag}`,
          },
          {
            replace: true,
          }
        );
      } else {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}`,
            search: `?filterTag=${tag}`,
          },
          {
            replace: true,
          }
        );
      }
    }
  };

  const onFilterAttribute = (event: any, attribute: string) => {
    if (filterAttribute === attribute || filterTag === attribute) {
      if (subfolderUri && subfolderUri.length) {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}/folders/${subfolderUri}`,
          },
          {
            replace: true,
          }
        );
      } else {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}`,
          },
          {
            replace: true,
          }
        );
      }
    } else {
      if (subfolderUri && subfolderUri.length) {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}/folders/${subfolderUri}`,
            search: `?filterAttribute=${attribute}`,
          },
          {
            replace: true,
          }
        );
      } else {
        navigate(
          {
            pathname: `${currentDocumentsRootUri}`,
            search: `?filterAttribute=${attribute}`,
          },
          {
            replace: true,
          }
        );
      }
    }
  };

  const expandAdvancedSearch = () => {
    searchParams.set('advancedSearch', 'visible');
    navigate(
      {
        pathname:
          pathname +
          '?' +
          searchParams.toString() +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      {
        replace: true,
      }
    );
  };

  const minimizeAdvancedSearch = () => {
    searchParams.set('advancedSearch', 'hidden');
    navigate(
      {
        pathname:
          pathname +
          '?' +
          searchParams.toString() +
          (infoDocumentId.length > 0 ? `#id=${infoDocumentId}` : ''),
      },
      {
        replace: true,
      }
    );
  };

  const foldersPath = (uri: string) => {
    if (uri) {
      const folderLevels = uri.split('/');
      if (folderLevels.length > 3) {
        const previousFolderLevel = uri.substring(0, uri.lastIndexOf('/'));
        return (
          <span className={'flex pl-4 py-2 text-neutral-900 text-sm bg-white'}>
            <span className="pr-1">
              <Link
                to={`${currentDocumentsRootUri}`}
                className="text-primary-500 hover:text-primary-600"
              >
                {siteDocumentsRootName.replace('Workspace: ', '')}:
              </Link>
            </span>
            <p className={'flex px-1'}> / </p>
            <FolderDropWrapper
              folder={folderLevels[0]}
              sourceSiteId={currentSiteId}
              targetSiteId={currentSiteId}
              className={'flex items-start'}
            >
              <Link
                to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}
              >
                {folderLevels[0]}
              </Link>
            </FolderDropWrapper>
            <p className={'flex px-1'}> / </p>
            <span>..</span>
            <p className={'flex px-1'}> / </p>
            <FolderDropWrapper
              folder={previousFolderLevel}
              sourceSiteId={currentSiteId}
              targetSiteId={currentSiteId}
              className={'flex items-start'}
            >
              <Link
                to={
                  `${currentDocumentsRootUri}/folders/` +
                  uri.replace('/' + folderLevels[folderLevels.length - 1], '/')
                }
              >
                {folderLevels[folderLevels.length - 2]}
              </Link>
            </FolderDropWrapper>
            <p className={'flex px-1'}> / </p>
            <span className={'flex items-center mt-1 mr-1.5 w-4'}>
              <FolderOutline />
            </span>
            <span>{folderLevels[folderLevels.length - 1]}</span>
          </span>
        );
      } else {
        return (
          <span className={'flex pl-4 py-2 text-neutral-900 text-sm bg-white'}>
            <span className="pr-1">
              <Link
                to={`${currentDocumentsRootUri}`}
                className="text-primary-500 hover:text-primary-600 text-sm font-bold"
              >
                {siteDocumentsRootName.replace('Workspace: ', '')}:
              </Link>
            </span>
            {folderLevels.length > 1 && (
              <>
                <p className={'flex px-1'}> / </p>
                <FolderDropWrapper
                  folder={folderLevels[0]}
                  sourceSiteId={currentSiteId}
                  targetSiteId={currentSiteId}
                  className={'flex items-start'}
                >
                  <Link
                    to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}
                    className="hover:text-primary-600"
                  >
                    {folderLevels[0]}
                  </Link>
                </FolderDropWrapper>
              </>
            )}
            {folderLevels.length > 2 && (
              <>
                <p className={'flex px-1'}> / </p>
                <FolderDropWrapper
                  folder={folderLevels[0] + '/' + folderLevels[1]}
                  sourceSiteId={currentSiteId}
                  targetSiteId={currentSiteId}
                  className={'flex items-start'}
                >
                  <Link
                    to={
                      `${currentDocumentsRootUri}/folders/` +
                      folderLevels[0] +
                      '/' +
                      folderLevels[folderLevels.length - 2]
                    }
                    className="hover:text-primary-600"
                  >
                    {folderLevels[folderLevels.length - 2]}
                  </Link>
                </FolderDropWrapper>
              </>
            )}
            <p className={'flex px-1'}> / </p>
            <FolderDropWrapper
              folder={uri}
              sourceSiteId={currentSiteId}
              targetSiteId={currentSiteId}
              className={'flex items-start'}
            >
              <span className={'flex items-center mt-1 mr-1.5 w-4'}>
                <FolderOutline />
              </span>
              <span>{folderLevels[folderLevels.length - 1]}</span>
            </FolderDropWrapper>
          </span>
        );
      }
    }
    return (
      <span className={'hidden flex pl-4 py-2 text-gray-500 bg-white'}>
        <span className="pr-1">
          {siteDocumentsRootName.replace('Workspace: ', '')}
        </span>
      </span>
    );
  };

  const filtersAndTags = () => {
    let tagsToCheck: string[] = [];
    let showAllTagsPopover = true;
    const minTagsToShowForFilter = 3;
    tagsToCheck = tagsToCheck.concat(TagsForFilterAndDisplay);

    const keyOnlyAttributes = allAttributes.filter(
      (attribute: Attribute) => attribute.dataType === 'KEY_ONLY'
    );
    const keyOnlyAttributesKeys: { value: string }[] = [];
    if (keyOnlyAttributes.length > 0) {
      keyOnlyAttributes.forEach((attribute: Attribute) => {
        keyOnlyAttributesKeys.push({ value: attribute.key });
      });
    }

    if (
      filterTag &&
      filterTag.length &&
      tagsToCheck.indexOf(filterTag) === -1
    ) {
      tagsToCheck.push(filterTag);
    }

    if (
      filterAttribute &&
      filterAttribute.length &&
      tagsToCheck.indexOf(filterAttribute) === -1
    ) {
      tagsToCheck.push(filterAttribute);
    }

    if (tagsToCheck.length === 0) {
      const tagsToConsider = allTags.filter((tag: any) => {
        return (
          tag.value.indexOf('sys') !== 0 &&
          tag.value.indexOf('path') &&
          tag.value.indexOf('untagged') !== 0
        );
      });
      tagsToConsider.unshift(...keyOnlyAttributesKeys);
      const numberOfTagsToAdd =
        tagsToConsider.length > minTagsToShowForFilter
          ? minTagsToShowForFilter
          : tagsToConsider.length;
      if (numberOfTagsToAdd < minTagsToShowForFilter) {
        showAllTagsPopover = false;
      }
      for (let i = 0; i < numberOfTagsToAdd; i++) {
        tagsToCheck.push(tagsToConsider[i].value);
      }
    }

    const onFilter = (event: any, value: string, index: number) => {
      if (!keyOnlyAttributesKeys || keyOnlyAttributesKeys.length === 0)
        onFilterTag(event, value);
      if (index < keyOnlyAttributesKeys.length) onFilterAttribute(event, value);
    };

    return (
      <div className="flex items-center justify-start">
        <div className="w-1/3 pl-4">
          {useFileFilter && (
            <>
              <span className="font-medium text-sm text-gray-500 pr-4">
                Filter:
              </span>
              <select className="font-medium text-sm">
                <option>All Files</option>
              </select>
            </>
          )}
        </div>
        <div className="w-2/3 flex items-center justify-end">
          {tagsToCheck.length ? (
            <>
              <ul className="flex flex-wrap justify-end mt-1">
                {tagsToCheck.map((primaryTag, i) => {
                  let tagColor = 'gray';
                  if (tagColors) {
                    tagColors.forEach((color: any) => {
                      if (color.tagKeys.indexOf(primaryTag) > -1) {
                        tagColor = color.colorUri;
                        return;
                      }
                    });
                  }
                  return (
                    <li
                      key={i}
                      className={
                        (filterTag === primaryTag ||
                        filterAttribute === primaryTag
                          ? 'bg-primary-500 text-white'
                          : `bg-${tagColor}-200 text-black`) +
                        ' text-xs p-1 px-2 mx-1 cursor-pointer'
                      }
                      onClick={(event) => onFilter(event, primaryTag, i)}
                    >
                      {primaryTag}
                    </li>
                  );
                })}
              </ul>
              {showAllTagsPopover && (
                <AllTagsPopover
                  siteId={currentSiteId}
                  tagColors={tagColors}
                  onFilterTag={onFilterTag}
                  onFilterAttribute={onFilterAttribute}
                  filterTag={filterTag}
                  filterAttribute={filterAttribute}
                  allAttributes={allAttributes}
                />
              )}
            </>
          ) : (
            <span className="text-xs mr-2">
              (no documents have been tagged)
            </span>
          )}
        </div>
      </div>
    );
  };

  const ToggleArchiveTab = () => {
    if (!isArchiveTabExpanded) {
      setArchiveStatus(ARCHIVE_STATUSES.INITIAL);
    }
    setIsArchiveTabExpanded(!isArchiveTabExpanded);
  };
  const deleteFromPendingArchive = (file: IDocument) => {
    dispatch(
      setPendingArchive(
        pendingArchive.filter((f) => f.documentId !== file.documentId)
      )
    );
  };
  const addToPendingArchive = (file: IDocument) => {
    if (pendingArchive) {
      if (pendingArchive.indexOf(file) === -1) {
        dispatch(setPendingArchive([...pendingArchive, file]));
      }
    } else {
      dispatch(setPendingArchive([file]));
    }
  };

  const ARCHIVE_STATUSES = {
    INITIAL: 'INITIAL',
    PENDING: 'PENDING',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
  };
  const [archiveStatus, setArchiveStatus] = useState(ARCHIVE_STATUSES.INITIAL);
  const [intervalId, setIntervalId] = useState<
    string | number | NodeJS.Timeout | undefined
  >(0);
  const [archiveDownloadUrl, setArchiveDownloadUrl] = useState<
    string | undefined
  >(undefined);
  const [isCompressButtonDisabled, setIsCompressButtonDisabled] =
    useState(true);

  const compressDocuments = () => {
    setArchiveStatus(ARCHIVE_STATUSES.PENDING);
    const documentIds: string[] = [];
    pendingArchive.forEach((document) => {
      documentIds.push(document.documentId);
    });

    DocumentsService.compressDocuments(documentIds, currentSiteId).then(
      (response: any) => {
        setArchiveStatus(ARCHIVE_STATUSES.PENDING);
        if (response.status === 201) {
          let counter = 0;
          const downloadArchive = async () => {
            try {
              await fetch(response.downloadUrl).then((r) => {
                if (r.ok) {
                  setArchiveDownloadUrl(response.downloadUrl);
                  setArchiveStatus(ARCHIVE_STATUSES.COMPLETE);
                  dispatch(setPendingArchive([]));
                  clearInterval(downloadInterval);
                }
              });
              if (counter === 120) {
                setArchiveStatus(ARCHIVE_STATUSES.ERROR);
                clearInterval(downloadInterval);
              } else {
                counter += 1;
              }
            } catch (e) {
              console.log(e, 'error');
            }
          };
          const downloadInterval = setInterval(downloadArchive, 500);
          setIntervalId(downloadInterval);
          downloadArchive();
        }
      }
    );
  };
  const ClearPendingArchive = () => {
    setArchiveStatus(ARCHIVE_STATUSES.INITIAL);
    dispatch(setPendingArchive([]));
    setIsArchiveTabExpanded(!isArchiveTabExpanded);
  };

  useEffect(() => {
    if (
      pendingArchive === undefined ||
      pendingArchive.length === 0 ||
      archiveStatus === ARCHIVE_STATUSES.COMPLETE ||
      archiveStatus === ARCHIVE_STATUSES.PENDING
    ) {
      setIsCompressButtonDisabled(true);
    } else {
      setIsCompressButtonDisabled(false);
    }

    if (
      archiveStatus === ARCHIVE_STATUSES.COMPLETE &&
      pendingArchive.length > 0
    ) {
      setArchiveStatus(ARCHIVE_STATUSES.INITIAL);
    }
  }, [pendingArchive, archiveStatus, isCompressButtonDisabled]);

  const PendingArchiveTab = () => {
    return (
      <div className="w-full h-56 p-4 flex flex-col justify-between relative">
        <div className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2">
          Document Archive (ZIP)
        </div>
        <div className="h-full border-gray-400 border overflow-y-auto z-20">
          {archiveStatus === ARCHIVE_STATUSES.INITIAL ? (
            pendingArchive ? (
              <div className="grid grid-cols-2 2xl:grid-cols-3">
                {pendingArchive.map((file: IDocument) => (
                  <div key={file.documentId} className="flex flex-row p-2">
                    <button
                      className="w-6 mr-2 text-gray-400 cursor-pointer hover:text-primary-500"
                      onClick={() => deleteFromPendingArchive(file)}
                    >
                      <Close />
                    </button>
                    <Link
                      to={`${currentDocumentsRootUri}/${file.documentId}/view`}
                      className="cursor-pointer w-16 flex items-center justify-start"
                    >
                      <img
                        src={getFileIcon(file.path, file.deepLinkPath)}
                        className="w-8 inline-block"
                        alt="icon"
                      />
                    </Link>
                    <Link
                      to={`${currentDocumentsRootUri}/${file.documentId}/view`}
                      className="cursor-pointer pt-1.5 flex items-center"
                      title={file.path.substring(
                        file.path.lastIndexOf('/') + 1
                      )}
                    >
                      <span>
                        {file.path.substring(file.path.lastIndexOf('/') + 1)
                          .length > 50 ? (
                          <span className="tracking-tighter text-clip overflow-hidden">
                            {file.path.substring(
                              file.path.lastIndexOf('/') + 1,
                              file.path.lastIndexOf('/') + 60
                            )}
                            {file.path.substring(file.path.lastIndexOf('/') + 1)
                              .length > 60 && <span>...</span>}
                          </span>
                        ) : (
                          <span>
                            {file.path.substring(
                              file.path.lastIndexOf('/') + 1
                            )}
                          </span>
                        )}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-md text-gray-500 ml-2">
                No files in archive
              </div>
            )
          ) : archiveStatus === ARCHIVE_STATUSES.PENDING ? (
            <div className="h-full flex flex-col justify-center">
              <Spinner />
              <div className="text-md text-gray-500 ml-2 text-center">
                compressing...
              </div>
            </div>
          ) : (
            <>
              {archiveStatus === ARCHIVE_STATUSES.ERROR ? (
                <div className="h-full flex flex-col justify-center font-semibold text-center">
                  <span className="text-red-600">Error: please try again.</span>
                  <a
                    href="JavaScript://"
                    onClick={compressDocuments}
                    className="block font-bold hover:underline"
                  >
                    retry
                  </a>
                </div>
              ) : (
                <div className="flex w-full pt-10 justify-center items-center">
                  <ButtonPrimary type="button" style={{ padding: 0 }}>
                    <a
                      href={archiveDownloadUrl}
                      className="w-full h-full block"
                    >
                      <div className="text-lg mx-4 text-center cursor-pointer">
                        Download Archive
                      </div>
                    </a>
                  </ButtonPrimary>
                </div>
              )}
            </>
          )}
        </div>
        <div className="h-12 flex justify-end mt-2">
          {!isCompressButtonDisabled && (
            <ButtonPrimary onClick={compressDocuments} type="button">
              <span>Compress</span>
            </ButtonPrimary>
          )}
          {archiveStatus === ARCHIVE_STATUSES.COMPLETE && (
            <ButtonGhost onClick={ClearPendingArchive} type="button">
              <span>Done</span>
            </ButtonGhost>
          )}
        </div>
      </div>
    );
  };

  const viewDocumentVersion = (versionKey: string) => {
    if (infoDocumentId) {
      if (versionKey !== undefined) {
        navigate(
          `${currentDocumentsRootUri}/${infoDocumentId}/view?versionKey=${encodeURIComponent(
            versionKey
          )}`
        );
      } else {
        navigate(`${currentDocumentsRootUri}/${infoDocumentId}/view`);
      }
    }
  };

  const [publicationLinkCopyTooltipText, setPublicationLinkCopyTooltipText] =
    useState('Copy Link');
  const CopyPublicationLink = (documentId: string) => {
    window.navigator.clipboard.writeText(`/publications/${documentId}`);
    setPublicationLinkCopyTooltipText('Copied!');
    setTimeout(() => {
      setPublicationLinkCopyTooltipText('Copy Link');
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Documents</title>
      </Helmet>
      <div className="h-[calc(100vh-3.68rem)] flex">
        <div className="grow flex flex-col justify-stretch">
          <div className="flex mt-2 h-8">
            <div className="grow">{foldersPath(subfolderUri)}</div>
            <div className="flex items-center gap-4 pr-8 z-10">
              {archiveStatus !== ARCHIVE_STATUSES.COMPLETE && (
                <ButtonSecondary onClick={ToggleArchiveTab} type="button">
                  {isArchiveTabExpanded ? (
                    <>
                      <span>Minimize Archive</span>
                    </>
                  ) : (
                    <>
                      {pendingArchive.length ? (
                        <span>View Pending Archive</span>
                      ) : (
                        <span>Create Archive</span>
                      )}
                    </>
                  )}
                </ButtonSecondary>
              )}
              {isArchiveTabExpanded &&
                archiveStatus === ARCHIVE_STATUSES.INITIAL && (
                  <ButtonTertiary onClick={ClearPendingArchive} type="button">
                    Cancel
                  </ButtonTertiary>
                )}
              {!formkiqVersion.modules.includes('typesense') &&
                !formkiqVersion.modules.includes('opensearch') &&
                !advancedSearch && (
                  <button
                    type="button"
                    onClick={expandAdvancedSearch}
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Search Documents...</ButtonGhost>
                  </button>
                )}
              {!formkiqVersion.modules.includes('typesense') &&
                !formkiqVersion.modules.includes('opensearch') &&
                advancedSearch &&
                (advancedSearch === 'hidden' ? (
                  <button
                    type="button"
                    onClick={expandAdvancedSearch}
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Expand Search Tab</ButtonGhost>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={minimizeAdvancedSearch}
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Minimize Search Tab</ButtonGhost>
                  </button>
                ))}
              <div
                className={
                  (isTagFilterExpanded
                    ? 'text-primary-500 '
                    : 'text-neutral-900 ') + ' w-5 cursor-pointer'
                }
                onClick={(event) => {
                  if (filterTag && filterTag.length) {
                    setIsTagFilterExpanded(true);
                  } else {
                    setIsTagFilterExpanded(!isTagFilterExpanded);
                  }
                }}
              >
                <Tag />
              </div>
            </div>
          </div>
          <div
            className="flex flex-row "
            style={{
              height: `calc(100% ${
                isTagFilterExpanded ? '- 6rem' : '- 3.68rem'
              }`,
            }}
            id="documentsPageWrapper"
            onDragEnter={handleDragEnter}
          >
            <div className="flex-1 inline-block h-full">
              {isTagFilterExpanded && (
                <div className="pt-2 pr-8">{filtersAndTags()}</div>
              )}
              {isArchiveTabExpanded && (
                <div className="pt-2 pr-8">
                  <PendingArchiveTab />
                </div>
              )}
              {advancedSearch && (
                <div className="pt-2 pr-8">
                  <AdvancedSearchTab
                    siteId={currentSiteId}
                    formkiqVersion={formkiqVersion}
                    subfolderUri={subfolderUri}
                    infoDocumentId={infoDocumentId}
                  />
                </div>
              )}
              <DocumentsTable
                onRestoreDocument={restoreDocument}
                documentsScrollpaneRef={documentsScrollpaneRef}
                documentsWrapperRef={documentsWrapperRef}
                currentSiteId={currentSiteId}
                currentDocumentsRootUri={currentDocumentsRootUri}
                onDocumentDataChange={onDocumentDataChange}
                isSiteReadOnly={isCurrentSiteReadonly}
                filterTag={filterTag}
                deleteFolder={deleteFolder}
                trackScrolling={trackScrolling}
                isArchiveTabExpanded={isArchiveTabExpanded}
                addToPendingArchive={addToPendingArchive}
                deleteFromPendingArchive={deleteFromPendingArchive}
                archiveStatus={archiveStatus}
                infoDocumentId={infoDocumentId}
                onDocumentInfoClick={onDocumentInfoClick}
                selectedDocuments={selectedDocuments}
                setSelectedDocuments={setSelectedDocuments}
                onDeleteSelectedDocuments={onDeleteSelectedDocuments}
                onRestoreSelectedDocuments={onRestoreSelectedDocuments}
              />
              <Dialog
                open={isDropZoneVisible}
                onClose={() => setIsDropZoneVisible(false)}
                initialFocus={closeDropZoneRef}
                className="h-[calc(100vh-60px)] w-96 absolute right-0 top-[60px] z-10 bg-neutral-100 flex text-gray-400 border border-dashed border-4"
              >
                <Dialog.Panel>
                  <button
                    ref={closeDropZoneRef}
                    className="absolute right-2 top-2 cursor-pointer h-6 w-6 text-gray-400 hover:text-gray-600 focus:outline-none "
                    onClick={() => setIsDropZoneVisible(false)}
                  >
                    <Close />
                  </button>
                  <div
                    className="h-full w-full flex justify-center items-center p-6"
                    onDrop={handleDrop}
                  >
                    <h1 className="text-2xl font-bold text-center">
                      Drop files here to upload to current folder <br />
                      <span className="text-sm font-normal ">
                        (or drop files onto specific folders)
                      </span>
                    </h1>
                  </div>
                </Dialog.Panel>
              </Dialog>
            </div>
          </div>
        </div>
        {infoDocumentId.length ? (
          <div className="h-[calc(100vh-3.68rem)] overflow-y-auto flex w-72 bg-white border-l border-neutral-300">
            <div className="flex-1 inline-block">
              {currentDocument ? (
                <div className="flex flex-wrap justify-center">
                  <div className="w-full flex grow-0 pl-2 pt-3 justify-start">
                    <div className="w-12">
                      <img
                        alt="File Icon"
                        src={getFileIcon(
                          (currentDocument as IDocument).path,
                          (currentDocument as IDocument).deepLinkPath
                        )}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="grow-0 w-44 px-2 leading-5 font-bold text-base text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                      {(currentDocument as IDocument).path}
                      {isCurrentDocumentSoftDeleted && (
                        <small className="block text-red-500 uppercase">
                          (deleted)
                        </small>
                      )}
                    </div>
                    <div className="w-8 grow-0 flex justify-end">
                      <div
                        className="w-4 mt-0.5 h-4 cursor-pointer text-gray-400"
                        onClick={(event) => {
                          setInfoDocumentId('');
                          window.location.hash = '';
                        }}
                      >
                        <Close />
                      </div>
                    </div>
                  </div>
                  <div className="w-64 flex mt-4 mr-12 mb-2 border-b">
                    <div
                      className="w-1/3 text-sm font-semibold cursor-pointer"
                      onClick={(event) => {
                        setInfoDocumentView('info');
                      }}
                    >
                      <div
                        className={
                          (infoDocumentView === 'info'
                            ? 'text-primary-500 '
                            : 'text-gray-400 ') + ' text-center'
                        }
                      >
                        Info
                      </div>
                      <div className="flex justify-center">
                        <hr
                          className={
                            (infoDocumentView === 'info'
                              ? 'border-primary-500 '
                              : 'border-transparent ') +
                            ' w-1/2 rounded-xl border-b border'
                          }
                        />
                      </div>
                    </div>
                    {formkiqVersion.type !== 'core' &&
                      (currentDocument as IDocument).deepLinkPath?.length ===
                        0 && (
                        <div
                          className="w-1/3 text-sm font-semibold cursor-pointer"
                          onClick={(event) => {
                            setInfoDocumentView('history');
                          }}
                        >
                          <div
                            className={
                              (infoDocumentView === 'history'
                                ? 'text-primary-500 '
                                : 'text-gray-400 ') + ' text-center'
                            }
                          >
                            History
                          </div>
                          <div className="flex justify-center">
                            <hr
                              className={
                                (infoDocumentView === 'history'
                                  ? 'border-primary-500 '
                                  : 'border-transparent ') +
                                ' w-1/2 rounded-xl border-b border'
                              }
                            />
                          </div>
                        </div>
                      )}

                    <div
                      className="w-1/3 text-sm font-semibold cursor-pointer"
                      onClick={(event) => {
                        setInfoDocumentView('actions');
                      }}
                    >
                      <div
                        className={
                          (infoDocumentView === 'actions'
                            ? 'text-primary-500 '
                            : 'text-gray-400 ') + ' text-center'
                        }
                      >
                        Actions
                      </div>
                      <div className="flex justify-center">
                        <hr
                          className={
                            (infoDocumentView === 'actions'
                              ? 'border-primary-500 '
                              : 'border-transparent ') +
                            ' w-1/2 rounded-xl border-b border'
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      (infoDocumentView === 'info' ? 'block ' : 'hidden ') +
                      ' w-64 mr-12'
                    }
                  >
                    {currentDocument && (currentDocument as IDocument).path && (
                      <dl className="p-4 pr-6 pt-2 text-md text-neutral-900">
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1 text-smaller font-semibold">
                            Location
                          </dt>
                          <dd className="text-sm text-primary-600 hover:text-primary-400">
                            {(currentDocument as IDocument).path.substring(
                              0,
                              (currentDocument as IDocument).path.lastIndexOf(
                                '/'
                              )
                            ).length ? (
                              <Link
                                to={
                                  siteDocumentsRootUri +
                                  '/folders/' +
                                  (currentDocument as IDocument).path.substring(
                                    0,
                                    (
                                      currentDocument as IDocument
                                    ).path.lastIndexOf('/')
                                  )
                                }
                                className="flex"
                              >
                                <span className="pr-1">
                                  {siteDocumentsRootName.replace(
                                    'Workspace: ',
                                    ''
                                  )}
                                  :
                                </span>
                                <span>
                                  {(
                                    currentDocument as IDocument
                                  ).path.substring(
                                    0,
                                    (
                                      currentDocument as IDocument
                                    ).path.lastIndexOf('/')
                                  )}
                                </span>
                                <div className="w-4 pt-0.5">
                                  <ChevronRight />
                                </div>
                              </Link>
                            ) : (
                              <Link to={siteDocumentsRootUri} className="flex">
                                {siteDocumentsRootName.replace(
                                  'Workspace: ',
                                  ''
                                )}
                                <div className="w-4 pt-0.5">
                                  <ChevronRight />
                                </div>
                              </Link>
                            )}
                          </dd>
                        </div>
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1 text-smaller font-semibold">
                            Added by
                          </dt>
                          <dd className="text-sm">
                            {(currentDocument as IDocument).userId}
                          </dd>
                        </div>
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1 text-smaller font-semibold">
                            Date added
                          </dt>
                          <dd className=" text-sm">
                            {formatDate(
                              (currentDocument as IDocument).insertedDate
                            )}
                          </dd>
                        </div>
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1 text-smaller font-semibold">
                            Last modified
                          </dt>
                          <dd className="text-sm">
                            {formatDate(
                              (currentDocument as IDocument).lastModifiedDate
                            )}
                          </dd>
                        </div>
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1 text-smaller font-semibold">
                            ID{' '}
                            <CopyButton
                              value={(currentDocument as IDocument).documentId}
                            />
                          </dt>
                          <dd className="text-sm tracking-tight">
                            {(currentDocument as IDocument).documentId}&nbsp;
                          </dd>
                        </div>
                        {(currentDocument as IDocument).deepLinkPath && (
                          <div className="flex flex-col pb-3">
                            <dt className="mb-1 text-smaller font-semibold">
                              DeepLinkPath{' '}
                              <CopyButton
                                value={
                                  (currentDocument as IDocument).deepLinkPath
                                }
                              />
                            </dt>
                            <dd className="text-sm tracking-tight">
                              <a
                                className="underline h0ver:text-primary-500 break-words"
                                href={
                                  (currentDocument as IDocument).deepLinkPath
                                }
                              >
                                {(currentDocument as IDocument).deepLinkPath}
                                &nbsp;
                              </a>
                            </dd>
                          </div>
                        )}
                        <div className="w-68 flex mr-3 border-b"></div>
                        <div className="pt-3 flex flex-col items-start text-sm font-semibold text-primary-500">
                          Relationships
                          {!isSiteReadOnly && (
                            <div
                              className="w-3/5 self-end flex text-medsmall font-semibold text-primary-500 cursor-pointer"
                              onClick={(event) =>
                                onDocumentRelationshipsModalClick(event, {
                                  lineType: 'document',
                                  folder: subfolderUri,
                                  documentId: (currentDocument as IDocument)
                                    .documentId,
                                  documentInstance:
                                    currentDocument as IDocument,
                                  folderInstance: null,
                                })
                              }
                            >
                              <>
                                <span className="pt-0.5 whitespace-nowrap">
                                  add/edit relationships
                                </span>
                                <div className="w-4">
                                  <ChevronRight />
                                </div>
                              </>
                            </div>
                          )}
                        </div>
                        {relationships.length > 0 ? (
                          <div>
                            {relationships.map((relationship) => (
                              <div>
                                <h3 className="text-sm font-semibold text-neutral-900">
                                  {relationship.relationship}:{' '}
                                  {relationshipDocumentsMap[
                                    relationship.documentId
                                  ] &&
                                  relationshipDocumentsMap[
                                    relationship.documentId
                                  ] !== 'NOT_FOUND' ? (
                                    <Link
                                      to={`${siteDocumentsRootUri}/${relationship.documentId}/view`}
                                      className="underline hover:text-primary-500 break-words font-normal"
                                    >
                                      {
                                        relationshipDocumentsMap[
                                          relationship.documentId
                                        ]
                                      }
                                    </Link>
                                  ) : (
                                    <span className="text-neutral-500">
                                      {relationship.documentId}
                                    </span>
                                  )}
                                </h3>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs">
                            (no relationships have been added)
                          </span>
                        )}
                        <div className="w-68 flex mr-3 border-b"></div>
                        <div className="pt-3 flex justify-between text-sm font-semibold text-primary-500">
                          Attributes
                          {!isCurrentSiteReadonly && (
                            <div
                              className="w-3/5 flex text-medsmall font-semibold text-primary-500 cursor-pointer"
                              onClick={(event) =>
                                onEditAttributesModalClick(event, {
                                  lineType: 'document',
                                  folder: subfolderUri,
                                  documentId: (currentDocument as IDocument)
                                    .documentId,
                                  documentInstance:
                                    currentDocument as IDocument,
                                  folderInstance: null,
                                })
                              }
                            >
                              <>
                                <span className="pt-0.5">
                                  add/edit attributes
                                </span>
                                <div className="w-4">
                                  <ChevronRight />
                                </div>
                              </>
                            </div>
                          )}
                        </div>
                        {sortedAttributesAndTags.length === 0 && (
                          <span className="text-xs">
                            (no attributes have been added)
                          </span>
                        )}
                        {sortedAttributesAndTags.length > 0 &&
                        sortedAttributesAndTags.filter((item: any, i) => {
                          if (
                            !item.stringValue &&
                            !item.numberValue &&
                            !item.booleanValue &&
                            item.valueType !== 'BOOLEAN' &&
                            !item.value &&
                            !item.values &&
                            !item.stringValues &&
                            !item.numberValues
                          ) {
                            return true;
                          }
                          return false;
                        }).length ? (
                          <>
                            <div className="mt-2 text-smaller font-semibold uppercase italic">
                              Key-Only Attributes
                            </div>
                            <div className="rounded-lg border border-neutral-200 mt-1 -ml-1 p-1 flex flex-wrap">
                              {sortedAttributesAndTags.length > 0 &&
                                sortedAttributesAndTags.map((item: any, i) => {
                                  let tagColor = 'gray';
                                  if (tagColors) {
                                    tagColors.forEach((color: any) => {
                                      if (
                                        color.tagKeys.indexOf(item.key) > -1
                                      ) {
                                        tagColor = color.colorUri;
                                        return;
                                      }
                                    });
                                  }
                                  return (
                                    <div
                                      key={`keyonly_attribute_${item.key}_${i}`}
                                    >
                                      {!item.stringValue &&
                                        !item.numberValue &&
                                        !item.booleanValue &&
                                        item.valueType !== 'BOOLEAN' &&
                                        !item.value &&
                                        !item.values &&
                                        !item.stringValues &&
                                        !item.numberValues && (
                                          <div className="pt-0.5 pr-1 flex">
                                            <div
                                              className={`h-5.5 pl-2 text-smaller rounded-l-md pr-1 bg-${tagColor}-200 whitespace-nowrap`}
                                            >
                                              {item.key}
                                            </div>
                                            <div
                                              className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}
                                            ></div>
                                          </div>
                                        )}
                                    </div>
                                  );
                                })}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        <div>
                          {sortedAttributesAndTags.length > 0 &&
                            sortedAttributesAndTags.map((item: any, i) => (
                              <span key={`attr_${item.key}_${i}`}>
                                {!item.stringValue &&
                                !item.numberValue &&
                                !item.booleanValue &&
                                item.valueType !== 'BOOLEAN' &&
                                !item.value &&
                                !item.values &&
                                !item.stringValues &&
                                !item.numberValues ? (
                                  <></>
                                ) : (
                                  <div
                                    key={`attribute_${item.key}_${i}`}
                                    className="flex flex-col pt-3"
                                  >
                                    <dt className="mb-1 text-smaller font-semibold">
                                      {item.key}
                                      {item.values !== undefined && (
                                        <QuantityButton
                                          type="button"
                                          onClick={() => {
                                            onAttributeQuantityClick(item);
                                          }}
                                        >
                                          {item.values.length}
                                        </QuantityButton>
                                      )}
                                      {item.stringValues !== undefined && (
                                        <QuantityButton
                                          type="button"
                                          onClick={() => {
                                            onAttributeQuantityClick(item);
                                          }}
                                        >
                                          {item.stringValues.length}
                                        </QuantityButton>
                                      )}
                                      {item.numberValues !== undefined && (
                                        <QuantityButton
                                          type="button"
                                          onClick={() => {
                                            onAttributeQuantityClick(item);
                                          }}
                                        >
                                          {item.numberValues.length}
                                        </QuantityButton>
                                      )}
                                    </dt>
                                    <dd className="text-sm">
                                      {/*Attributes*/}
                                      {item?.key === 'Publication' ||
                                      item?.key === 'Relationships' ? (
                                        <>
                                          {item?.stringValue && (
                                            <div>
                                              <span className="text-xs pr-2">
                                                {item.stringValue}
                                                <span className="mx-1"></span>
                                                <CopyButton
                                                  value={item.stringValue}
                                                />
                                              </span>
                                              {item?.key === 'Publication' && (
                                                <span className="block mt-1 text-xs">
                                                  <Tooltip
                                                    id={
                                                      'publication-link-copy-tooltip'
                                                    }
                                                  />
                                                  <ButtonTertiary
                                                    className="px-2 py-0.5"
                                                    data-tooltip-id={
                                                      'publication-link-copy-tooltip'
                                                    }
                                                    data-tooltip-content={
                                                      publicationLinkCopyTooltipText
                                                    }
                                                    onClick={() => {
                                                      CopyPublicationLink(
                                                        (
                                                          currentDocument as IDocument
                                                        ).documentId
                                                      );
                                                    }}
                                                    type="button"
                                                  >
                                                    Copy Publication Link
                                                  </ButtonTertiary>
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {item?.stringValue && (
                                            <span>{item.stringValue}</span>
                                          )}
                                        </>
                                      )}
                                      {item?.numberValue !== undefined && (
                                        <span>{item.numberValue}</span>
                                      )}
                                      {item?.booleanValue !== undefined ? (
                                        <>
                                          {item.booleanValue ? (
                                            <span>TRUE</span>
                                          ) : (
                                            <span>FALSE</span>
                                          )}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {item?.stringValues !== undefined && (
                                        <div className="-mr-2 px-1 text-smaller font-normal max-h-24 overflow-auto">
                                          {item.stringValues.map(
                                            (val: any, index: number) => (
                                              <>
                                                {item?.key ===
                                                'Relationships' ? (
                                                  <span
                                                    className="text-xs"
                                                    key={`attr_string_${item.key}_${index}`}
                                                  >
                                                    {val}
                                                    <span className="mx-1"></span>
                                                    <CopyButton value={val} />
                                                    {index <
                                                      item.stringValues.length -
                                                        1 && <hr />}
                                                  </span>
                                                ) : (
                                                  <span
                                                    key={`attr_string_${item.key}_${index}`}
                                                  >
                                                    {val}
                                                    {index <
                                                      item.stringValues.length -
                                                        1 && <hr />}
                                                  </span>
                                                )}
                                              </>
                                            )
                                          )}
                                        </div>
                                      )}
                                      {item?.numberValues !== undefined && (
                                        <div className="-mr-2 px-1 text-smaller font-normal max-h-24 overflow-auto">
                                          {item.numberValues.map(
                                            (val: any, index: number) => (
                                              <span
                                                key={`attr_number_${item.key}_${index}`}
                                              >
                                                {val}
                                                {index <
                                                  item.numberValues.length -
                                                    1 && <hr />}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                      {/*Tags*/}
                                      {item?.value !== undefined && (
                                        <div className="-mr-2 p-1 text-sm font-normal max-h-24 overflow-auto">
                                          {item.value}
                                        </div>
                                      )}
                                      {item?.values !== undefined && (
                                        <div className="-mr-2 rounded-lg border border-neutral-200 p-1 text-smaller font-normal max-h-24 overflow-auto">
                                          {item.values.map(
                                            (val: any, index: number) => (
                                              <span
                                                key={`tag_value_${item.key}_${index}`}
                                              >
                                                {val}
                                                {index <
                                                  item.values.length - 1 && (
                                                  <hr className="my-0.5" />
                                                )}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </dd>
                                  </div>
                                )}
                              </span>
                            ))}
                        </div>
                      </dl>
                    )}
                    {currentDocument &&
                      (InlineViewableContentTypes.indexOf(
                        (currentDocument as IDocument).contentType
                      ) > -1 ||
                        TextFileEditorViewableContentTypes.indexOf(
                          (currentDocument as IDocument).contentType
                        ) > -1 ||
                        (formkiqVersion.modules?.indexOf('onlyoffice') > -1 &&
                          OnlyOfficeContentTypes.indexOf(
                            (currentDocument as IDocument).contentType
                          ) > -1) ||
                        ((currentDocument as IDocument).deepLinkPath &&
                          (currentDocument as IDocument).deepLinkPath.length >
                            0)) && (
                        <div className="mt-4 w-full flex justify-center">
                          <ButtonPrimaryGradient
                            onClick={viewDocument}
                            type="button"
                            style={{
                              height: '36px',
                              width: '100%',
                              margin: '0 16px',
                            }}
                          >
                            <div className="w-full flex justify-center px-4 py-1">
                              <span className="">View Document</span>
                              <span className="w-7 pl-1">{View()}</span>
                            </div>
                          </ButtonPrimaryGradient>
                        </div>
                      )}
                    {currentDocument &&
                      (InlineEditableContentTypes.indexOf(
                        (currentDocument as IDocument).contentType
                      ) > -1 ||
                        TextFileEditorEditableContentTypes.indexOf(
                          (currentDocument as IDocument).contentType
                        ) > -1) &&
                      !isCurrentSiteReadonly && (
                        <div className="mt-4 w-full flex justify-center">
                          <ButtonPrimaryGradient
                            onClick={editDocument}
                            type="button"
                            style={{
                              height: '36px',
                              width: '100%',
                              margin: '0 16px',
                            }}
                          >
                            <div className="w-full flex justify-center px-4 py-1">
                              <span className="">Edit Document</span>
                              <span className="w-7 pl-1">
                                <Pencil />
                              </span>
                            </div>
                          </ButtonPrimaryGradient>
                        </div>
                      )}

                    {(currentDocument as IDocument).deepLinkPath &&
                      (currentDocument as IDocument).deepLinkPath.length ===
                        0 && (
                        <div className="mt-2 w-full flex justify-center">
                          <ButtonPrimaryGradient
                            onClick={DownloadDocument}
                            style={{
                              height: '36px',
                              width: '100%',
                              margin: '0 16px',
                            }}
                          >
                            <div className="w-full flex justify-center px-4 py-1">
                              <span className="">Download</span>
                              <span className="w-7 pl-1">{Download()}</span>
                            </div>
                          </ButtonPrimaryGradient>
                        </div>
                      )}
                    {formkiqVersion.type !== 'core' &&
                      (currentDocument as IDocument).deepLinkPath &&
                      (currentDocument as IDocument).deepLinkPath.length ===
                        0 && (
                        <div className="mt-2 flex justify-center">
                          <ButtonSecondary
                            style={{
                              height: '36px',
                              width: '100%',
                              margin: '0 16px',
                            }}
                            onClick={(event: any) => {
                              const documentLine: ILine = {
                                lineType: 'document',
                                folder: '',
                                documentId: infoDocumentId,
                                documentInstance: currentDocument,
                                folderInstance: null,
                              };
                              onDocumentWorkflowsModalClick(
                                event,
                                documentLine
                              );
                            }}
                          >
                            View
                            {isCurrentSiteReadonly ? (
                              <span>&nbsp;</span>
                            ) : (
                              <span>&nbsp;/ Assign&nbsp;</span>
                            )}
                            Workflows
                          </ButtonSecondary>
                        </div>
                      )}
                  </div>
                  <div
                    className={
                      (infoDocumentView === 'history' ? 'block ' : 'hidden ') +
                      ' w-64 mr-12'
                    }
                  >
                    <span className="p-4 text-sm">
                      <dl className="p-4 pt-2 text-medsmall text-gray-600">
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1">
                            {formatDate(
                              (currentDocument as IDocument).lastModifiedDate
                            )}
                          </dt>
                          <dd className="font-semibold text-sm">
                            Current version added
                            <div
                              className="font-medium pt-1 ml-12 flex text-primary-500 cursor-pointer"
                              onClick={(event) => {
                                viewDocumentVersion('');
                              }}
                            >
                              <span>view this version</span>
                              <div className="w-4 pt-0.5">
                                <ChevronRight />
                              </div>
                            </div>
                          </dd>
                        </div>
                        {currentDocumentVersions &&
                          (currentDocumentVersions as []).map(
                            (version: any, i: number) => {
                              return (
                                <div key={i} className="flex flex-col pb-3">
                                  <dt className="mb-1">
                                    {formatDate(version.lastModifiedDate)}
                                  </dt>
                                  <dd className="font-semibold text-sm">
                                    {version.version === '1' ? (
                                      <span>
                                        Document added (initial version)
                                      </span>
                                    ) : (
                                      <span>
                                        Version added (version #
                                        {version.version})
                                      </span>
                                    )}
                                    <div
                                      className="font-medium pt-1 ml-12 flex text-primary-500 cursor-pointer"
                                      onClick={(event) => {
                                        console.log(version.versionKey);
                                        viewDocumentVersion(version.versionKey);
                                      }}
                                    >
                                      <span>view this version</span>
                                      <div className="w-4 pt-0.5">
                                        <ChevronRight />
                                      </div>
                                    </div>
                                  </dd>
                                </div>
                              );
                            }
                          )}
                      </dl>
                      <div className="mt-2 flex justify-center">
                        <ButtonPrimaryGradient
                          style={{ height: '36px' }}
                          onClick={(event: any) => {
                            const documentLine: ILine = {
                              lineType: 'document',
                              folder: '',
                              documentId: infoDocumentId,
                              documentInstance: currentDocument,
                              folderInstance: null,
                            };
                            onDocumentVersionsModalClick(event, documentLine);
                          }}
                        >
                          View
                          {isCurrentSiteReadonly ? (
                            <span>&nbsp;</span>
                          ) : (
                            <span>&nbsp;/ Edit&nbsp;</span>
                          )}
                          Versions
                        </ButtonPrimaryGradient>
                      </div>
                    </span>
                  </div>

                  <div
                    className={
                      (infoDocumentView === 'actions' ? 'block ' : 'hidden ') +
                      ' w-64 mr-12'
                    }
                  >
                    <dl className="p-4 pr-6 pt-2 text-md text-neutral-900">
                      {currentDocumentActions.length === 0 && (
                        <div className="flex w-full justify-center italic text-smaller">
                          (no actions exist for this document)
                        </div>
                      )}
                      {currentDocumentActions.find(
                        (action: any) =>
                          action.status === 'FAILED' ||
                          action.status === 'PENDING' ||
                          action.status === 'FAILED_RETRY'
                      ) && (
                        <ButtonPrimaryGradient
                          className="text-sm h-9 w-full mb-2"
                          onClick={retryFailedActions}
                        >
                          <div className="flex gap-2 items-center justify-center">
                            <span>Retry Failed Actions</span>
                            <div className="w-5">
                              <Retry />
                            </div>
                          </div>
                        </ButtonPrimaryGradient>
                      )}
                      {currentDocumentActions.map((action: any, i: number) => (
                        <div key={i} className="flex flex-col pb-3">
                          <dt className="font-semibold text-sm">
                            {action.type}
                          </dt>
                          <dd>
                            <p
                              className={`font-bold text-xs ${
                                action.status === 'COMPLETE'
                                  ? 'text-green-600'
                                  : action.status === 'FAILED' ||
                                    action.status === 'FAILED_RETRY'
                                  ? 'text-red-600'
                                  : action.status === 'SKIPPED'
                                  ? 'text-neutral-600'
                                  : 'text-yellow-600'
                              }`}
                            >
                              {action.status.replace(/_/g, ' ')}
                            </p>

                            {action.message && (
                              <p className="font-medium text-xs italic">
                                {action.message}
                              </p>
                            )}
                            {action.userId && (
                              <p className="pl-2 text-sm text-neutral-600 font-medium">
                                User:
                                {action.userEmail ? (
                                  <span className="pl-1">
                                    {action.userEmail}
                                  </span>
                                ) : (
                                  <span className="pl-1">
                                    {action.userId.length <= 10 ? (
                                      <>{action.userId}</>
                                    ) : (
                                      <span className="text-xs">
                                        {action.userId}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </p>
                            )}
                            {action.queueId && (
                              <Link
                                to={`${siteDocumentsRootUri}/queues/${action.queueId}`}
                                className="pl-2 text-sm text-neutral-600 text-neutral-600 font-medium "
                              >
                                Queue:{' '}
                                <span className="text-primary-500 hover:text-primary-600">
                                  {queues.find(
                                    (queue: any) =>
                                      queue.queueId === action.queueId
                                  )?.name || action.queueId}
                                </span>
                              </Link>
                            )}
                            {action.workflowId && (
                              <Link
                                to={`${
                                  siteDocumentsRootUri.includes('workspaces')
                                    ? siteDocumentsRootUri
                                    : ''
                                }/workflows/designer?workflowId=${
                                  action.workflowId
                                }`}
                                className="pl-2 text-sm text-neutral-600 font-medium inline-block"
                              >
                                Workflow:{' '}
                                <span className="text-primary-500 hover:text-primary-600">
                                  {workflows.find(
                                    (workflow: any) =>
                                      workflow.workflowId === action.workflowId
                                  )?.name || action.workflowId}
                                </span>
                              </Link>
                            )}
                            {action.insertedDate && (
                              <p className="pl-2 text-medsmall text-neutral-600 font-medium">
                                Inserted: {formatDate(action.insertedDate)}
                              </p>
                            )}
                            {action.startDate && (
                              <p className="pl-2 text-medsmall text-neutral-600 font-medium">
                                Start: {formatDate(action.startDate)}
                              </p>
                            )}
                            {action.completedDate && (
                              <p className="pl-2 text-medsmall text-neutral-600 font-medium">
                                End: {formatDate(action.completedDate)}
                              </p>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="hidden overflow-x-auto relative">
                    <div className="-mr-[4.625rem] p-4 text-[0.8125rem] leading-6 text-slate-900">
                      <div className="flex gap-4 pb-10 border-t border-slate-400/20 justify-center items-center py-6">
                        {document &&
                          formkiqVersion.modules?.indexOf('onlyoffice') > -1 &&
                          OnlyOfficeContentTypes.indexOf(
                            (currentDocument as IDocument).contentType
                          ) > -1 && (
                            <button
                              className="w-38 flex bg-primary-500 justify-center px-4 py-1 text-base text-white rounded-md"
                              onClick={viewDocument}
                            >
                              <span className="">Edit</span>
                              <span className="pl-4 pt-1 w-8">{Edit()}</span>
                            </button>
                          )}
                        {document &&
                          InlineViewableContentTypes.indexOf(
                            (currentDocument as IDocument).contentType
                          ) > -1 && (
                            <button
                              className="w-38 flex bg-primary-500 justify-center px-4 py-1 text-base text-white rounded-md"
                              onClick={viewDocument}
                            >
                              <span className="">View</span>
                              <span className="pl-4 pt-0.5 w-9">{View()}</span>
                            </button>
                          )}
                        <ButtonPrimaryGradient
                          onClick={DownloadDocument}
                          style={{ height: '36px', width: '100%' }}
                        >
                          <div className="w-full flex justify-center px-4 py-1">
                            <span className="">Download</span>
                            <span className="w-7 pl-1">{Download()}</span>
                          </div>
                        </ButtonPrimaryGradient>
                        {isCurrentDocumentSoftDeleted ? (
                          <button
                            className="w-38 flex bg-primary-500 justify-center px-4 py-1 text-base text-white rounded-md"
                            onClick={() =>
                              restoreDocument(
                                (currentDocument as IDocument).documentId
                              )
                            }
                          >
                            <span className="">Restore</span>
                            <div className="ml-2 mt-1 w-3.5 h-3.5 text-white flex justify-center">
                              <Undo />
                            </div>
                          </button>
                        ) : (
                          <>
                            {useSoftDelete && (
                              <button
                                className="w-38 flex bg-primary-500 justify-center px-4 py-1 text-base text-white rounded-md"
                                onClick={() =>
                                  onDeleteDocument(
                                    (currentDocument as IDocument).documentId,
                                    useSoftDelete
                                  )
                                }
                              >
                                <span className="">Delete</span>
                                <div className="ml-2 mt-1 w-3.5 h-3.5 text-white flex justify-center">
                                  <Trash />
                                </div>
                              </button>
                            )}
                          </>
                        )}
                        <div className="w-5 h-auto text-gray-400">
                          <DocumentActionsPopover
                            value={{
                              lineType: 'document',
                              folder: subfolderUri,
                              documentId: (currentDocument as IDocument)
                                .documentId,
                              documentInstance: currentDocument as IDocument,
                            }}
                            siteId={currentSiteId}
                            isSiteReadOnly={isCurrentSiteReadonly}
                            formkiqVersion={formkiqVersion}
                            onInfoPage={true}
                            user={user}
                            useIndividualSharing={useIndividualSharing}
                            useCollections={useCollections}
                            useSoftDelete={useSoftDelete}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <NewModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        siteId={currentSiteId}
        formkiqVersion={formkiqVersion}
        value={newModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <UploadModal
        isOpened={isUploadModalOpened}
        onClose={onUploadClose}
        siteId={currentSiteId}
        formkiqVersion={formkiqVersion}
        folder={dropFolderPath ? dropFolderPath : subfolderUri}
        documentId={uploadModalDocumentId}
        isFolderUpload={false}
        onDocumentDataChange={onDocumentDataChange}
        dropUploadDocuments={dropUploadDocuments}
        resetDropUploadDocuments={resetDropUploadDocuments}
        folderPath={
          dropFolderPath
            ? `${currentDocumentsRootUri}/folders/${dropFolderPath}`
            : pathname
        }
      />
      <UploadModal
        isOpened={isFolderUploadModalOpened}
        onClose={onFolderUploadClose}
        siteId={currentSiteId}
        formkiqVersion={formkiqVersion}
        folder={subfolderUri}
        documentId={folderUploadModalDocumentId}
        isFolderUpload={true}
        onDocumentDataChange={onDocumentDataChange}
        folderPath={
          dropFolderPath
            ? `${currentDocumentsRootUri}/folders/${dropFolderPath}`
            : pathname
        }
      />
    </>
  );
}

export default Documents;
