import { Helmet } from "react-helmet-async"
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { DocumentsService } from '../../helpers/services/documentsService'
import { IDocument, requestStatusTypes } from "../../helpers/types/document"
import { IDocumentTag } from "../../helpers/types/documentTag"
import { IFolder } from "../../helpers/types/folder"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { RootState } from '../../Store/store';
import { connect, useDispatch } from "react-redux";
import { SubfolderUri, User } from '../../Store/reducers/auth';
import { Spinner, FolderOutline, View, Edit, Download, Trash, Undo, ChevronLeft, ChevronRight, Close, Tag } from "../../Components/Icons/icons"
import ShareModal from "../../Components/Share/share"
import EditTagsAndMetadataModal from "../../Components/DocumentsAndFolders/EditTagsAndMetadataModal/editTagsAndMetadataModal"
import DocumentVersionsModal from "../../Components/DocumentsAndFolders/DocumentVersionsModal/documentVersionsModal"
import ESignaturesModal from "../../Components/DocumentsAndFolders/ESignatures/eSignaturesModal"
import NewModal from "../../Components/DocumentsAndFolders/NewModal/newModal"
import RenameModal from "../../Components/DocumentsAndFolders/RenameModal/renameModal"
import MoveModal from "../../Components/DocumentsAndFolders/MoveModal/moveModal"
import UploadModal from "../../Components/DocumentsAndFolders/UploadModal/uploadModal"
import DocumentActionsPopover from "../../Components/DocumentsAndFolders/DocumentActionsPopover/documentActionsPopover"
import AllTagsPopover from "../../Components/DocumentsAndFolders/AllTagsPopover/allTagsPopover"
import DocumentListLine from "../../Components/DocumentsAndFolders/DocumentListLine/documentListLine"
import FolderDropWrapper from "../../Components/DocumentsAndFolders/FolderDropWrapper/folderDropWrapper"
import { fetchDocuments, fetchDeleteDocument, fetchDeleteFolder, setDocuments, updateDocumentsList } from "../../Store/reducers/documentsList"
import { setCurrentActionEvent } from '../../Store/reducers/config'
import { setAllTags } from "../../Store/reducers/data"
import CustomDragLayer from "../../Components/DocumentsAndFolders/CustomDragLayer/customDragLayer"
import { ILine } from '../../helpers/types/line'
import { TagsForFilterAndDisplay } from '../../helpers/constants/primaryTags'
import { openDialog } from "../../Store/reducers/globalConfirmControls"
import { formatDate, getCurrentSiteInfo, getUserSites, parseSubfoldersFromUrl } from '../../helpers/services/toolService'
import moment from "moment"
import { getFileIcon } from "../../helpers/services/toolService"
import { InlineViewableContentTypes, OnlyOfficeContentTypes } from "../../helpers/constants/contentTypes";
import AddTag from '../../Components/DocumentsAndFolders/AddTag/addTag';
import { TopLevelFolders } from "../../helpers/constants/folders"
import FolderListLine from "../../Components/DocumentsAndFolders/FolderListLine/FolderListLine"
import { setCurrentDocumentPath } from '../../Store/reducers/data'

function Documents(props: {
  subfolderUri: SubfolderUri;
  user: User;
  documents: IDocument[];
  folders: IFolder[];
  nextToken: string;
  nextLoadingStatus: requestStatusTypes;
  currentSearchPage: number;
  isLastSearchPageLoaded: boolean;
  isSidebarExpanded: boolean;
  currentActionEvent: string;
  brand: string;
  formkiqVersion: any;
  tagColors: any[];
  useIndividualSharing: boolean;
  useFileFilter: boolean;
  useCollections: boolean;
  useSoftDelete: boolean;
  allTags: any[];
}) {
  const documentsWrapperRef = useRef(null);
  const documentsScrollpaneRef = useRef(null);
  const navigate = useNavigate();
  const { user } = props;
  const {
    subfolderLevel01,
    subfolderLevel02,
    subfolderLevel03,
    subfolderLevel04,
    subfolderLevel05,
    subfolderLevel06,
    subfolderLevel07,
    subfolderLevel08,
    subfolderLevel09,
    subfolderLevel10,
  } = useParams();
  const subfolderUri = parseSubfoldersFromUrl(
    subfolderLevel01,
    subfolderLevel02,
    subfolderLevel03,
    subfolderLevel04,
    subfolderLevel05,
    subfolderLevel06,
    subfolderLevel07,
    subfolderLevel08,
    subfolderLevel09,
    subfolderLevel10
  )
  const search = useLocation().search;
  const searchWord = new URLSearchParams(search).get('searchWord');
  const searchFolder = new URLSearchParams(search).get('searchFolder');
  const filterTag = new URLSearchParams(search).get('filterTag');
  const actionEvent = new URLSearchParams(search).get('actionEvent');
  const { hash } = useLocation();
  const { hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites } = getUserSites(user);
  const pathname = useLocation().pathname
  const { siteId, siteRedirectUrl, siteDocumentsRootUri, siteDocumentsRootName } = getCurrentSiteInfo(pathname, user, hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites)
  if (siteRedirectUrl.length) {
    navigate(
      {
        pathname: `${siteRedirectUrl}`
      },
      {
        replace: true,
      }
    );
  }
  const [currentSiteId, setCurrentSiteId] = useState(siteId);
  const [currentDocumentsRootUri, setCurrentDocumentsRootUri] = useState(siteDocumentsRootUri);
  const [currentDocumentsRootName, setCurrentDocumentsRootName] = useState(siteDocumentsRootName);
  const [isTagFilterExpanded, setIsTagFilterExpanded] = useState(false);
  const [infoDocumentId, setInfoDocumentId] = useState('');
  const [infoDocumentView, setInfoDocumentView] = useState('info');
  const [infoTagEditMode, setInfoTagEditMode] = useState(false);
  // NOTE: not fully implemented;
  // using the edit metadata modal for now, to be replaced with new system to indicate diff between tag, metadata, and versioned metadata
  const [infoMetadataEditMode, setInfoMetadataEditMode] = useState(false);
  const [currentDocument, setCurrentDocument]: [IDocument | null, any] = useState(null);
  const [currentDocumentTags, setCurrentDocumentTags]: [
    IDocumentTag[] | null,
    any
  ] = useState([]);
  const [currentDocumentVersions, setCurrentDocumentVersions] = useState(null);
  const [isCurrentDocumentSoftDeleted, setIsCurrentDocumentSoftDeleted] =
    useState(false);
  const [isUploadModalOpened, setUploadModalOpened] = useState(false);
  const [isFolderUploadModalOpened, setFolderUploadModalOpened] = useState(false);
  const [uploadModalDocumentId, setUploadModalDocumentId] = useState('');
  const [folderUploadModalDocumentId, setFolderUploadModalDocumentId] = useState('');
  const [shareModalValue, setShareModalValue] = useState<ILine | null>(null);
  const [isShareModalOpened, setShareModalOpened] = useState(false);
  const [editTagsAndMetadataModalValue, setEditTagsAndMetadataModalValue] = useState<ILine | null>(
    null
  );
  const [isEditTagsAndMetadataModalOpened, setEditTagsAndMetadataModalOpened] = useState(false);
  const [documentVersionsModalValue, setDocumentVersionsModalValue] =
    useState<ILine | null>(null);
  const [isDocumentVersionsModalOpened, setDocumentVersionsModalOpened] =
    useState(false);
  const [eSignaturesModalValue, setESignaturesModalValue] =
    useState<ILine | null>(null);
  const [isESignaturesModalOpened, setESignaturesModalOpened] = useState(false);
  const [newModalValue, setNewModalValue] = useState<ILine | null>(null);
  const [isNewModalOpened, setNewModalOpened] = useState(false);
  const [renameModalValue, setRenameModalValue] = useState<ILine | null>(null);
  const [isRenameModalOpened, setRenameModalOpened] = useState(false);
  const [moveModalValue, setMoveModalValue] = useState<ILine | null>(null);
  const [isMoveModalOpened, setMoveModalOpened] = useState(false);
  const dispatch = useDispatch();
  let documentListOffsetTop = 140;
  if (isTagFilterExpanded) {
    documentListOffsetTop = 170;
  }

  // TODO: improve on this check / determine why setting modules is not happening in time or without reload
  if (props.formkiqVersion.modules === undefined) {
    window.location.reload()
  }

  const trackScrolling = useCallback(() => {
    const bottomRow = (
      document.getElementById('documentsTable') as HTMLTableElement
    ).rows[
      (document.getElementById('documentsTable') as HTMLTableElement).rows
        .length - 1
    ].getBoundingClientRect().bottom;
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.scrollTop + el.offsetHeight >= bottomRow - documentListOffsetTop;
      }
      return false;
    };
    const scrollpane = document.getElementById('documentsScrollpane');
    if (
      isBottom(scrollpane as HTMLElement) &&
      props.nextToken &&
      props.nextLoadingStatus === requestStatusTypes.fulfilled
    ) {
      if (props.nextToken) {
        dispatch(
          fetchDocuments({
            siteId: currentSiteId,
            formkiqVersion: props.formkiqVersion,
            searchWord,
            searchFolder,
            subfolderUri,
            filterTag,
            nextToken: props.nextToken,
          }) as any
        );
      } else {
        if (!props.isLastSearchPageLoaded && searchWord) {
          dispatch(
            fetchDocuments({
              // for next page results
              siteId: currentSiteId,
              formkiqVersion: props.formkiqVersion,
              searchWord,
              searchFolder,
              subfolderUri,
              filterTag,
              page: props.currentSearchPage + 1,
            }) as any
          );
        }
      }
    }
  }, [
    props.nextToken,
    props.nextLoadingStatus,
    props.currentSearchPage,
    props.isLastSearchPageLoaded,
  ]);
  if (documentsWrapperRef.current) {
    (documentsWrapperRef.current as HTMLDivElement).style.height =
      window.innerHeight - documentListOffsetTop + 'px';
  }
  window.addEventListener('resize', (event) => {
    if (documentsWrapperRef.current) {
      (documentsWrapperRef.current as HTMLDivElement).style.height =
        (window.innerHeight - documentListOffsetTop) + 'px';
    }
  });

  useEffect(() => {
    DocumentsService.getAllTagKeys(currentSiteId).then((response: any) => {
      const allTagData = {
        allTags: response?.values,
        tagsLastRefreshed: new Date(),
        tagsSiteId: currentSiteId
      }
      dispatch(setAllTags(allTagData))
    })
    if (infoDocumentId.length) {
      DocumentsService.getDocumentById(infoDocumentId, currentSiteId).then((response: any) => {
        setCurrentDocument(response);
        // TODO: set folder to selected document path?
        updateTags();
      });
    }
    dispatch(setCurrentDocumentPath(''))
    if (documentsWrapperRef.current) {
      (documentsWrapperRef.current as HTMLDivElement).style.height =
        ((window.innerHeight - documentListOffsetTop) + 400) + 'px';
    }
    if (documentsScrollpaneRef.current) {
      (documentsScrollpaneRef.current as HTMLDivElement).addEventListener(
        'scroll',
        trackScrolling
      );
    }
  }, [infoDocumentId]);

  useEffect(() => {
    if (hash.indexOf('#id=') > -1) {
      setInfoDocumentId(hash.substring(4));
    } else {
      setInfoDocumentId('')
    }
  }, [hash]);

  useEffect(() => {
    if (props.currentActionEvent && props.currentActionEvent.length) {
      switch (props.currentActionEvent) {
        case 'upload':
          if (currentDocument) {
            onUploadClick({}, (currentDocument as IDocument).documentId)
          } else {
            onUploadClick({}, '')
          }
          break
        case 'new':
          onNewClick({}, {
            lineType: 'folder',
            folder: subfolderUri,
            documentId: '',
            documentInstance: null,
            folderInstance: null,
          })
          break
        case 'folderUpload':
          onFolderUploadClick({})
          break
      }
    } else if (actionEvent && actionEvent.length > 0) {
      switch (actionEvent) {
        case 'upload':
          if (currentDocument) {
            onUploadClick({}, (currentDocument as IDocument).documentId)
          } else {
            onUploadClick({}, '')
          }
          break
        case 'new':
          onNewClick({}, {
            lineType: 'folder',
            folder: subfolderUri,
            documentId: '',
            documentInstance: null,
            folderInstance: null,
          })
          break
        case 'folderUpload':
          onFolderUploadClick({})
          break
      }
    }
  }, [props.currentActionEvent, actionEvent]);

  const updateTags = () => {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentTags(infoDocumentId, currentSiteId).then((response: any) => {
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
      });
      if (props.formkiqVersion.type !== 'core') {
        DocumentsService.getDocumentVersions(infoDocumentId, currentSiteId).then((response: any) => {
          if (response) {
            setCurrentDocumentVersions(response.documents)
          }
        });
      }
    }
  };

  useEffect(() => {
    const recheckSiteInfo = getCurrentSiteInfo(pathname, user, hasUserSite, hasDefaultSite, hasSharedFolders, sharedFolderSites)
    if (recheckSiteInfo.siteRedirectUrl.length) {
      navigate(
        {
          pathname: `${recheckSiteInfo.siteRedirectUrl}`
        },
        {
          replace: true,
        }
      );
    }
    setCurrentSiteId(recheckSiteInfo.siteId)
    setCurrentDocumentsRootUri(recheckSiteInfo.siteDocumentsRootUri)
    setCurrentDocumentsRootName(recheckSiteInfo.siteDocumentsRootName)
  }, [pathname])

  useEffect(() => {
    // TODO: create a refresh required status to prevent "Cancel" on modal from trigerring refresh?
    if (isUploadModalOpened === false && isFolderUploadModalOpened === false && isNewModalOpened === false && isMoveModalOpened === false && isRenameModalOpened === false) {
      dispatch(setDocuments({ documents: null, nextLoadingStatus: requestStatusTypes.pending }));
      setTimeout(() => {
        dispatch(
          fetchDocuments({
            siteId: currentSiteId,
            formkiqVersion: props.formkiqVersion,
            searchWord,
            searchFolder,
            subfolderUri,
            filterTag,
          }) as any
        );
      }, 300)
    }
  }, [currentSiteId, search, subfolderUri, filterTag, isUploadModalOpened, isFolderUploadModalOpened, isNewModalOpened, isMoveModalOpened, isRenameModalOpened]);

  useEffect(() => {
    if (documentsWrapperRef.current) {
      (documentsWrapperRef.current as HTMLDivElement).style.height =
        window.innerHeight - documentListOffsetTop + 'px';
      const bottomRow = (
        document.getElementById('documentsTable') as HTMLTableElement
      ).rows[
        (document.getElementById('documentsTable') as HTMLTableElement).rows
          .length - 1
      ].getBoundingClientRect().bottom;
      if (bottomRow < window.innerHeight && props.nextToken) {
        dispatch(
          fetchDocuments({
            siteId: currentSiteId,
            formkiqVersion: props.formkiqVersion,
            searchWord,
            searchFolder,
            subfolderUri,
            filterTag,
            nextToken: props.nextToken,
          }) as any
        );
      }
    }
    if (documentsScrollpaneRef.current) {
      (documentsScrollpaneRef.current as HTMLDivElement).removeEventListener(
        'scroll',
        trackScrolling
      );
      (documentsScrollpaneRef.current as HTMLDivElement).addEventListener(
        'scroll',
        trackScrolling
      );
    }
    return () => {
      if (documentsScrollpaneRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        (documentsScrollpaneRef.current as HTMLDivElement).removeEventListener(
          'scroll',
          trackScrolling
        );
      }
    };
  }, [
    props.nextToken,
    props.nextLoadingStatus,
    props.currentSearchPage,
    props.isLastSearchPageLoaded,
  ]);

  const deleteDocument = (file: IDocument, searchDocuments: any) => () => {
    const deleteFunc = () => {
      let isDocumentInfoPage = false;
      if (infoDocumentId.length) {
        isDocumentInfoPage = true;
        setIsCurrentDocumentSoftDeleted(true);
      }
      dispatch(
        fetchDeleteDocument({
          siteId: currentSiteId,
          user: props.user,
          document: file,
          documents: searchDocuments,
          isDocumentInfoPage: isDocumentInfoPage,
        }) as any
      );
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this document?',
      })
    );
  };
  const deleteFolder = (folder: IFolder) => () => {
    const deleteFunc = () => {
      dispatch(fetchDeleteFolder({ user: props.user, folder }) as any);
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this folder?',
      })
    );
  };
  const restoreDocument = (file: IDocument, siteId: string, searchDocuments: any) => () => {
    DocumentsService.deleteDocumentTag(file.documentId, siteId, 'sysDeletedBy').then(
      (response) => {
        let newDocs = null;
        if (searchDocuments) {
          newDocs = searchDocuments.filter((doc: any) => {
            if (doc.documentId === file.documentId) {
              return false;
            } else {
              return true;
            }
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
      }
    );
  };
  const onTagDelete = (tagKey: string) => {
    if (infoDocumentId.length) {
      const deleteFunc = () => {
        updateTags();
        DocumentsService.deleteDocumentTag(infoDocumentId, currentSiteId, tagKey).then(() => {
          updateTags();
        });
        setTimeout(() => {
          onTagChange(null, null);
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
    dispatch(setCurrentActionEvent(''))
    setUploadModalOpened(true);
    setUploadModalDocumentId(documentId);
  };
  const onUploadClose = () => {
    setUploadModalOpened(false);
  };
  const onFolderUploadClick = (event: any) => {
    dispatch(setCurrentActionEvent(''))
    setFolderUploadModalOpened(true);
    setFolderUploadModalDocumentId('');
  };
  const onFolderUploadClose = () => {
    setFolderUploadModalOpened(false);
  };
  const onEditTagsAndMetadataModalClick = (event: any, value: ILine | null) => {
    setEditTagsAndMetadataModalValue(value);
    setEditTagsAndMetadataModalOpened(true);
  };
  const onEditTagsAndMetadataModalClose = () => {
    setEditTagsAndMetadataModalOpened(false);
    updateTags();
  };
  const getEditTagsAndMetadataModalValue = () => {
    return editTagsAndMetadataModalValue;
  };
  const onDocumentVersionsModalClick = (event: any, value: ILine | null) => {
    setDocumentVersionsModalValue(value);
    setDocumentVersionsModalOpened(true);
  };
  const onDocumentVersionsModalClose = () => {
    setDocumentVersionsModalOpened(false);
  };
  const onESignaturesModalClick = (event: any, value: ILine | null) => {
    setESignaturesModalValue(value);
    setESignaturesModalOpened(true);
  };
  const onESignaturesModalClose = () => {
    setESignaturesModalValue(null);
    setESignaturesModalOpened(false);
  };
  const onTagChange = (event: any, value: ILine | null) => {
    dispatch(setDocuments({ documents: null }));
    dispatch(
      fetchDocuments({
        siteId: currentSiteId,
        formkiqVersion: props.formkiqVersion,
        searchWord,
        searchFolder,
        subfolderUri,
        filterTag,
      }) as any
    );
  };
  const onNewClick = (event: any, value: ILine | null) => {
    dispatch(setCurrentActionEvent(''))
    if (TopLevelFolders.indexOf(subfolderUri) !== -1) {
      // TODO: add redirect or messaging of location of new file, as it won't be in the TopLevelFolder
      value = {
        lineType: 'folder',
        folder: '',
        documentId: '',
        documentInstance: null,
        folderInstance: null,
      }
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
  const onMoveModalClick = (event: any, value: ILine | null) => {
    setMoveModalValue(value);
    setMoveModalOpened(true);
  };
  const onMoveModalClose = () => {
    setMoveModalOpened(false);
  };
  const DownloadDocument = () => {
    if (infoDocumentId.length) {
      DocumentsService.getDocumentUrl(infoDocumentId, currentSiteId, '', false).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  };
  const ViewDocument = () => {
    if (infoDocumentId.length) {
      navigate(`${currentDocumentsRootUri}/${infoDocumentId}/view`);
    }
  };
  const onFilterTag = (event: any, tag: string) => {
    if (filterTag === tag) {
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

  const foldersPath = (uri: string) => {
    if (uri) {
      const folderLevels = uri.split('/');
      if (folderLevels.length > 3) {
        const previousFolderLevel = uri.substring(0, uri.lastIndexOf('/'))
        return (
          <span className={'flex pl-4 py-2 text-gray-500 bg-white text-gray-500'}>
            <span className="pr-1">
              <Link
                to={`${currentDocumentsRootUri}`}
                className="hover:text-coreOrange-600"
                >
                { siteDocumentsRootName.replace('Shared Folder: ', '') }:
              </Link>
            </span>
            <p className={'flex px-1'}> / </p>
              <FolderDropWrapper folder={folderLevels[0]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                <Link to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}>{folderLevels[0]}</Link>
              </FolderDropWrapper>
            <p className={'flex px-1'}> / </p>
            <span>..</span>
            <p className={'flex px-1'}> / </p>
            <FolderDropWrapper folder={previousFolderLevel} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
              <Link to={`${currentDocumentsRootUri}/folders/` + uri.replace("/" + folderLevels[folderLevels.length - 1], "/") }>{folderLevels[folderLevels.length - 2]}</Link>
            </FolderDropWrapper>
            <p className={'flex px-1'}> / </p>
            <span className={'flex items-center mt-1 mr-1.5 w-5'}>
              <FolderOutline /> 
            </span>
            <span>{folderLevels[folderLevels.length - 1]}</span>
          </span>
        )
      } else {
        return(
          <span className={'flex pl-4 py-2 text-gray-500 bg-white text-gray-500'}>
            <span className="pr-1">
              <Link
                to={`${currentDocumentsRootUri}`}
                className="hover:text-coreOrange-600"
                >
                { siteDocumentsRootName.replace('Shared Folder: ', '') }:
              </Link>
            </span>
            { folderLevels.length > 1 && (
              <>
                <p className={'flex px-1'}> / </p>
                <FolderDropWrapper folder={folderLevels[0]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                  <Link
                    to={`${currentDocumentsRootUri}/folders/` + folderLevels[0]}
                    className="hover:text-coreOrange-600"
                    >
                    {folderLevels[0]}
                  </Link>
                </FolderDropWrapper>
              </>
            )}
            { folderLevels.length > 2 && (
              <>
                <p className={'flex px-1'}> / </p>
                <FolderDropWrapper folder={folderLevels[0] + '/' + folderLevels[1]} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
                  <Link
                    to={`${currentDocumentsRootUri}/folders/` + folderLevels[0] + "/" + folderLevels[folderLevels.length - 2]}
                    className="hover:text-coreOrange-600"
                    >
                    {folderLevels[folderLevels.length - 2]}
                  </Link>
                </FolderDropWrapper>
              </>
            )}
            <p className={'flex px-1'}> / </p>
            <FolderDropWrapper folder={uri} sourceSiteId={currentSiteId} targetSiteId={currentSiteId} className={'flex items-start'}>
              <span className={'flex items-center mt-1 mr-1.5 w-5'}>
                <FolderOutline /> 
              </span>
              <span>{folderLevels[folderLevels.length - 1]}</span>
            </FolderDropWrapper>
          </span>
        )
      }
    }
    return (
      <span className={'hidden flex pl-4 py-2 text-gray-500 bg-white text-gray-500'}>
        <span className="pr-1">
          { siteDocumentsRootName.replace('Shared Folder: ', '') }
        </span>
      </span>
    )
  }

  const filtersAndTags = () => {
    let tagsToCheck: string[] = [];
    let showAllTagsPopover = true
    let minTagsToShowForFilter = 3;
    tagsToCheck = tagsToCheck.concat(TagsForFilterAndDisplay);
    if (
      filterTag &&
      filterTag.length &&
      tagsToCheck.indexOf(filterTag) === -1
    ) {
      tagsToCheck.push(filterTag);
    }
    if (tagsToCheck.length === 0) {
      const tagsToConsider = props.allTags.filter((tag: any) => {
        return tag.value.indexOf('sys') !== 0 && tag.value.indexOf('path') && tag.value.indexOf('untagged') !== 0
      });
      const numberOfTagsToAdd = tagsToConsider.length > minTagsToShowForFilter ? minTagsToShowForFilter : tagsToConsider.length
      if (numberOfTagsToAdd < minTagsToShowForFilter) {
        showAllTagsPopover = false
      }
      for (let i = 0; i < numberOfTagsToAdd; i++) {
        tagsToCheck.push(tagsToConsider[i].value)
      }
    }
    return (
      <div className="flex items-center justify-start">
        <div className="w-1/3 pl-4">
          { props.useFileFilter && (
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
          { tagsToCheck.length ? (
            <>
              <ul className="flex flex-wrap justify-end mt-1">            
                {tagsToCheck.map((primaryTag, i) => {
                  let tagColor = 'gray'
                  if (props.tagColors) {
                    props.tagColors.forEach((color: any) => {
                      if (color.tagKeys.indexOf(primaryTag) > -1) {
                        tagColor = color.colorUri
                        return;
                      }
                    })
                  }
                  return (
                    <li
                      key={i}
                      className={
                        (filterTag === primaryTag
                          ? 'bg-coreOrange-500 text-white'
                          : `bg-${tagColor}-200 text-black`) +
                        ' text-xs p-1 px-2 mx-1 cursor-pointer'
                      }
                      onClick={(event) => onFilterTag(event, primaryTag)}
                    >
                      {primaryTag}
                    </li>
                  );
                })}
              </ul>
              { showAllTagsPopover && (
                <AllTagsPopover siteId={currentSiteId} tagColors={props.tagColors} onFilterTag={onFilterTag} filterTag={filterTag} />
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

  const documentsTable = (
    documents: any[] | null,
    subfolders: any[] | null
  ) => {
    if (documents) {
      const docs = documents as [];
      const folders = subfolders as [];
      return docs.length > 0 || folders.length > 0 ? (
        <div
          className="relative mt-5 overflow-hidden"
          ref={documentsWrapperRef}
        >
          <div
            className="overflow-scroll h-full"
            ref={documentsScrollpaneRef}
            id="documentsScrollpane"
          >
            <table
              className="border-separate border-spacing-0 table-auto w-full"
              id="documentsTable"
            >
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 border-t border-b border-gray-300"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="w-38 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 border-t border-b border-gray-300"
                  >
                    Last modified
                  </th>
                  <th
                    scope="col"
                    className="w-24 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 border-t border-b border-gray-300"
                  >
                    Filesize
                  </th>
                  {props.useIndividualSharing && (
                    <th
                      scope="col"
                      className="w-24 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 border-t border-b border-gray-300"
                      >
                      {subfolderUri === 'shared' && <span>Shared by</span>}
                      {subfolderUri !== 'shared' && <span>Access</span>}
                    </th>
                  )}
                  <th
                    scope="col"
                    className="w-28 px-4 py-2 text-left font-semibold text-sm text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600 border-t border-b border-gray-300"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="h-2"></td>
                </tr>
                {folders && folderDocumentsTable(folders, subfolderUri)}
                {docs.map((file, i) => (
                  <DocumentListLine
                    key={i}
                    file={file}
                    folder={subfolderUri}
                    siteId={currentSiteId}
                    documentsRootUri={currentDocumentsRootUri}
                    onShareClick={onShareClick}
                    searchDocuments={documents}
                    onDeleteClick={deleteDocument(file, documents)}
                    onRestoreClick={restoreDocument(file, currentSiteId, documents)}
                    onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                    onRenameModalClick={onRenameModalClick}
                    onMoveModalClick={onMoveModalClick}
                    onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                    onESignaturesModalClick={onESignaturesModalClick}
                    onTagChange={onTagChange}
                    filterTag={filterTag}
                    brand={props.brand}
                    useIndividualSharing={props.useIndividualSharing}
                    useCollections={props.useCollections}
                    useSoftDelete={props.useSoftDelete}
                  />
                ))}
              </tbody>
            </table>
            <FolderDropWrapper
              className="absolute w-full h-full"
              folder={subfolderUri}
              sourceSiteId={currentSiteId}
              targetSiteId={currentSiteId}
            ></FolderDropWrapper>
          </div>
          <div className="pt-1">
            &nbsp;
            {props.nextLoadingStatus === requestStatusTypes.pending ? (
              <Spinner />
            ) : (
              ''
            )}
          </div>
          <CustomDragLayer />
        </div>
      ) : (
        <div className="text-center mt-4">
          <div role="status">
            <div className="overflow-x-auto flex justify-center">
              { subfolderUri.length ? (
                <span>
                  No subfolders or files have been found in this folder
                </span>
              ) : (
                <div className="mt-4 w-2/3 p-2 border border-gray-400 rounded-md text-gray-900 font-semibold bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300">
                  <h3 className="text-lg mb-4">
                    No documents or folders found
                  </h3>
                  { props.formkiqVersion.modules.indexOf('onlyoffice') > -1 ? (
                    <p>
                      You can create folders and documents or upload existing documents using the buttons above.
                    </p>
                  ) : (
                    <p>
                      You can create folders or upload existing documents using the buttons above.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  };

  const folderDocumentsTable = (folders: IFolder[], subfolder: string) => {
    return (
      <tr>
        <td colSpan={6}>
          {folders.map((folder: IFolder, j: number) => {
            return (
              <FolderListLine
                subfolder={subfolder}
                folderInstance={folder}
                key={j}
                currentSiteId={currentSiteId}
                onDeleteClick={deleteFolder}
                currentDocumentsRootUri={currentDocumentsRootUri}
                onShareClick={onShareClick}
                onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                onRenameModalClick={onRenameModalClick}
                onMoveModalClick={onMoveModalClick}
                onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                onESignaturesModalClick={onESignaturesModalClick}
                onTagChange={onTagChange}
                filterTag={filterTag}
                onRestoreDocument={restoreDocument}
                onDeleteDocument={deleteDocument}
              />
            )
          })}
        </td>
      </tr>
    );
  };

  const viewDocumentVersion = (versionKey: string) => {
    if (infoDocumentId) {
      if (versionKey !== undefined) {
        window.open(`${window.location.origin}${currentDocumentsRootUri}/${infoDocumentId}/view?versionKey=${versionKey}`)
      } else {
        window.open(`${window.location.origin}${currentDocumentsRootUri}/${infoDocumentId}/view`)
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Documents</title>
      </Helmet>
      <div className="h-[calc(100vh-3.68rem)] flex">
        <div className="grow">
          <div className="flex mt-2 h-8">
            <div className="grow">
              { foldersPath(subfolderUri) }
            </div>
            <div className="flex w-20 items-end">
              <div
                className={(isTagFilterExpanded ? 'text-coreOrange-500 ' : 'text-gray-400 ') + ' w-5 cursor-pointer'}
                onClick={event => {
                  if (filterTag && filterTag.length) {
                    setIsTagFilterExpanded(true)
                  } else {
                    setIsTagFilterExpanded(!isTagFilterExpanded)
                  }
                }}
                >
                <Tag />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex-1 inline-block">
              { isTagFilterExpanded && (
                <div className="pt-2 pr-8">
                  {filtersAndTags()}
                </div>
              )}
              {documentsTable(props.documents, props.folders)}
            </div>
          </div>
        </div>
        { infoDocumentId.length ? (
          <div className="h-[calc(100vh-3.68rem)] flex w-72 bg-gradient-to-l from-gray-50 via-stone-50 to-gray-100 border-l border-gray-300">
            <div className="flex-1 inline-block">
              {currentDocument ? (
                <div className="flex flex-wrap justify-center">
                  <div className="w-full flex grow-0 pl-2 pt-3 justify-start">
                    <div className="w-12">
                      <img
                        alt="File Icon"
                        src={getFileIcon((currentDocument as IDocument).path)}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="grow-0 w-52 px-2 leading-5 font-bold text-base text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600">
                      {(currentDocument as IDocument).path}
                      {isCurrentDocumentSoftDeleted && (
                        <small className="block text-red-500 uppercase">
                          (deleted)
                        </small>
                      )}
                    </div>
                    <div className="w-8 grow-0 flex justify-start">
                      <div
                        className="w-4 mt-0.5 h-4 cursor-pointer text-gray-400"
                        onClick={event => {
                          setInfoDocumentId('')
                          window.location.hash = ''
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
                        setInfoDocumentView('info')
                      }}
                      >
                      <div className={(infoDocumentView === 'info' ? 'text-coreOrange-500 ' : 'text-gray-400 ') + ' text-center'}>
                        Info
                      </div>
                      <div className="flex justify-center">
                        <hr className={(infoDocumentView === 'info' ? 'border-coreOrange-500 ' : 'border-transparent ') + ' w-1/2 rounded-xl border-b border'} />
                      </div>
                    </div>
                    { props.formkiqVersion.type !== 'core' && (
                      <div
                        className="w-1/3 text-sm font-semibold cursor-pointer"
                        onClick={(event) => {
                          setInfoDocumentView('history')
                        }}
                        >
                        <div className={(infoDocumentView === 'history' ? 'text-coreOrange-500 ' : 'text-gray-400 ') + ' text-center'}>
                          History
                        </div>
                        <div className="flex justify-center">
                          <hr className={(infoDocumentView === 'history' ? 'border-coreOrange-500 ' : 'border-transparent ') + ' w-1/2 rounded-xl border-b border'} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={(infoDocumentView === 'info' ? 'block ' : 'hidden ') + ' w-64 mr-12'}>
                    <dl className="p-4 pr-6 pt-2 text-medsmall text-gray-600">
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1">Location</dt>
                        <dd className="font-semibold text-sm text-coreOrange-600 hover:text-coreOrange-400">
                          { (currentDocument as IDocument).path.substring(0, (currentDocument as IDocument).path.lastIndexOf('/')).length ? (
                            <Link
                              to={siteDocumentsRootUri + '/folders/' + (currentDocument as IDocument).path.substring(0, (currentDocument as IDocument).path.lastIndexOf('/'))}
                              className="flex"
                              >
                              <span className="pr-1">
                                { siteDocumentsRootName.replace('Shared Folder: ', '') }: 
                              </span>
                              <span>
                                { (currentDocument as IDocument).path.substring(0, (currentDocument as IDocument).path.lastIndexOf('/')) }
                              </span>
                              <div className="w-4 pt-0.5">
                                < ChevronRight />
                              </div>
                            </Link>
                          ) : (
                            <Link
                              to={siteDocumentsRootUri}
                              className="flex"
                              >
                              { siteDocumentsRootName.replace('Shared Folder: ', '') }
                              <div className="w-4 pt-0.5">
                                < ChevronRight />
                              </div>
                            </Link>
                          )}
                        </dd>
                      </div>
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1">Added by</dt>
                        <dd className="font-semibold text-sm">
                          { (currentDocument as IDocument).userId }
                        </dd>
                      </div>
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1">Date added</dt>
                        <dd className="font-semibold text-sm">
                          {formatDate((currentDocument as IDocument).insertedDate)}
                        </dd>
                      </div>
                      <div className="flex flex-col pb-3">
                        <dt className="mb-1">Last modified</dt>
                        <dd className="font-semibold text-sm">
                          {formatDate((currentDocument as IDocument).lastModifiedDate)}
                        </dd>
                      </div>
                      <div className="w-68 flex mr-3 border-b"></div>
                      <div className="flex flex-col pt-3">
                        <dt className="mb-1 flex justify-between">
                          <span className="text-sm font-semibold text-coreOrange-500">
                            Tags
                          </span>
                          <div
                            className="w-3/5 flex font-semibold text-coreOrange-500 cursor-pointer"
                            onClick={(event) =>
                              setInfoTagEditMode(!infoTagEditMode)
                            }
                            >
                            { infoTagEditMode ? (
                              <>
                                <div className="w-4 pt-0.5">
                                  < ChevronLeft />
                                </div>
                                <span>
                                  cancel edit
                                </span>
                              </>
                            ) : (
                              <>
                                <span>
                                  edit tags
                                </span>
                                <div className="w-4 pt-0.5">
                                  < ChevronRight />
                                </div>
                              </>
                            )}
                          </div>
                        </dt>
                        <dd className="text-sm">
                          {currentDocumentTags &&
                          (currentDocumentTags as []).map(
                            (tag: any, i: number) => {
                              let isKeyOnlyTag = false;
                              if (
                                (tag.value !== undefined &&
                                  tag.value.length === 0) ||
                                (tag.values !== undefined &&
                                  tag.values.length === 0)
                              ) {
                                isKeyOnlyTag = true;
                              }
                              let tagColor = 'gray'
                              if (props.tagColors) {
                                props.tagColors.forEach((color: any) => {
                                  if (color.tagKeys.indexOf(tag.key) > -1) {
                                    tagColor = color.colorUri
                                    return;
                                  }
                                })
                              }
                              return (
                                <div key={i} className="inline">
                                  {isKeyOnlyTag && (
                                    <div className="pt-0.5 pr-1 flex items-center">
                                      <div className={`h-5.5 pl-2 rounded-l-md pr-1 bg-${tagColor}-200 flex items-center`}>
                                        {tag.key}
                                        { infoTagEditMode && (
                                          <button
                                            className="pl-2 font-semibold hover:text-red-600"
                                            onClick={(event) =>
                                              onTagDelete(tag.key)
                                            }
                                          >
                                            x
                                          </button>
                                        )}
                                      </div>
                                      <div className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}></div>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </dd>
                      </div>
                      { infoTagEditMode && (
                        <div className="flex mt-2">
                          <AddTag
                            line={{
                              lineType: 'document',
                              folder: subfolderUri,
                              documentId: (currentDocument as IDocument)
                                .documentId,
                              documentInstance: currentDocument as IDocument,
                              folderInstance: null,
                            }}
                            onTagChange={onTagChange}
                            updateTags={updateTags}
                            siteId={currentSiteId}
                            tagColors={props.tagColors}
                          />
                        </div>
                      )}
                      <div className="w-68 flex mt-3 mr-3 border-b"></div>
                      <div className="pt-3 flex justify-between text-sm font-semibold text-coreOrange-500"> 
                        Metadata
                        <div
                          className="w-3/5 flex text-medsmall font-semibold text-coreOrange-500 cursor-pointer"
                          onClick={(event) =>
                            onEditTagsAndMetadataModalClick(event, {
                              lineType: 'document',
                              folder: subfolderUri,
                              documentId: (currentDocument as IDocument)
                                .documentId,
                              documentInstance: currentDocument as IDocument,
                              folderInstance: null,
                            })
                          }
                          >
                          { infoMetadataEditMode ? (
                            <>
                              <div className="w-4 pt-0.5">
                                < ChevronLeft />
                              </div>
                              <span>
                                cancel edit
                              </span>
                            </>
                          ) : (
                            <>
                              <span>
                                add/edit metadata
                              </span>
                              <div className="w-4 pt-0.5">
                                < ChevronRight />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {currentDocumentTags && (currentDocumentTags as []).map(
                        (tag: any, i: number) => {
                          let isKeyOnlyTag = false;
                          if (
                            (tag.value !== undefined &&
                              tag.value.length === 0) ||
                            (tag.values !== undefined &&
                              tag.values.length === 0)
                          ) {
                            isKeyOnlyTag = true;
                          }
                          return (
                            <div key={i} className={(isKeyOnlyTag ? 'hidden' : 'inline') + ' flex flex-col pt-3'}>
                              <dt className="mb-1">
                                {tag.key}
                              </dt>
                              <dd className="font-semibold text-sm">
                                {tag.value && <span>{tag.value}</span>}
                                {tag.values !== undefined &&
                                  tag.values.map((value: any, j: number) => {
                                    return <span className="block">{value}</span>;
                                  })}
                              </dd>
                            </div>
                          );
                        }
                      )}
                    </dl>
                    <div className="mt-4 w-full flex justify-center">
                      <button
                        className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-4 rounded-2xl flex cursor-pointer"
                        onClick={DownloadDocument}
                      >
                        <span className="">Download</span>
                        <span className="w-7 pl-1 -mt-0.5">{Download()}</span>
                      </button>
                    </div>
                  </div>
                  <div className={(infoDocumentView === 'history' ? 'block ' : 'hidden ') + ' w-64 mr-12'}>
                    <span className="p-4 text-sm">
                      <dl className="p-4 pt-2 text-medsmall text-gray-600">
                        <div className="flex flex-col pb-3">
                          <dt className="mb-1">
                            {formatDate((currentDocument as IDocument).lastModifiedDate)}
                          </dt>
                          <dd className="font-semibold text-sm">
                            Current version added
                            <div
                              className="font-medium pt-1 ml-12 flex text-coreOrange-500 cursor-pointer"
                              onClick={(event) => {
                                viewDocumentVersion('')
                              }}
                              >
                              <span>
                                view this version
                              </span>
                              <div className="w-4 pt-0.5">
                                < ChevronRight />
                              </div>
                            </div>
                          </dd>
                        </div>
                        {currentDocumentVersions && (currentDocumentVersions as []).map(
                          (version: any, i: number) => {
                            return (
                              <div key={i} className="flex flex-col pb-3">
                                <dt className="mb-1">
                                  {formatDate(version.lastModifiedDate)}
                                </dt>
                                <dd className="font-semibold text-sm">
                                  { version.version === '1' ? (
                                      <span>
                                        Document added (initial version)
                                      </span>
                                    ) : (
                                      <span>
                                        Version added (version #{version.version})
                                      </span>
                                  )}
                                  <div
                                    className="font-medium pt-1 ml-12 flex text-coreOrange-500 cursor-pointer"
                                    onClick={(event) => {
                                      viewDocumentVersion(version.versionKey)
                                    }}
                                    >
                                    <span>
                                      view this version
                                    </span>
                                    <div className="w-4 pt-0.5">
                                      < ChevronRight />
                                    </div>
                                  </div>
                                </dd>
                              </div>
                            )
                          })
                        }
                      </dl>
                      <div className="mt-2 flex justify-center">
                        <button
                          className="bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-4 rounded-2xl flex cursor-pointer"
                          onClick={(event) => {
                            const documentLine: ILine = {
                              lineType: 'document',
                              folder: '',
                              documentId: infoDocumentId,
                              documentInstance: currentDocument,
                              folderInstance: null
                            }
                            onDocumentVersionsModalClick(event,  documentLine)
                          }}
                          >
                            View / Edit Versions
                        </button>
                      </div>
                    </span>
                  </div>
                  <div className="hidden overflow-x-auto relative">
                    <div className="-mr-[4.625rem] p-4 text-[0.8125rem] leading-6 text-slate-900">                     
                      <div className="flex gap-4 pb-10 border-t border-slate-400/20 justify-center items-center py-6">
                        {document &&
                          props.formkiqVersion.modules.indexOf('onlyoffice') > -1 &&
                          OnlyOfficeContentTypes.indexOf(
                            (currentDocument as IDocument).contentType
                          ) > -1 && (
                            <button
                              className="w-38 flex bg-coreOrange-500 justify-center px-4 py-1 text-base text-white rounded-md"
                              onClick={ViewDocument}
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
                              className="w-38 flex bg-coreOrange-500 justify-center px-4 py-1 text-base text-white rounded-md"
                              onClick={ViewDocument}
                            >
                              <span className="">View</span>
                              <span className="pl-4 pt-0.5 w-9">{View()}</span>
                            </button>
                          )}
                        <button
                          className="w-38 flex bg-coreOrange-500 justify-center px-4 py-1 text-base text-white rounded-md cursor-pointer"
                          onClick={DownloadDocument}
                        >
                          <span className="">Download</span>
                          <span className="w-7 pl-1">{Download()}</span>
                        </button>
                        {isCurrentDocumentSoftDeleted ? (
                          <button
                            className="w-38 flex bg-coreOrange-500 justify-center px-4 py-1 text-base text-white rounded-md"
                            onClick={restoreDocument(currentDocument, currentSiteId, null)}
                          >
                            <span className="">Restore</span>
                            <div className="ml-2 mt-1 w-3.5 h-3.5 text-white flex justify-center">
                              <Undo />
                            </div>
                          </button>
                        ) : (
                          // eslint-disable-next-line react/jsx-no-useless-fragment
                          <>
                            { props.useSoftDelete && (
                              <button
                                className="w-38 flex bg-coreOrange-500 justify-center px-4 py-1 text-base text-white rounded-md"
                                onClick={deleteDocument(currentDocument, null)}
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
                            formkiqVersion={props.formkiqVersion}
                            onDeleteClick={deleteFolder(currentDocument)}
                            onShareClick={onShareClick}
                            onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                            onRenameModalClick={onRenameModalClick}
                            onMoveModalClick={onMoveModalClick}
                            onDocumentVersionsModalClick={
                              onDocumentVersionsModalClick
                            }
                            onESignaturesModalClick={onESignaturesModalClick}
                            onInfoPage={true}
                            user={user}
                            useIndividualSharing={props.useIndividualSharing}
                            useCollections={props.useCollections}
                            useSoftDelete={props.useSoftDelete}
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
      <EditTagsAndMetadataModal
        isOpened={isEditTagsAndMetadataModalOpened}
        onClose={onEditTagsAndMetadataModalClose}
        siteId={currentSiteId}
        getValue={getEditTagsAndMetadataModalValue}
        value={editTagsAndMetadataModalValue}
        onTagChange={onTagChange}
      />
      <DocumentVersionsModal
        isOpened={isDocumentVersionsModalOpened}
        onClose={onDocumentVersionsModalClose}
        onUploadClick={onUploadClick}
        isUploadModalOpened={isUploadModalOpened}
        siteId={currentSiteId}
        documentsRootUri={currentDocumentsRootUri}
        value={documentVersionsModalValue}
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
        formkiqVersion={props.formkiqVersion}
        value={newModalValue}
      />
      <RenameModal
        isOpened={isRenameModalOpened}
        onClose={onRenameModalClose}
        siteId={currentSiteId}
        value={renameModalValue}
      />
      <MoveModal
        isOpened={isMoveModalOpened}
        onClose={onMoveModalClose}
        siteId={currentSiteId}
        value={moveModalValue}
        allTags={props.allTags}
      />
      <UploadModal
        isOpened={isUploadModalOpened}
        onClose={onUploadClose}
        siteId={currentSiteId}
        formkiqVersion={props.formkiqVersion}
        folder={subfolderUri}
        documentId={uploadModalDocumentId}
        isFolderUpload={false}
      />
      <UploadModal
        isOpened={isFolderUploadModalOpened}
        onClose={onFolderUploadClose}
        siteId={currentSiteId}
        formkiqVersion={props.formkiqVersion}
        folder={subfolderUri}
        documentId={folderUploadModalDocumentId}
        isFolderUpload={true}
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { subfolderUri, user } = state.authReducer
  const { documents, folders, nextToken, nextLoadingStatus, currentSearchPage, isLastSearchPageLoaded } = state.documentsReducer
  const { isSidebarExpanded, currentActionEvent, brand, formkiqVersion, tagColors, useIndividualSharing, useFileFilter, useCollections, useSoftDelete } = state.configReducer
  const { allTags } = state.dataCacheReducer
  return {
    subfolderUri,
    documents,
    folders,
    user,
    nextToken,
    nextLoadingStatus,
    currentSearchPage,
    isLastSearchPageLoaded,
    isSidebarExpanded,
    currentActionEvent,
    brand,
    formkiqVersion,
    tagColors,
    useIndividualSharing,
    useFileFilter,
    useCollections,
    useSoftDelete,
    allTags,
  };
}

export default connect(mapStateToProps)(Documents as any)
