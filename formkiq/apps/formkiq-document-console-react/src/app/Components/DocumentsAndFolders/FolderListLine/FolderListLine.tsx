import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import { ConfigState } from '../../../Store/reducers/config';
import { DocumentListState, toggleExpandFolder } from '../../../Store/reducers/documentsList';
import { useAppDispatch } from '../../../Store/store';
import { formatDate } from '../../../helpers/services/toolService';
import { IDocument, RequestStatus } from '../../../helpers/types/document';
import { IFolder } from '../../../helpers/types/folder';
import { ILine } from '../../../helpers/types/line';
import { ArrowBottom, ArrowRight, Share, Star, Trash } from '../../Icons/icons';
import DocumentActionsPopover from '../DocumentActionsPopover/documentActionsPopover';
import DocumentListLine from '../DocumentListLine/documentListLine';
import FolderDropWrapper from '../FolderDropWrapper/folderDropWrapper';

interface IProps {
  subfolder: string;
  folderInstance: IFolder;
  currentSiteId: string;
  isSiteReadOnly: boolean;
  onDeleteClick: (folder: IFolder) => () => void;
  onRestoreDocument: (
    file: IDocument,
    siteId: string,
    searchDocuments: any
  ) => () => void;
  onDeleteDocument: (file: IDocument, searchDocuments: any) => () => void;
  currentDocumentsRootUri: string;
  onShareClick: (event: any, value: ILine | null) => void;
  onEditTagsAndMetadataModalClick: any;
  onRenameModalClick: any;
  onMoveModalClick: any;
  onDocumentVersionsModalClick: any;
  onDocumentWorkflowsModalClick: any;
  onDocumentReviewModalClick: any;
  onESignaturesModalClick: any;
  onDocumentDataChange: any;
  filterTag: string | null;
  isArchiveTabExpanded?: boolean;
  addToPendingArchive?: (file: IDocument) => void;
  deleteFromPendingArchive?: (file: IDocument) => void;
  archiveStatus?: string;
}

function FolderListLine({
  subfolder,
  folderInstance,
  currentSiteId,
  isSiteReadOnly,
  onDeleteClick,
  currentDocumentsRootUri,
  onShareClick,
  onEditTagsAndMetadataModalClick,
  onRenameModalClick,
  onMoveModalClick,
  onDocumentVersionsModalClick,
  onDocumentWorkflowsModalClick,
  onDocumentReviewModalClick,
  onESignaturesModalClick,
  onRestoreDocument,
  onDeleteDocument,
  onDocumentDataChange,
  filterTag,
  isArchiveTabExpanded,
  addToPendingArchive,
  deleteFromPendingArchive,
  archiveStatus,
}: IProps) {
  const {
    loadingStatus,
  } = useSelector(DocumentListState);

  let folderPath = folderInstance.path;
  if (folderInstance.path.indexOf('/') === -1) {
    folderPath =
      subfolder + (subfolder.length ? '/' : '') + folderInstance.path;
  }

  const { user } = useAuthenticatedState();
  const {
    formkiqVersion,
    useIndividualSharing,
    useCollections,
    useSoftDelete,
  } = useSelector(ConfigState);

  const folderName = folderPath.substring(folderPath.lastIndexOf('/') + 1);
  const trElem = React.forwardRef((props: any, ref) => (
    <tr {...props} ref={ref} className="folder-drop-wrapper" data-folder-path={folderPath} >
      {props.childs}
    </tr>
  ));
  const tableLeftMargin = 'ml-4';
  const dispatch = useAppDispatch();

  const onExpandFolderClick =
    (folderPath: string, value: ILine | null) => () => {
      if (value) {
        dispatch(
          toggleExpandFolder({
            folder: value.folderInstance,
            subfolderUri: folderPath,
            siteId: currentSiteId,
            user: user,
          })
        );
      }
    };

  const folderContent = (folderInstance: IFolder, subfolderPath: string) => {
    if (folderInstance.isExpanded) {
      if (
        folderInstance.documents?.length > 0 ||
        folderInstance.folders?.length > 0
      ) {
        return (
          <React.Fragment>
            <tr>
              <td colSpan={6}>
                {folderInstance.folders.map((folder: any, j: number) => {
                  return (
                    <FolderListLine
                      subfolder={subfolder}
                      folderInstance={folder}
                      key={j}
                      currentSiteId={currentSiteId}
                      isSiteReadOnly={isSiteReadOnly}
                      onDeleteClick={onDeleteClick}
                      currentDocumentsRootUri={currentDocumentsRootUri}
                      onShareClick={onShareClick}
                      onEditTagsAndMetadataModalClick={
                        onEditTagsAndMetadataModalClick
                      }
                      onRenameModalClick={onRenameModalClick}
                      onMoveModalClick={onMoveModalClick}
                      onDocumentVersionsModalClick={
                        onDocumentVersionsModalClick
                      }
                      onDocumentWorkflowsModalClick={
                        onDocumentWorkflowsModalClick
                      }
                      onDocumentReviewModalClick={onDocumentReviewModalClick}
                      onESignaturesModalClick={onESignaturesModalClick}
                      onRestoreDocument={onRestoreDocument}
                      onDeleteDocument={onDeleteDocument}
                      onDocumentDataChange={onDocumentDataChange}
                      filterTag={filterTag}
                      isArchiveTabExpanded={isArchiveTabExpanded}
                      archiveStatus={archiveStatus}
                      addToPendingArchive={addToPendingArchive}
                      deleteFromPendingArchive={deleteFromPendingArchive}
                    />
                  );
                })}
              </td>
            </tr>
            {folderInstance.documents.map((file: any, j: number) => {
              return (
                <DocumentListLine
                  key={j}
                  file={file}
                  folder={subfolder}
                  siteId={currentSiteId}
                  isSiteReadOnly={isSiteReadOnly}
                  documentsRootUri={currentDocumentsRootUri}
                  onShareClick={onShareClick}
                  searchDocuments={folderInstance.documents}
                  onDeleteClick={onDeleteDocument(file, null)}
                  onRestoreClick={onRestoreDocument(file, currentSiteId, null)}
                  onEditTagsAndMetadataModalClick={
                    onEditTagsAndMetadataModalClick
                  }
                  onRenameModalClick={onRenameModalClick}
                  onMoveModalClick={onMoveModalClick}
                  onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                  onDocumentWorkflowsModalClick={onDocumentWorkflowsModalClick}
                  onDocumentReviewModalClick={onDocumentReviewModalClick}
                  onESignaturesModalClick={onESignaturesModalClick}
                  onDocumentDataChange={onDocumentDataChange}
                  filterTag={filterTag}
                  leftOffset={4}
                  isArchiveTabExpanded={isArchiveTabExpanded}
                  archiveStatus={archiveStatus}
                  addToPendingArchive={addToPendingArchive}
                  deleteFromPendingArchive={deleteFromPendingArchive}
                />
              );
            })}
            {folderInstance.documents.length === 25 && (
              <tr>
                <td colSpan={6} className="text-sm">
                  <div className="-mx-1 pl-12 font-semibold py-2 hover:text-primary-500">
                    <a
                      href={`${currentDocumentsRootUri}/folders/${subfolderPath}`}
                    >
                      view all documents in folder...
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      } else {
        return (
          <tr>
            <td
              colSpan={6}
              className="border-primary-50 text-sm italic p-1 pl-12 mb-2"
            >
              No subfolders or files have been found in this folder
            </td>
          </tr>
        );
      }
    }
    return <></>;
  };

  return (
    <div className="flex">
      <table
        className={
          'w-full border-spacing-0 border-collapse table-auto relative ' +
          tableLeftMargin
        }
      >
        <tbody>
          <FolderDropWrapper
            className="nodark:bg-gray-800 nodark:border-gray-700 text-sm tracking-normal"
            wrapper={trElem}
            folder={folderPath}
            sourceSiteId={currentSiteId}
            targetSiteId={currentSiteId}
          >
            <td
              className="pt-1 text-neutral-900 block lg:table-cell relative lg:static"
              data-test-id={`folder-${folderPath}`}
            >
              <div className="-ml-0.5 flex">
                <div
                  className="w-4 pt-1.5 cursor-pointer"
                  onClick={onExpandFolderClick(folderPath, {
                    lineType: 'folder',
                    folder: folderPath,
                    documentId: folderInstance.documentId,
                    documentInstance: null,
                    folderInstance: folderInstance,
                  })}
                >
                  {folderInstance?.isExpanded ? (
                    <ArrowBottom />
                  ) : (
                    <ArrowRight />
                  )}
                </div>
                <div className="flex grow w-full justify-start">
                  <Link
                    to={loadingStatus===RequestStatus.pending? "#":`${currentDocumentsRootUri}/folders/${folderPath}`}
                    className="w-16 pl-1 pt-1.5 cursor-pointer"
                  >
                    <svg
                      width="28"
                      height="20"
                      viewBox="0 0 21 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.0625 0H2.0625C0.9625 0 0.0725 0.9 0.0725 2L0.0625 14C0.0625 15.1 0.9625 16 2.0625 16H18.0625C19.1625 16 20.0625 15.1 20.0625 14V4C20.0625 2.9 19.1625 2 18.0625 2H10.0625L8.0625 0Z"
                        fill="#A1A5B6"
                      />
                    </svg>
                  </Link>
                  <Link
                    to={loadingStatus===RequestStatus.pending? "#":`${currentDocumentsRootUri}/folders/${folderPath}`}
                    className="cursor-pointer grow p-1"
                  >
                    {folderName}
                  </Link>
                  <div className="hidden w-5 text-neutral-900 mr-4 cursor-pointer px-2 box-content">
                    <Star />
                  </div>
                </div>
              </div>
            </td>
            <td className="w-38 p-2 pt-3 text-neutral-900 block lg:table-cell relative lg:static">
              {formatDate(folderInstance.lastModifiedDate)}
            </td>
            <td className="w-24 p-2 pt-3 text-neutral-900 block lg:table-cell relative lg:static"></td>
            {useIndividualSharing && (
              <td className="w-24 p-2 pt-3 text-neutral-900 block lg:table-cell relative lg:static">
                Shared
              </td>
            )}
            <td className="w-28 p-2 pt-3 text-neutral-900 block lg:table-cell relative lg:static">
              <div className="flex w-full">
                {useIndividualSharing && (
                  <div
                    className="w-6 h-auto text-neutral-900 mr-2 cursor-pointer hover:text-primary-500"
                    onClick={(event) =>
                      onShareClick(event, {
                        lineType: 'folder',
                        folder: folderPath,
                        documentId: folderInstance.documentId,
                        documentInstance: null,
                        folderInstance: folderInstance,
                      })
                    }
                  >
                    <Share />
                  </div>
                )}
                {!isSiteReadOnly && (
                  <>
                    <div
                      className="w-3 h-auto text-neutral-900 mr-3 cursor-pointer hover:text-primary-500"
                      onClick={onDeleteClick(folderInstance)}
                    >
                      <Trash />
                    </div>
                    <div className="w-5 pt-0.5 h-auto text-neutral-900">
                      <DocumentActionsPopover
                        value={{ lineType: 'folder', folder: folderPath }}
                        siteId={currentSiteId}
                        isSiteReadOnly={isSiteReadOnly}
                        formkiqVersion={formkiqVersion}
                        onDeleteClick={onDeleteClick(folderInstance)}
                        onShareClick={onShareClick}
                        onEditTagsAndMetadataModalClick={
                          onEditTagsAndMetadataModalClick
                        }
                        onRenameModalClick={onRenameModalClick}
                        onMoveModalClick={onMoveModalClick}
                        onDocumentVersionsModalClick={
                          onDocumentVersionsModalClick
                        }
                        onDocumentWorkflowsModalClick={
                          onDocumentWorkflowsModalClick
                        }
                        onDocumentReviewModalClick={onDocumentReviewModalClick}
                        onESignaturesModalClick={onESignaturesModalClick}
                        user={user}
                        useIndividualSharing={useIndividualSharing}
                        useCollections={useCollections}
                        useSoftDelete={useSoftDelete}
                      />
                    </div>
                  </>
                )}
              </div>
            </td>
          </FolderDropWrapper>
          {folderContent(folderInstance, folderPath)}
          {!folderInstance.isExpanded && (
            <tr>
              <td colSpan={6} className="p-0 m-0">
                <div className="w-full border-t h-0 -m-b border-neutral-300"></div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FolderListLine;
