import { Ref } from 'react';
import { useSelector } from 'react-redux';
import CustomDragLayer from '../../Components/DocumentsAndFolders/CustomDragLayer/customDragLayer';
import DocumentListLine from '../../Components/DocumentsAndFolders/DocumentListLine/documentListLine';
import FolderDropWrapper from '../../Components/DocumentsAndFolders/FolderDropWrapper/folderDropWrapper';
import FolderListLine from '../../Components/DocumentsAndFolders/FolderListLine/FolderListLine';
import { Spinner } from '../../Components/Icons/icons';
import { ConfigState } from '../../Store/reducers/config';
import { DocumentListState } from '../../Store/reducers/documentsList';
import { IDocument, RequestStatus } from '../../helpers/types/document';
import { IFolder } from '../../helpers/types/folder';
import { ILine } from '../../helpers/types/line';
import { useQueueId } from '../../hooks/queue-id.hook';
import { useSubfolderUri } from '../../hooks/subfolder-uri.hook';
import { EmptyDocumentsTable } from './EmptyDocumentsTable';

type DocumentTableProps = {
  documentsWrapperRef: Ref<any>;
  documentsScrollpaneRef: Ref<any>;
  onDeleteDocument: (file: IDocument, searchDocuments: any) => () => void;
  onRestoreDocument: (
    file: IDocument,
    siteId: string,
    searchDocuments: any
  ) => () => void;
  currentSiteId: string;
  currentDocumentsRootUri: string;
  isSiteReadOnly: boolean;
  onTagChange: (event: any, value: ILine | null) => void;
  onESignaturesModalClick: (event: any, value: ILine | null) => void;
  onShareClick: (event: any, value: ILine | null) => void;
  onRenameModalClick: (event: any, value: ILine | null) => void;
  onMoveModalClick: (event: any, value: ILine | null) => void;
  onDocumentVersionsModalClick: (event: any, value: ILine | null) => void;
  onDocumentWorkflowsModalClick: (event: any, value: ILine | null) => void;
  onEditTagsAndMetadataModalClick: (event: any, value: ILine | null) => void;
  filterTag: string | null;
  deleteFolder: (folder: IFolder | IDocument) => () => void;
};

export const DocumentsTable = (props: DocumentTableProps) => {
  const {
    documentsWrapperRef,
    documentsScrollpaneRef,
    onDeleteDocument,
    onRestoreDocument,
    onShareClick,
    onRenameModalClick,
    currentSiteId,
    onTagChange,
    onESignaturesModalClick,
    currentDocumentsRootUri,
    filterTag,
    onDocumentVersionsModalClick,
    onDocumentWorkflowsModalClick,
    onEditTagsAndMetadataModalClick,
    isSiteReadOnly,
    onMoveModalClick,
  } = props;

  const { formkiqVersion, useIndividualSharing } = useSelector(ConfigState);
  const { documents, folders, loadingStatus } = useSelector(DocumentListState);
  const subfolderUri = useSubfolderUri();
  const queueId = useQueueId();

  if (
    documents.length === 0 &&
    folders.length === 0 &&
    loadingStatus !== RequestStatus.pending
  ) {
    return (
      <EmptyDocumentsTable
        formkiqVersion={formkiqVersion}
        subfolderUri={subfolderUri}
        queueId={queueId}
      />
    );
  }

  return (
    <div
      className="relative mt-5 overflow-hidden h-full"
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
              {useIndividualSharing && (
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
            {folders && <FolderDocumentsTable {...props} />}
            {documents.length === 0 &&
            folders.length === 0 &&
            loadingStatus === RequestStatus.pending ? (
              <tr>
                <td colSpan={6}>
                  <Spinner />
                </td>
              </tr>
            ) : undefined}
            {documents.map((file: any, i: number) => (
              <DocumentListLine
                key={i}
                file={file}
                folder={subfolderUri}
                siteId={currentSiteId}
                isSiteReadOnly={isSiteReadOnly}
                documentsRootUri={currentDocumentsRootUri}
                onShareClick={onShareClick}
                searchDocuments={documents}
                onDeleteClick={onDeleteDocument(file, documents)}
                onRestoreClick={onRestoreDocument(
                  file,
                  currentSiteId,
                  documents
                )}
                onEditTagsAndMetadataModalClick={
                  onEditTagsAndMetadataModalClick
                }
                onRenameModalClick={onRenameModalClick}
                onMoveModalClick={onMoveModalClick}
                onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                onDocumentWorkflowsModalClick={onDocumentWorkflowsModalClick}
                onESignaturesModalClick={onESignaturesModalClick}
                onTagChange={onTagChange}
                filterTag={filterTag}
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
        {loadingStatus === RequestStatus.pending ? <Spinner /> : ''}
      </div>
      <CustomDragLayer />
    </div>
  );
};

const FolderDocumentsTable = (props: DocumentTableProps) => {
  const subfolderUri = useSubfolderUri();
  const { folders } = useSelector(DocumentListState);

  const {
    onDeleteDocument,
    onRestoreDocument,
    onShareClick,
    onRenameModalClick,
    currentSiteId,
    onTagChange,
    onESignaturesModalClick,
    currentDocumentsRootUri,
    filterTag,
    onDocumentVersionsModalClick,
    onDocumentWorkflowsModalClick,
    onEditTagsAndMetadataModalClick,
    isSiteReadOnly,
    onMoveModalClick,
    deleteFolder,
  } = props;

  return (
    <tr>
      <td colSpan={6}>
        {folders.map((folder: IFolder, j: number) => {
          return (
            <FolderListLine
              subfolder={subfolderUri}
              folderInstance={folder}
              key={j}
              currentSiteId={currentSiteId}
              isSiteReadOnly={isSiteReadOnly}
              onDeleteClick={deleteFolder}
              currentDocumentsRootUri={currentDocumentsRootUri}
              onShareClick={onShareClick}
              onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
              onRenameModalClick={onRenameModalClick}
              onMoveModalClick={onMoveModalClick}
              onDocumentVersionsModalClick={onDocumentVersionsModalClick}
              onDocumentWorkflowsModalClick={onDocumentWorkflowsModalClick}
              onESignaturesModalClick={onESignaturesModalClick}
              onTagChange={onTagChange}
              onRestoreDocument={onRestoreDocument}
              onDeleteDocument={onDeleteDocument}
              filterTag={filterTag}
            />
          );
        })}
      </td>
    </tr>
  );
};
