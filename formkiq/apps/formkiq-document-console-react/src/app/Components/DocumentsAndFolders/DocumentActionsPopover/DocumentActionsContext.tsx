import moment from 'moment/moment';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { IDocumentTag } from '../../../helpers/types/documentTag';
import { ILine } from '../../../helpers/types/line';
import { AuthState } from '../../../Store/reducers/auth';
import { deleteDocument } from '../../../Store/reducers/documentsList';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import {setCurrentActionEvent} from "../../../Store/reducers/config";
import {TopLevelFolders} from "../../../helpers/constants/folders";

interface DocumentActionsContextType {
  shareModalValue: ILine | null;
  shareModalOpened: boolean;
  isUploadModalOpened:  boolean;
  uploadModalDocumentId: string;
  isFolderUploadModalOpened:  boolean;
  folderUploadModalDocumentId: string;
  editAttributesModalValue: ILine | null;
  editAttributesModalOpened: boolean;
  documentVersionsModalValue: ILine | null;
  documentVersionsModalOpened: boolean;
  documentWorkflowsModalValue: ILine | null;
  documentWorkflowsModalOpened: boolean;
  eSignaturesModalValue: ILine | null;
  eSignaturesModalOpened: boolean;
  submitForReviewModalValue: ILine | null;
  submitForReviewModalOpened: boolean;
  documentReviewModalValue: ILine | null;
  documentReviewModalOpened: boolean;
  onShareClick: (event: any, value: any) => void;
  onShareClose: () => void;
  onUploadClick: (event: any, documentId: string) => void;
  onUploadClose: () => void;
  onFolderUploadClick: (event: any) => void;
  onFolderUploadClose: () => void;
  onEditAttributesModalClick: (event: any, value: any) => void;
  onEditAttributesModalClose: (
    infoDocumentId: string,
    currentSiteId: string,
    formkiqVersion: any
  ) => void;
  onDocumentVersionsModalClick: (event: any, value: any) => void;
  onDocumentVersionsModalClose: () => void;
  onDocumentWorkflowsModalClick: (event: any, value: any) => void;
  onDocumentWorkflowsModalClose: () => void;
  onESignaturesModalClick: (event: any, value: any) => void;
  onESignaturesModalClose: () => void;
  onSubmitForReviewModalClick: (event: any, value: any) => void;
  onSubmitForReviewModalClose: () => void;
  onDocumentReviewModalClick: (event: any, value: any) => void;
  onDocumentReviewModalClose: () => void;
  currentDocumentTags: IDocumentTag[];
  isCurrentDocumentSoftDeleted: boolean;
  currentDocumentVersions: any[];
  updateTags: (
    infoDocumentId: string,
    currentSiteId: string,
    formkiqVersion: any
  ) => void;
  onDeleteClick: (
    id: string,
    softDelete: boolean,
    currentSiteId: string,
    user: any,
    setSelectedDocuments?: (docs: (docs: any) => any) => void
  ) => void;
  onRenameModalClick: (event: any, value: any) => void;
  onMoveModalClick: (event: any, value: any) => void;
  renameModalOpened: boolean;
  renameModalValue: ILine | null;
  onRenameModalClose: () => void;
  moveModalOpened: boolean;
  moveModalValue: ILine | null;
  onMoveModalClose: () => void;
  getShareModalValue: () => any;
  getEditAttributesModalValue: () => any;
  onMultiValuedAttributeModalClose: () => void;
  multivaluedAttributeModalValue: any;
  isMultivaluedAttributeModalOpened: boolean;
  onAttributeQuantityClick: (item: any) => void;
  onDocumentRelationshipsModalClick: (event: any, value: any) => void;
  documentRelationshipsModalOpened: boolean;
  documentRelationshipsModalValue: ILine | null;
  onDocumentRelationshipsModalClose: () => void;
  onActionModalClick: (event: any, value: any) => void;
  onActionModalClose: () => void;
  actionModalValue: ILine | null;
  isActionModalOpened: boolean;
  onNewClick: (event: any, value: ILine | null, subfolderUri: string) => void;
  isNewModalOpened: boolean;
  newModalValue: ILine | null;
  onNewClose:  () => void;
}

const DocumentActionsContext = createContext<
  DocumentActionsContextType | undefined
>(undefined);

export const DocumentActionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [shareModalValue, setShareModalValue] = useState<ILine | null>(null);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [editAttributesModalValue, setEditAttributesModalValue] =
    useState<ILine | null>(null);
  const [editAttributesModalOpened, setEditAttributesModalOpened] =
    useState(false);
  const [documentVersionsModalValue, setDocumentVersionsModalValue] =
    useState<ILine | null>(null);
  const [documentVersionsModalOpened, setDocumentVersionsModalOpened] =
    useState(false);
  const [documentWorkflowsModalValue, setDocumentWorkflowsModalValue] =
    useState<ILine | null>(null);
  const [documentWorkflowsModalOpened, setDocumentWorkflowsModalOpened] =
    useState(false);
  const [eSignaturesModalValue, setESignaturesModalValue] =
    useState<ILine | null>(null);
  const [eSignaturesModalOpened, setESignaturesModalOpened] = useState(false);
  const [submitForReviewModalValue, setSubmitForReviewModalValue] =
    useState<ILine | null>(null);
  const [submitForReviewModalOpened, setSubmitForReviewModalOpened] =
    useState(false);
  const [documentReviewModalValue, setDocumentReviewModalValue] =
    useState<ILine | null>(null);
  const [documentReviewModalOpened, setDocumentReviewModalOpened] =
    useState(false);
  const [moveModalValue, setMoveModalValue] = useState<ILine | null>(null);
  const [moveModalOpened, setMoveModalOpened] = useState(false);
  const [renameModalValue, setRenameModalValue] = useState<ILine | null>(null);
  const [renameModalOpened, setRenameModalOpened] = useState(false);

  const [documentRelationshipsModalValue, setDocumentRelationshipsModalValue] =
    useState<ILine | null>(null);
  const [documentRelationshipsModalOpened, setDocumentRelationshipsModalOpened] =
    useState(false);

  const [
    isMultivaluedAttributeModalOpened,
    setMultivaluedAttributeModalOpened,
  ] = useState(false);
  const [multivaluedAttributeModalValue, setMultivaluedAttributeModalValue] =
    useState<any[]>([]);

  const [currentDocumentTags, setCurrentDocumentTags] = useState<
    IDocumentTag[]
  >([]);
  const [isCurrentDocumentSoftDeleted, setIsCurrentDocumentSoftDeleted] =
    useState(false);
  const [currentDocumentVersions, setCurrentDocumentVersions] = useState<any[]>(
    []
  );

  const [isUploadModalOpened, setUploadModalOpened] = useState(false);
  const [isFolderUploadModalOpened, setFolderUploadModalOpened] =
    useState(false);
  const [uploadModalDocumentId, setUploadModalDocumentId] = useState('');
  const [folderUploadModalDocumentId, setFolderUploadModalDocumentId] =
    useState('');
  const [newModalValue, setNewModalValue] = useState<ILine | null>(null);
  const [isNewModalOpened, setNewModalOpened] = useState(false);

  const [actionModalValue, setActionModalValue] = useState<ILine | null>(
      null
  );
  const [isActionModalOpened, setIsActionModalOpened] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useSelector(AuthState);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const onShareClick = (event: any, value: ILine | null) => {
    setShareModalValue(value);
    setShareModalOpened(true);
  };

  const onShareClose = () => {
    setShareModalOpened(false);
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
  const onNewClose = () => {
    setNewModalOpened(false);
  };

  const onNewClick = (event: any, value: ILine | null, subfolderUri: string) => {
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

  const onEditAttributesModalClick = (event: any, value: ILine | null) => {
    setEditAttributesModalValue(value);
    setEditAttributesModalOpened(true);
  };

  const onEditAttributesModalClose = (
    infoDocumentId: string,
    currentSiteId: string,
    formkiqVersion: any
  ) => {
    setEditAttributesModalOpened(false);
    updateTags(infoDocumentId, currentSiteId, formkiqVersion);
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
  const onSubmitForReviewModalClick = (event: any, value: ILine | null) => {
    setSubmitForReviewModalValue(value);
    setSubmitForReviewModalOpened(true);
  };

  const onSubmitForReviewModalClose = () => {
    setSubmitForReviewModalOpened(false);
  };
  const onDocumentReviewModalClick = (event: any, value: ILine | null) => {
    setDocumentReviewModalValue(value);
    setDocumentReviewModalOpened(true);
  };

  const onDocumentReviewModalClose = () => {
    setDocumentReviewModalOpened(false);
  };

  const onDocumentRelationshipsModalClick = (event: any, value: ILine | null) => {
    setDocumentRelationshipsModalValue(value);
    setDocumentRelationshipsModalOpened(true);
  };

  const onDocumentRelationshipsModalClose = () => {
    setDocumentRelationshipsModalOpened(false);
  };

  const onMoveModalClick = (event: any, value: ILine | null) => {
    setMoveModalValue(value);
    setMoveModalOpened(true);
  };
  const onMoveModalClose = () => {
    setMoveModalOpened(false);
  };

  const onRenameModalClick = (event: any, value: ILine | null) => {
    setRenameModalValue(value);
    setRenameModalOpened(true);
  };
  const onRenameModalClose = () => {
    setRenameModalOpened(false);
  };
  const onMultiValuedAttributeModalClose = () => {
    setMultivaluedAttributeModalOpened(false);
    setMultivaluedAttributeModalValue([]);
  };
  const onAttributeQuantityClick = (item: any) => {
    setMultivaluedAttributeModalOpened(true);
    setMultivaluedAttributeModalValue(item);
  };

  const onActionModalClick = (event: any, value: ILine | null) => {
    setActionModalValue(value);
    setIsActionModalOpened(true);
  };
  const onActionModalClose = () => {
    setIsActionModalOpened(false);
  };

  const updateTags = (
    infoDocumentId: string,
    currentSiteId: string,
    formkiqVersion: any
  ) => {
    if (infoDocumentId?.length) {
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
  const deleteFunc = async (
    id: string,
    softDelete: boolean,
    currentSiteId: string,
    setSelectedDocuments?: (docs: (docs: any) => any) => void
  ) => {
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
    if (setSelectedDocuments) {
      setSelectedDocuments((docs) => docs.filter((doc: any) => doc !== id));
    } else {
      const folderLocation = pathname.split('/').slice(0, -1).join('/');
      navigate(folderLocation);
    }
  };

  const onDeleteClick = (
    id: string,
    softDelete: boolean,
    currentSiteId: string,
    setSelectedDocuments?: (docs: (docs: any) => any) => void
  ) => {
    const dialogTitle = softDelete
      ? 'Are you sure you want to delete this document?'
      : 'Are you sure you want to delete this document permanently?';
    dispatch(
      openDialog({
        callback: () =>
          deleteFunc(id, softDelete, currentSiteId, setSelectedDocuments),
        dialogTitle,
      })
    );
  };
  const getShareModalValue = () => {
    return shareModalValue;
  };
  const getEditAttributesModalValue = () => {
    return editAttributesModalValue;
  };

  const value = {
    shareModalValue,
    shareModalOpened,
    isUploadModalOpened,
    uploadModalDocumentId,
    isFolderUploadModalOpened,
    folderUploadModalDocumentId,
    editAttributesModalValue,
    editAttributesModalOpened,
    documentVersionsModalValue,
    documentVersionsModalOpened,
    documentWorkflowsModalValue,
    documentWorkflowsModalOpened,
    eSignaturesModalValue,
    eSignaturesModalOpened,
    documentReviewModalValue,
    documentReviewModalOpened,
    onShareClick,
    onShareClose,
    onUploadClick,
    onUploadClose,
    onNewClick,
    onNewClose,
    newModalValue,
    isNewModalOpened,
    onFolderUploadClick,
    onFolderUploadClose,
    onEditAttributesModalClick,
    onEditAttributesModalClose,
    onDocumentVersionsModalClick,
    onDocumentVersionsModalClose,
    onDocumentWorkflowsModalClick,
    onDocumentWorkflowsModalClose,
    onESignaturesModalClick,
    onESignaturesModalClose,
    onSubmitForReviewModalClick,
    onSubmitForReviewModalClose,
    onDocumentReviewModalClick,
    onDocumentReviewModalClose,
    updateTags,
    onDeleteClick,
    currentDocumentTags,
    isCurrentDocumentSoftDeleted,
    currentDocumentVersions,
    onRenameModalClick,
    onMoveModalClick,
    renameModalOpened,
    renameModalValue,
    onRenameModalClose,
    moveModalOpened,
    moveModalValue,
    onMoveModalClose,
    getShareModalValue,
    getEditAttributesModalValue,
    onMultiValuedAttributeModalClose,
    multivaluedAttributeModalValue,
    isMultivaluedAttributeModalOpened,
    submitForReviewModalOpened,
    submitForReviewModalValue,
    onAttributeQuantityClick,
    documentRelationshipsModalOpened,
    documentRelationshipsModalValue,
    onDocumentRelationshipsModalClose,
    onDocumentRelationshipsModalClick,
    onActionModalClick,
    onActionModalClose,
    actionModalValue,
    isActionModalOpened,
  };

  return (
    <DocumentActionsContext.Provider value={value}>
      {children}
    </DocumentActionsContext.Provider>
  );
};

export const useDocumentActions = () => {
  const context = useContext(DocumentActionsContext);
  if (context === undefined) {
    throw new Error(
      'useDocumentActions must be used within a DocumentActionsProvider'
    );
  }
  return context;
};
