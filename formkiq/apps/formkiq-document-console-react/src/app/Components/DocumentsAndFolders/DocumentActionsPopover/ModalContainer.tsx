import { useDocumentActions } from './DocumentActionsContext';
import ShareModal from '../../Share/share';
import EditAttributesModal from '../EditAttributesModal/editAttributesModal';
import DocumentVersionsModal from '../DocumentVersionsModal/documentVersionsModal';
import DocumentWorkflowsModal from '../DocumentWorkflowsModal/documentWorkflowsModal';
import ESignaturesModal from '../ESignatures/eSignaturesModal';
import RenameModal from '../RenameModal/renameModal';
import MoveModal from '../MoveModal/moveModal';
import DocumentReviewModal from '../DocumentReviewModal/DocumentReviewModal';
import MultiValuedAttributeModal from '../MultivaluedAttributeModal/MultivaluedAttributeModal';
import {IDocumentTag} from "../../../helpers/types/documentTag";
import {ILine} from "../../../helpers/types/line";

const ModalContainer = ({
  currentSiteId,
  isSiteReadOnly,
  currentDocumentsRootUri,
  onDocumentDataChange,
  allTags,
}: {

    currentSiteId: string;
    isSiteReadOnly: boolean;
    currentDocumentsRootUri: string;
    onDocumentDataChange: (event: any, value: ILine | null) => void;
    allTags: IDocumentTag[];
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
    uploadModalOpened,
    onUploadClose,
    documentReviewModalOpened,
    documentReviewModalValue,
    onDocumentReviewModalClose,
    isMultivaluedAttributeModalOpened,
    multivaluedAttributeModalValue,
    onMultiValuedAttributeModalClose,
    // currentSiteId,
    // isSiteReadOnly,
    // currentDocumentsRootUri,
    // onDocumentDataChange,
    // allTags,
    getShareModalValue,
    getEditAttributesModalValue,
  } = useDocumentActions();

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
        onUploadClick={onUploadClose}
        isUploadModalOpened={uploadModalOpened}
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
      <DocumentReviewModal
        isOpened={documentReviewModalOpened}
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
};

export default ModalContainer;
