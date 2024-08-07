import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AllTagsPopover from '../../Components/DocumentsAndFolders/AllTagsPopover/allTagsPopover';
import DocumentActionsPopover from '../../Components/DocumentsAndFolders/DocumentActionsPopover/documentActionsPopover';
import DocumentReviewModal from '../../Components/DocumentsAndFolders/DocumentReviewModal/DocumentReviewModal';
import DocumentVersionsModal from '../../Components/DocumentsAndFolders/DocumentVersionsModal/documentVersionsModal';
import DocumentWorkflowsModal from '../../Components/DocumentsAndFolders/DocumentWorkflowsModal/documentWorkflowsModal';
import ESignaturesModal from '../../Components/DocumentsAndFolders/ESignatures/eSignaturesModal';
import EditAttributesModal from '../../Components/DocumentsAndFolders/EditAttributesModal/editAttributesModal';
import FolderDropWrapper from '../../Components/DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import MoveModal from '../../Components/DocumentsAndFolders/MoveModal/moveModal';
import MultiValuedAttributeModal from '../../Components/DocumentsAndFolders/MultivaluedAttributeModal/MultivaluedAttributeModal';
import NewModal from '../../Components/DocumentsAndFolders/NewModal/newModal';
import RenameModal from '../../Components/DocumentsAndFolders/RenameModal/renameModal';
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
  Spinner,
  Tag,
  Trash,
  Undo,
  View,
} from '../../Components/Icons/icons';
import ShareModal from '../../Components/Share/share';
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
  InlineViewableContentTypes,
  OnlyOfficeContentTypes,
} from '../../helpers/constants/contentTypes';
import { TopLevelFolders } from '../../helpers/constants/folders';
import { TagsForFilterAndDisplay } from '../../helpers/constants/primaryTags';
import { DocumentsService } from '../../helpers/services/documentsService';
import {
  formatDate,
  getCurrentSiteInfo,
  getFileIcon,
  getUserSites,
} from '../../helpers/services/toolService';
import { Attribute } from '../../helpers/types/attributes';
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
  const [isTagFilterExpanded, setIsTagFilterExpanded] = useState(false);
  const [isArchiveTabExpanded, setIsArchiveTabExpanded] = useState(false);
  const [infoDocumentId, setInfoDocumentId] = useState('');
  const [infoDocumentView, setInfoDocumentView] = useState('info');
  const [infoTagEditMode, setInfoTagEditMode] = useState(false);
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
  const [shareModalValue, setShareModalValue] = useState<ILine | null>(null);
  const [isShareModalOpened, setShareModalOpened] = useState(false);
  const [editAttributesModalValue, setEditAttributesModalValue] =
    useState<ILine | null>(null);
  const [isEditAttributesModalOpened, setEditAttributesModalOpened] =
    useState(false);
  const [documentVersionsModalValue, setDocumentVersionsModalValue] =
    useState<ILine | null>(null);
  const [isDocumentVersionsModalOpened, setDocumentVersionsModalOpened] =
    useState(false);
  const [documentWorkflowsModalValue, setDocumentWorkflowsModalValue] =
    useState<ILine | null>(null);
  const [isDocumentWorkflowsModalOpened, setDocumentWorkflowsModalOpened] =
    useState(false);
  const [eSignaturesModalValue, setESignaturesModalValue] =
    useState<ILine | null>(null);
  const [documentReviewModalValue, setDocumentReviewModalValue] =
    useState<ILine | null>(null);
  const [isDocumentReviewModalOpened, setDocumentReviewModalOpened] =
    useState(false);
  const [isESignaturesModalOpened, setESignaturesModalOpened] = useState(false);
  const [newModalValue, setNewModalValue] = useState<ILine | null>(null);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [renameModalValue, setRenameModalValue] = useState<ILine | null>(null);
  const [isRenameModalOpened, setRenameModalOpened] = useState(false);
  const [
    isMultivaluedAttributeModalOpened,
    setMultivaluedAttributeModalOpened,
  ] = useState(false);
  const [multivaluedAttributeModalValue, setMultivaluedAttributeModalValue] =
    useState<any[]>([]);
  const [moveModalValue, setMoveModalValue] = useState<ILine | null>(null);
  const [isMoveModalOpened, setMoveModalOpened] = useState(false);
  const dispatch = useAppDispatch();
  const [documentListOffsetTop, setDocumentListOffsetTop] = useState<number>(0);
  const [sortedAttributesAndTags, setSortedAttributesAndTags] = useState<any[]>(
    []
  );
  const [dropUploadDocuments, setDropUploadDocuments] = useState<any>(null);

  const documentsTable = document.getElementById('documentsTable');

  useEffect(() => {
    function handleDrop(event: any ) {
      event.stopPropagation();
      event.preventDefault();
      setDropUploadDocuments(event.dataTransfer.files)
      onUploadClick(event, "")
    }

    documentsTable?.addEventListener('dragover', function (event) {
      event.preventDefault();
    })

    documentsTable?.addEventListener('drop', function (event) {
      handleDrop(event);
    })

    return () => {
      documentsTable?.removeEventListener('dragover', function (event) {
        event.preventDefault();
      })
      documentsTable?.removeEventListener('drop', function (event) {
        handleDrop(event);
      })
    }
  }, [documentsTable]);
  
  const trackScrolling = useCallback(async () => {
    const bottomRow = (
      document.getElementById('documentsTable') as HTMLTableElement
    ).rows[
      (document.getElementById('documentsTable') as HTMLTableElement).rows
        .length - 1
    ].getBoundingClientRect().bottom;
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
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

  useEffect(() => {
    setDocumentListOffsetTop(isTagFilterExpanded ? 0 : 45);
  }, [isTagFilterExpanded]);

  function onDocumentInfoClick() {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentById(infoDocumentId, currentSiteId).then(
        (response: any) => {
          setCurrentDocument(response);
          // TODO: set folder to selected document path?
          updateTags();
          updateDocumentActions();
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

  useEffect(() => {
    onDocumentInfoClick();
  }, [infoDocumentId]);
  useEffect(() => {
    dispatch(fetchUsers({ limit: 100, page: 1 }));
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
      setInfoDocumentId(hash.substring(4));
    } else if (hash.indexOf('#history_id') > -1) {
      setInfoDocumentId(hash.substring(12));
      setInfoDocumentView('history');
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
            addUserEmails();

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

  const onDeleteDocument = (file: IDocument, searchDocuments: any) => () => {
    const deleteFunc = () => {
      let isDocumentInfoPage = false;
      if (infoDocumentId.length) {
        isDocumentInfoPage = true;
        setIsCurrentDocumentSoftDeleted(true);
      }
      dispatch(
        deleteDocument({
          siteId: currentSiteId,
          user,
          document: file,
          documents: searchDocuments,
          isDocumentInfoPage: isDocumentInfoPage,
        })
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this document?',
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
  const restoreDocument =
    (file: IDocument, siteId: string, searchDocuments: any) => () => {
      DocumentsService.deleteDocumentTag(
        file.documentId,
        siteId,
        'sysDeletedBy'
      ).then(() => {
        let newDocs = null;
        if (searchDocuments) {
          newDocs = searchDocuments.filter((doc: any) => {
            return doc.documentId !== file.documentId;
          });
        }
        setIsCurrentDocumentSoftDeleted(false);
        if (!infoDocumentId.length) {
          dispatch(
            updateDocumentsList({
              documents: newDocs,
              user: user,
              isSystemDeletedByKey: true,
            })
          );
        }
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
  const onShareClick = (event: any, value: ILine | null) => {
    setShareModalValue(value);
    setShareModalOpened(true);
  };
  const onShareClose = () => {
    setShareModalOpened(false);
  };
  const getShareModalValue = () => {
    return shareModalValue;
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
  const onEditAttributesModalClick = (event: any, value: ILine | null) => {
    setEditAttributesModalValue(value);
    setEditAttributesModalOpened(true);
  };
  const onEditAttributesModalClose = () => {
    setEditAttributesModalOpened(false);
    updateTags();
  };
  const getEditAttributesModalValue = () => {
    return editAttributesModalValue;
  };
  const onDocumentVersionsModalClick = (event: any, value: ILine | null) => {
    setDocumentVersionsModalValue(value);
    setDocumentVersionsModalOpened(true);
  };
  const onDocumentVersionsModalClose = () => {
    setDocumentVersionsModalOpened(false);
  };
  const onDocumentWorkflowsModalClick = (event: any, value: ILine | null) => {
    setDocumentWorkflowsModalValue(value);
    setDocumentWorkflowsModalOpened(true);
  };
  const onDocumentWorkflowsModalClose = () => {
    setDocumentWorkflowsModalOpened(false);
  };
  const onESignaturesModalClick = (event: any, value: ILine | null) => {
    setESignaturesModalValue(value);
    setESignaturesModalOpened(true);
  };
  const onESignaturesModalClose = () => {
    setESignaturesModalValue(null);
    setESignaturesModalOpened(false);
  };
  const onDocumentReviewModalClick = (event: any, value: ILine | null) => {
    setDocumentReviewModalValue(value);
    setDocumentReviewModalOpened(true);
  };
  const onDocumentReviewModalClose = () => {
    setDocumentReviewModalOpened(false);
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
  const onRenameModalClick = (event: any, value: ILine | null) => {
    setRenameModalValue(value);
    setRenameModalOpened(true);
  };
  const onRenameModalClose = () => {
    setRenameModalOpened(false);
  };
  const onAttributeQuantityClick = (item: any) => {
    setMultivaluedAttributeModalOpened(true);
    setMultivaluedAttributeModalValue(item);
  };
  const onMultiValuedAttributeModalClose = () => {
    setMultivaluedAttributeModalOpened(false);
    setMultivaluedAttributeModalValue([]);
  };

  const onMoveModalClick = (event: any, value: ILine | null) => {
    setMoveModalValue(value);
    setMoveModalOpened(true);
  };
  const onMoveModalClose = () => {
    setMoveModalOpened(false);
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
          `${currentDocumentsRootUri}/${infoDocumentId}/view?versionKey=${versionKey}`
        );
      } else {
        navigate(`${currentDocumentsRootUri}/${infoDocumentId}/view`);
      }
    }
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
                  <Link
                    to="?advancedSearch=visible"
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Search Documents...</ButtonGhost>
                  </Link>
                )}
              {!formkiqVersion.modules.includes('typesense') &&
                !formkiqVersion.modules.includes('opensearch') &&
                advancedSearch &&
                (advancedSearch === 'hidden' ? (
                  <Link
                    to="?advancedSearch=visible"
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Expand Search Tab</ButtonGhost>
                  </Link>
                ) : (
                  <Link
                    to="?advancedSearch=hidden"
                    className="cursor-pointer h-8"
                  >
                    <ButtonGhost type="button">Minimize Search Tab</ButtonGhost>
                  </Link>
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
                  />
                </div>
              )}
              <DocumentsTable
                onDeleteDocument={onDeleteDocument}
                onRestoreDocument={restoreDocument}
                onRenameModalClick={onRenameModalClick}
                onMoveModalClick={onMoveModalClick}
                onShareClick={onShareClick}
                documentsScrollpaneRef={documentsScrollpaneRef}
                documentsWrapperRef={documentsWrapperRef}
                currentSiteId={currentSiteId}
                currentDocumentsRootUri={currentDocumentsRootUri}
                onESignaturesModalClick={onESignaturesModalClick}
                onDocumentDataChange={onDocumentDataChange}
                isSiteReadOnly={isSiteReadOnly}
                onEditTagsAndMetadataModalClick={onEditAttributesModalClick}
                filterTag={filterTag}
                onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                onDocumentWorkflowsModalClick={onDocumentWorkflowsModalClick}
                onDocumentReviewModalClick={onDocumentReviewModalClick}
                deleteFolder={deleteFolder}
                trackScrolling={trackScrolling}
                isArchiveTabExpanded={isArchiveTabExpanded}
                addToPendingArchive={addToPendingArchive}
                deleteFromPendingArchive={deleteFromPendingArchive}
                archiveStatus={archiveStatus}
                infoDocumentId={infoDocumentId}
                onDocumentInfoClick={onDocumentInfoClick}
              />
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
                    {formkiqVersion.type !== 'core' && (
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
                        <div className="pt-3 flex justify-between text-sm font-semibold text-primary-500">
                          Attributes
                          {!isSiteReadOnly && (
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
                                      {item?.stringValue && (
                                        <span>{item.stringValue}</span>
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
                                              <span
                                                key={`attr_string_${item.key}_${index}`}
                                              >
                                                {val}
                                                {index <
                                                  item.stringValues.length -
                                                    1 && <hr />}
                                              </span>
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
                    <div className="mt-4 w-full flex justify-center">
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
                    {formkiqVersion.type !== 'core' && (
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
                            onDocumentWorkflowsModalClick(event, documentLine);
                          }}
                        >
                          View
                          {isSiteReadOnly ? (
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
                          {isSiteReadOnly ? (
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
                                  : action.status === 'FAILED'
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
                                User: {action.userEmail || action.userId}
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
                            onClick={restoreDocument(
                              currentDocument,
                              currentSiteId,
                              null
                            )}
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
                                onClick={onDeleteDocument(
                                  currentDocument,
                                  null
                                )}
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
                            isSiteReadOnly={isSiteReadOnly}
                            formkiqVersion={formkiqVersion}
                            onDeleteClick={deleteFolder(currentDocument)}
                            onShareClick={onShareClick}
                            onEditTagsAndMetadataModalClick={
                              onEditAttributesModalClick
                            }
                            onRenameModalClick={onRenameModalClick}
                            onMoveModalClick={onMoveModalClick}
                            onDocumentVersionsModalClick={
                              onDocumentVersionsModalClick
                            }
                            onDocumentWorkflowsModalClick={
                              onDocumentWorkflowsModalClick
                            }
                            onESignaturesModalClick={onESignaturesModalClick}
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
      <ShareModal
        isOpened={isShareModalOpened}
        onClose={onShareClose}
        getValue={getShareModalValue}
        value={shareModalValue}
      />
      <EditAttributesModal
        isOpened={isEditAttributesModalOpened}
        onClose={onEditAttributesModalClose}
        siteId={currentSiteId}
        getValue={getEditAttributesModalValue}
        value={editAttributesModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <DocumentVersionsModal
        isOpened={isDocumentVersionsModalOpened}
        onClose={onDocumentVersionsModalClose}
        onUploadClick={onUploadClick}
        isUploadModalOpened={isUploadModalOpened}
        siteId={currentSiteId}
        isSiteReadOnly={isSiteReadOnly}
        documentsRootUri={currentDocumentsRootUri}
        value={documentVersionsModalValue}
      />
      <DocumentWorkflowsModal
        isOpened={isDocumentWorkflowsModalOpened}
        onClose={onDocumentWorkflowsModalClose}
        siteId={currentSiteId}
        isSiteReadOnly={isSiteReadOnly}
        documentsRootUri={currentDocumentsRootUri}
        value={documentWorkflowsModalValue}
      />
      <ESignaturesModal
        isOpened={isESignaturesModalOpened}
        onClose={onESignaturesModalClose}
        siteId={currentSiteId}
        value={eSignaturesModalValue}
      />
      <NewModal
        isOpened={isNewModalOpened}
        onClose={onNewClose}
        siteId={currentSiteId}
        formkiqVersion={formkiqVersion}
        value={newModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <RenameModal
        isOpened={isRenameModalOpened}
        onClose={onRenameModalClose}
        siteId={currentSiteId}
        value={renameModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <MoveModal
        isOpened={isMoveModalOpened}
        onClose={onMoveModalClose}
        siteId={currentSiteId}
        value={moveModalValue}
        allTags={allTags}
        onDocumentDataChange={onDocumentDataChange}
      />
      <UploadModal
        isOpened={isUploadModalOpened}
        onClose={onUploadClose}
        siteId={currentSiteId}
        formkiqVersion={formkiqVersion}
        folder={subfolderUri}
        documentId={uploadModalDocumentId}
        isFolderUpload={false}
        onDocumentDataChange={onDocumentDataChange}
        dropUploadDocuments={dropUploadDocuments}
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
      />
      <DocumentReviewModal
        isOpened={isDocumentReviewModalOpened}
        onClose={onDocumentReviewModalClose}
        siteId={currentSiteId}
        value={documentReviewModalValue}
      />
      <MultiValuedAttributeModal
        item={multivaluedAttributeModalValue}
        isOpened={isMultivaluedAttributeModalOpened}
        onClose={onMultiValuedAttributeModalClose}
      />
    </>
  );
}

export default Documents;
