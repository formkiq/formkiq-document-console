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
import { Plus, Spinner, Upload, Share, Star, ArrowRight, ArrowBottom, View, Edit, Download, Trash, Undo } from "../../Components/Icons/icons"
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
import { fetchDocuments, fetchDeleteDocument, fetchDeleteFolder, setDocuments, toggleExpandFolder, updateDocumentsList } from "../../Store/reducers/documentsList"
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
    id,
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
  const [currentDocument, setCurrentDocument]: [IDocument | null, any] =
    useState(null);
  const [currentDocumentTags, setCurrentDocumentTags]: [
    IDocumentTag[] | null,
    any
  ] = useState([]);
  const [isCurrentDocumentSoftDeleted, setIsCurrentDocumentSoftDeleted] =
    useState(false);
  const [isUploadModalOpened, setUploadModalOpened] = useState(false);
  const [uploadModalDocumentId, setUploadModalDocumentId] = useState('');
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
  const documentListOffsetTop = 200;

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
    if (id) {
      DocumentsService.getDocumentById(id, currentSiteId).then((response: any) => {
        setCurrentDocument(response);
        updateTags();
      });
    } else {
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
    }
  }, [id]);

  const updateTags = () => {
    if (id) {
      DocumentsService.getDocumentTags(id, currentSiteId).then((response: any) => {
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
    if (isUploadModalOpened === false && isNewModalOpened === false && isMoveModalOpened === false && isRenameModalOpened === false) {
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
  }, [currentSiteId, search, subfolderUri, filterTag, isUploadModalOpened, isNewModalOpened, isMoveModalOpened, isRenameModalOpened]);

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
      if (id) {
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
        if (!id) {
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
    if (id) {
      const deleteFunc = () => {
        updateTags();
        DocumentsService.deleteDocumentTag(id, currentSiteId, tagKey).then(() => {
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
    setUploadModalOpened(true);
    setUploadModalDocumentId(documentId);
  };
  const onUploadClose = () => {
    setUploadModalOpened(false);
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
    if (id) {
      DocumentsService.getDocumentUrl(id, currentSiteId, '', false).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  };
  const ViewDocument = () => {
    if (id) {
      navigate(`${currentDocumentsRootUri}/${id}/view`);
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
  const filtersAndTags = () => {
    let tagsToCheck: string[] = [];
    tagsToCheck = tagsToCheck.concat(TagsForFilterAndDisplay);
    if (
      filterTag &&
      filterTag.length &&
      tagsToCheck.indexOf(filterTag) === -1
    ) {
      tagsToCheck.push(filterTag);
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
          <div className="mr-4">
            <span className="font-medium text-sm text-gray-500">Tags:</span>
          </div>
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
          <AllTagsPopover siteId={currentSiteId} tagColors={props.tagColors} onFilterTag={onFilterTag} filterTag={filterTag} />
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
          className="relative mt-5 h-132 overflow-hidden"
          ref={documentsWrapperRef}
        >
          <div
            className="overflow-scroll h-full"
            ref={documentsScrollpaneRef}
            id="documentsScrollpane"
          >
            <table
              className="border-collapse table-auto w-full"
              id="documentsTable"
            >
              <thead className="sticky top-0 bg-white z-10">
                <tr className="pt-5 rounded-t-md rounded">
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tl-md"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tr-md"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="w-38 px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tr-md"
                  >
                    Last modified
                  </th>
                  <th
                    scope="col"
                    className="w-24 px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tr-md"
                  >
                    Filesize
                  </th>
                  {props.useIndividualSharing && (
                    <th
                      scope="col"
                      className="w-24 px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tr-md"
                      >
                      {subfolderUri === 'shared' && <span>Shared by</span>}
                      {subfolderUri !== 'shared' && <span>Access</span>}
                    </th>
                  )}
                  <th
                    scope="col"
                    className="w-28 px-4 py-2 text-left font-medium text-sm text-gray-500 rounded-tr-md"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
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
            {
              subfolderUri !== 'deleted' &&
              subfolderUri !== 'shared' &&
              subfolderUri !== 'recent' &&
              subfolderUri !== 'favorites' && (
                <div className="absolute top-0 h-full ml-2.1 pb-8">
                  <div className="h-full border-l border-coreOrange-50"></div>
                </div>
              )
            }
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
                <div className="mt-4 w-2/3 p-2 border border-gray-400 rounded-md bg-coreOrange-200 text-gray-900 font-semibold">
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
                restoreDocument={restoreDocument}
                onTagChange={onTagChange}
                filterTag={filterTag}
                onDeleteDocument={deleteDocument}
              />
            )
          })}
        </td>
      </tr>
    );
  };

  const metadata = (tag: IDocumentTag, i: number) => {
    return (
      <div className="flex">
        <div className="w-64 font-semibold">{tag.key}</div>
        <div className="grow">
          {tag.value && <span>{tag.value}</span>}
          {tag.values !== undefined &&
            tag.values.map((value, j) => {
              return <span className="block">{value}</span>;
            })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Documents</title>
      </Helmet>
      {id ? (
        <div className="flex flex-col lg:flex-row">
          <div className="h-screen flex-1 bg-white p-10 inline-block">
            {currentDocument ? (
              <div>
                <div className="flex">
                  <div className="overflow-x-auto relative">
                    <img
                      alt="File Icon"
                      src={getFileIcon((currentDocument as IDocument).path)}
                      className="mr-2 inline-block h-20"
                    />
                  </div>
                  <div className="font-bold text-lg inline-block pl-6">
                    {(currentDocument as IDocument).path}
                    {isCurrentDocumentSoftDeleted && (
                      <small className="block text-red-500 uppercase">
                        (deleted)
                      </small>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto relative">
                  <div className="-mr-[4.625rem] p-4 text-[0.8125rem] leading-6 text-slate-900">
                    <div className="mt-4 flex items-center border-t border-slate-400/20 py-3">
                      <span className="w-2/5 flex-none">Content Type</span>
                      <span className="">
                        {(currentDocument as IDocument).contentType}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center border-t border-slate-400/20 py-3">
                      <span className="w-2/5 flex-none">Added by</span>
                      <span className="">
                        {(currentDocument as IDocument).userId}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center border-t border-slate-400/20 py-3">
                      <span className="w-2/5 flex-none">Date added</span>
                      <span className="">
                        {formatDate((currentDocument as IDocument).insertedDate)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center border-t border-slate-400/20 py-3">
                      <span className="w-2/5 flex-none">Last modified</span>
                      <span className="">
                        {formatDate((currentDocument as IDocument).lastModifiedDate)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-start border-t border-slate-400/20 py-3">
                      <div className="w-2/5">
                        Tags
                      </div>
                      <div className="grow flex flex-wrap">
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
                                        <button
                                          className="pl-2 font-semibold hover:text-red-600"
                                          onClick={(event) =>
                                            onTagDelete(tag.key)
                                          }
                                        >
                                          x
                                        </button>
                                      </div>
                                      <div className={`h-5.5 w-0 border-y-8 border-y-transparent border-l-[8px] border-l-${tagColor}-200`}></div>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                    </div>
                    <div className="flex">
                      <div className="w-2/5"></div>
                      <div className="w-3/5">
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
                    </div>
                    <div className="mt-4 flex items-start border-t border-slate-400/20 py-3">
                      <span className="w-2/5 flex-none">Metadata</span>
                      <div className="w-3/5">
                        <div>
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
                                return (
                                  <div
                                    key={i}
                                    className={
                                      isKeyOnlyTag
                                        ? 'inline'
                                        : 'block border-b border-dotted'
                                    }
                                  >
                                    {!isKeyOnlyTag && metadata(tag, i)}
                                  </div>
                                );
                              }
                            )}
                        </div>
                        <div className="mt-2 flex justify-start">
                          <button
                            className="bg-coreOrange-500 hover:bg-coreOrange-600 text-white text-sm font-semibold py-1 px-2 rounded"
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
                            Add/Edit Metadata
                          </button>
                        </div>
                      </div>
                    </div>
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
        <div className="flex flex-row">
          <div className="flex-1 inline-block mt-6">
            { TopLevelFolders.indexOf(subfolderUri) === -1 && (
              <div className="ml-3 flex gap-4 pb-6">
                <button
                  className="bg-coreOrange-500 hover:bg-coreOrange-700 text-white font-bold py-2 px-4 rounded flex cursor-pointer"
                  onClick={(event) =>
                    onNewClick(event, {
                      lineType: 'folder',
                      folder: subfolderUri,
                      documentId: '',
                      documentInstance: null,
                      folderInstance: null,
                    })
                  }
                >
                  <span>Create new</span>
                  <div className="w-4 h-4 ml-2 mt-1">{Plus()}</div>
                </button>
                <button
                  onClick={(event) => onUploadClick(event, '')}
                  className="w-38 flex bg-gray-100 justify-center px-4 py-1.5 text-base text-gray-900 rounded-md cursor-pointer"
                >
                  <span className="pt-0.5"> Upload </span>
                  <div className="w-4 h-4 ml-3 mt-1">{Upload()}</div>
                </button>
              </div>
            )}
            {filtersAndTags()}
            {documentsTable(props.documents, props.folders)}
          </div>
        </div>
      )}
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
      />
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { subfolderUri, user } = state.authReducer
  const { documents, folders, nextToken, nextLoadingStatus, currentSearchPage, isLastSearchPageLoaded } = state.documentsReducer
  const { isSidebarExpanded, brand, formkiqVersion, tagColors, useIndividualSharing, useFileFilter, useCollections, useSoftDelete } = state.configReducer
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
