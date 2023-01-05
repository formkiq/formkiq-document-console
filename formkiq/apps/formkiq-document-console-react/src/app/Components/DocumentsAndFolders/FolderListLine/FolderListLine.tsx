import React, { useEffect, useState } from 'react'
import { Star, StarFilled, Info, Share, Trash, ArrowBottom, ArrowRight } from '../../Icons/icons'
import { Link, useNavigate } from 'react-router-dom'
import { formatBytes, formatDate, getFileIcon, isTagValueIncludes } from '../../../helpers/services/toolService'
import DocumentActionsPopover from '../DocumentActionsPopover/documentActionsPopover'
import DocumentTagsPopover from '../DocumentTagsPopover/documentTagsPopover'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { DocumentsService } from '../../../helpers/services/documentsService'
import { RootState } from '../../../Store/store'
import { connect, useDispatch } from 'react-redux'
import { User } from '../../../Store/reducers/auth'
import { addDocumentTag, removeDocumentTag, toggleExpandFolder } from '../../../Store/reducers/documentsList'
import { IDocument } from '../../../helpers/types/document'
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { openDialog as openProgressDialog, closeDialog as closeProgressDialog } from '../../../Store/reducers/globalProgressControls';
import { IFolder } from '../../../helpers/types/folder'
import FolderDropWrapper from '../FolderDropWrapper/folderDropWrapper'
import { ILine } from '../../../helpers/types/line'
import DocumentListLine from '../DocumentListLine/documentListLine'

interface IProps {
  subfolder: string
  folderInstance: IFolder
  currentSiteId: string
  onDeleteClick: (folder: IFolder) => () => void
  restoreDocument: any
  onDeleteDocument: (file: IDocument, searchDocuments: any) => () => void
  user: User
  currentDocumentsRootUri: string
  useIndividualSharing: boolean
  onShareClick: (event: any, value: ILine | null) => void
  formkiqVersion: any
  useCollections: any
  useSoftDelete: any
  onEditTagsAndMetadataModalClick: any
  onRenameModalClick: any
  onMoveModalClick: any
  onDocumentVersionsModalClick: any
  onESignaturesModalClick: any
  onTagChange: any
  brand: any
  filterTag: string
}

function FolderListLine({
  subfolder,
  folderInstance,
  currentSiteId,
  onDeleteClick,
  user,
  currentDocumentsRootUri,
  useIndividualSharing,
  onShareClick,
  formkiqVersion,
  useCollections,
  useSoftDelete,
  onEditTagsAndMetadataModalClick,
  onRenameModalClick,
  onMoveModalClick,
  onDocumentVersionsModalClick,
  onESignaturesModalClick,
  brand,
  restoreDocument,
  onDeleteDocument,
  onTagChange,
  filterTag
}: IProps) {
  const folderPath = subfolder + (subfolder.length ? '/' : '') + folderInstance.path
  const folderName = folderPath.substring(folderPath.lastIndexOf('/') + 1)
  const trElem = React.forwardRef((props: any, ref) => (
    <tr {...props} ref={ref}>
      {props.childs}
    </tr>
  ));
  const tableLeftMargin = 'ml-4';
  const dispatch = useDispatch();

  const onExpandFolderClick = (folderPath: string, value: ILine | null) => () => {
    if (value) {
      dispatch(
        toggleExpandFolder({
          folder: value.folderInstance,
          subfolderUri: folderPath,
          siteId: currentSiteId,
          user: user,
        }) as any
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
                      user={user}
                      currentSiteId={currentSiteId}
                      onDeleteClick={onDeleteClick}
                      currentDocumentsRootUri={currentDocumentsRootUri}
                      onShareClick={onShareClick}
                      onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                      onRenameModalClick={onRenameModalClick}
                      onMoveModalClick={onMoveModalClick}
                      onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                      onESignaturesModalClick={onESignaturesModalClick} restoreDocument={undefined}
                      onDeleteDocument={onDeleteDocument}
                      useIndividualSharing={useIndividualSharing}
                      formkiqVersion={formkiqVersion}
                      useCollections={useCollections}
                      useSoftDelete={useSoftDelete}
                      onTagChange={onTagChange}
                      filterTag={filterTag} 
                      brand={brand}                    
                    />
                  )
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
                  documentsRootUri={currentDocumentsRootUri}
                  onShareClick={onShareClick}
                  searchDocuments={folderInstance.documents}
                  onDeleteClick={onDeleteDocument(file, null)}
                  onRestoreClick={restoreDocument(file, currentSiteId, null)}
                  onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                  onRenameModalClick={onRenameModalClick}
                  onMoveModalClick={onMoveModalClick}
                  onESignaturesModalClick={onESignaturesModalClick}
                  onTagChange={onTagChange}
                  filterTag={filterTag}
                  brand={brand}
                  useIndividualSharing={useIndividualSharing}
                  useCollections={useCollections}
                  useSoftDelete={useSoftDelete}
                  leftOffset={4}
                />
              );
            })}
            { folderInstance.documents.length === 25 && (
              <tr>
                <td colSpan={6} className="text-sm">
                  <div className="-mx-1 pl-12 font-semibold py-2 border-b hover:text-coreOrange-500">
                    <a href={`${currentDocumentsRootUri}/folders/${subfolderPath}`}>
                      view all documents in folder...
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        )
      } else {
        return (
          <tr>
            <td colSpan={6} className="border-coreOrange-50 text-sm italic p-1 pl-12 mb-2">
              No subfolders or files have been found in this folder
            </td>
          </tr>
        );
      }
    }
    return <></>;
  }


  return (
    <div className="flex">
      <table className={'w-full relative ' + tableLeftMargin}>
        <tbody>
          <FolderDropWrapper
            className="nodark:bg-gray-800 nodark:border-gray-700 text-sm tracking-tight"
            wrapper={trElem}
            folder={folderPath}
            sourceSiteId={currentSiteId}
            targetSiteId={currentSiteId}
          >
            <td className="pt-1 text-gray-800 block lg:table-cell relative lg:static">
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
                    to={`${currentDocumentsRootUri}/folders/${folderPath}`}
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
                    to={`${currentDocumentsRootUri}/folders/${folderPath}`}
                    className="cursor-pointer grow p-1"
                  >
                    {folderName}
                  </Link>
                  <div className="hidden w-5 text-gray-400 mr-4 cursor-pointer px-2 box-content">
                    <Star />
                  </div>
                </div>
              </div>
            </td>
            <td className="w-38 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
              {formatDate(folderInstance.insertedDate)}
            </td>
            <td className="w-38 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
              {formatDate(folderInstance.lastModifiedDate)}
            </td>
            <td className="w-24 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
              
            </td>
            {useIndividualSharing && (
              <td className="w-24 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
                Shared
              </td>
            )}
            <td className="w-28 p-2 pt-3 text-gray-800 block lg:table-cell relative lg:static">
              <div className="flex w-full">
                { useIndividualSharing && (
                  <div
                    className="w-6 h-auto text-gray-400 mr-2 cursor-pointer hover:text-coreOrange-500"
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
                <div
                  className="w-3 h-auto text-gray-400 mr-3 cursor-pointer hover:text-coreOrange-500"
                  onClick={onDeleteClick(folderInstance)}
                  >
                  <Trash />
                </div>
                <div className="w-5 pt-0.5 h-auto text-gray-400">
                  <DocumentActionsPopover
                    value={{ lineType: 'folder', folder: folderPath }}
                    siteId={currentSiteId}
                    formkiqVersion={formkiqVersion}
                    onDeleteClick={onDeleteClick(folderInstance)}
                    onShareClick={onShareClick}
                    onEditTagsAndMetadataModalClick={onEditTagsAndMetadataModalClick}
                    onRenameModalClick={onRenameModalClick}
                    onMoveModalClick={onMoveModalClick}
                    onDocumentVersionsModalClick={onDocumentVersionsModalClick}
                    onESignaturesModalClick={onESignaturesModalClick}
                    user={user}
                    useIndividualSharing={useIndividualSharing}
                    useCollections={useCollections}
                    useSoftDelete={useSoftDelete}
                  />
                </div>
              </div>
            </td>
          </FolderDropWrapper>
          {folderContent(folderInstance, folderPath)}
        </tbody>
      </table>
      <div className="absolute h-full ml-2 pb-10">
        <div className="h-full border-l border-coreOrange-50"></div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { user } = state.authReducer
  const { documents } = state.documentsReducer
  const { brand, formkiqVersion, tagColors, useIndividualSharing, useCollections, useSoftDelete } = state.configReducer
  return { user, documents, brand, formkiqVersion, tagColors, useIndividualSharing, useCollections, useSoftDelete }
}

export default connect(mapStateToProps)(FolderListLine as any) as any;
  