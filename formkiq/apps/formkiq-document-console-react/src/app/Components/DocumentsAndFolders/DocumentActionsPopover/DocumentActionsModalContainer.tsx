import { useSelector } from 'react-redux';
import { ILine } from '../../../helpers/types/line';
import { AttributesDataState } from '../../../Store/reducers/attributesData';
import ShareModal from '../../Share/share';
import DocumentReviewModal from '../DocumentReviewModal/DocumentReviewModal';
import DocumentVersionsModal from '../DocumentVersionsModal/documentVersionsModal';
import DocumentWorkflowsModal from '../DocumentWorkflowsModal/documentWorkflowsModal';
import EditAttributesModal from '../EditAttributesModal/editAttributesModal';
import ESignaturesModal from '../ESignatures/eSignaturesModal';
import MoveModal from '../MoveModal/moveModal';
import MultiValuedAttributeModal from '../MultivaluedAttributeModal/MultivaluedAttributeModal';
import RenameModal from '../RenameModal/renameModal';
import SubmitForReviewModal from '../SubmitForReviewModal/submitForReviewModal';
import { useDocumentActions } from './DocumentActionsContext';
import DocumentRelationshipsModal from "../DocumentRelationshipsModal/DocumentRelationshipsModal";
import ActionModal from "../ActionModal/actionModal";

const DocumentActionsModalContainer = ({
  currentSiteId,
  isSiteReadOnly,
  currentDocumentsRootUri,
  onDocumentDataChange,
}: {
  currentSiteId: string;
  isSiteReadOnly: boolean;
  currentDocumentsRootUri: string;
  onDocumentDataChange: (event: any, value: ILine | null) => void;
}) => {
  const {
    shareModalOpened,
    shareModalValue,
    onShareClose,
    editAttributesModalOpened,
    editAttributesModalValue,
    onEditAttributesModalClose,
    documentVersionsModalOpened,
    documentVersionsModalValue,
    onDocumentVersionsModalClose,
    documentWorkflowsModalOpened,
    documentWorkflowsModalValue,
    onDocumentWorkflowsModalClose,
    eSignaturesModalOpened,
    eSignaturesModalValue,
    onESignaturesModalClose,
    renameModalOpened,
    renameModalValue,
    onRenameModalClose,
    moveModalOpened,
    moveModalValue,
    onMoveModalClose,
    isUploadModalOpened,
    onUploadClick,
    submitForReviewModalOpened,
    submitForReviewModalValue,
    onSubmitForReviewModalClose,
    documentReviewModalOpened,
    documentReviewModalValue,
    onDocumentReviewModalClose,
    isMultivaluedAttributeModalOpened,
    multivaluedAttributeModalValue,
    onMultiValuedAttributeModalClose,
    getShareModalValue,
    getEditAttributesModalValue,
    documentRelationshipsModalOpened,
    documentRelationshipsModalValue,
    onDocumentRelationshipsModalClose,
    onActionModalClose,
    actionModalValue,
    isActionModalOpened,
  } = useDocumentActions();
  const { allTags } = useSelector(AttributesDataState);

  return (
    <>
      <ShareModal
        isOpened={shareModalOpened}
        onClose={onShareClose}
        value={shareModalValue}
        getValue={getShareModalValue}
      />
      <EditAttributesModal
        isOpened={editAttributesModalOpened}
        onClose={onEditAttributesModalClose}
        siteId={currentSiteId}
        value={editAttributesModalValue}
        onDocumentDataChange={onDocumentDataChange}
        getValue={getEditAttributesModalValue}
      />
      <DocumentVersionsModal
        isOpened={documentVersionsModalOpened}
        onClose={onDocumentVersionsModalClose}
        onUploadClick={onUploadClick}
        isUploadModalOpened={isUploadModalOpened}
        siteId={currentSiteId}
        isSiteReadOnly={isSiteReadOnly}
        documentsRootUri={currentDocumentsRootUri}
        value={documentVersionsModalValue}
      />
      <DocumentWorkflowsModal
        isOpened={documentWorkflowsModalOpened}
        onClose={onDocumentWorkflowsModalClose}
        siteId={currentSiteId}
        isSiteReadOnly={isSiteReadOnly}
        documentsRootUri={currentDocumentsRootUri}
        value={documentWorkflowsModalValue}
      />
      <ESignaturesModal
        isOpened={eSignaturesModalOpened}
        onClose={onESignaturesModalClose}
        siteId={currentSiteId}
        value={eSignaturesModalValue}
      />
      <RenameModal
        isOpened={renameModalOpened}
        onClose={onRenameModalClose}
        siteId={currentSiteId}
        value={renameModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <MoveModal
        isOpened={moveModalOpened}
        onClose={onMoveModalClose}
        siteId={currentSiteId}
        value={moveModalValue}
        allTags={allTags}
        onDocumentDataChange={onDocumentDataChange}
      />
      <SubmitForReviewModal
        isOpened={submitForReviewModalOpened}
        onClose={onSubmitForReviewModalClose}
        siteId={currentSiteId}
        value={submitForReviewModalValue}
        onDocumentDataChange={onDocumentDataChange}
        currentDocumentsRootUri={currentDocumentsRootUri}
      />
      <DocumentReviewModal
        isOpened={documentReviewModalOpened}
        onClose={onDocumentReviewModalClose}
        siteId={currentSiteId}
        value={documentReviewModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <DocumentRelationshipsModal
        isOpened={documentRelationshipsModalOpened}
        onClose={onDocumentRelationshipsModalClose}
        siteId={currentSiteId}
        value={documentRelationshipsModalValue}
        onDocumentDataChange={onDocumentDataChange}
      />
      <MultiValuedAttributeModal
        item={multivaluedAttributeModalValue}
        isOpened={isMultivaluedAttributeModalOpened}
        onClose={onMultiValuedAttributeModalClose}
      />
      <ActionModal
        isOpened={isActionModalOpened}
        onClose={onActionModalClose}
        value={actionModalValue}
        siteId={currentSiteId}
      />
    </>
  );
};

export default DocumentActionsModalContainer;
