import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import { CopyButton } from '../../Generic/Buttons/CopyButton';
import { Checkmark, Close, Plus } from '../../Icons/icons';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';

const RELATIONSHIP_TYPES = [
  'PRIMARY',
  'ATTACHMENT',
  'APPENDIX',
  'SUPPLEMENT',
  'ASSOCIATED',
  'RENDITION',
];

export default function DocumentRelationshipsModal({
  isOpened,
  onClose,
  siteId,
  value,
  onDocumentDataChange,
}: {
  isOpened: boolean;
  onClose: () => void;
  siteId: string;
  value: ILine | null;
  onDocumentDataChange: any;
}) {
  const dispatch = useAppDispatch();
  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const [relationshipType, setRelationshipType] = useState(
    RELATIONSHIP_TYPES[0]
  );
  const [documentId, setDocumentId] = useState('');
  const [documentRelationships, setDocumentRelationships] = useState<any[]>([]);
  const [isDocumentRelationshipsExist, setIsDocumentRelationshipsExist] =
    useState(false);

  const getDocumentRelationships = () => {
    if (!value?.documentId) return;
    DocumentsService.getDocumentAttribute(
      siteId,
      value?.documentId,
      'relationships'
    ).then((response) => {
      if (response.status === 200) {
        setDocumentRelationships(response.attribute);
        setIsDocumentRelationshipsExist(true);
      } else {
        setIsDocumentRelationshipsExist(false);
      }
    });
  };

  useEffect(() => {
    getDocumentRelationships();
  }, [value, siteId]);

  function updateDocumentRelationships() {}

  const closeDialog = () => {
    onClose();
  };

  function addRelationship() {
    const newRelationship = {
      documentId: documentId,
      relationship: relationshipType,
    };
    setDocumentRelationships([...documentRelationships, newRelationship]);
  }

  function onSave() {
    if (!value?.documentId) return;
    if (!isDocumentRelationshipsExist) {
      DocumentsService.addDocumentAttributes(
        siteId,
        'false',
        value.documentId,
        { attributes: [{ relationships: documentRelationships }] }
      );
    }
  }
useEffect(() => {
   console.log(documentRelationships);
}, [documentRelationships]);
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={approveButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-4/5">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                      Document Relationships
                      <span className="block"></span>
                    </div>
                    <div className="w-100"></div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>

                  <div className="flex gap-2 h-8 my-4">
                    <RadioListbox
                      values={RELATIONSHIP_TYPES}
                      titles={RELATIONSHIP_TYPES}
                      selectedValue={relationshipType}
                      setSelectedValue={setRelationshipType}
                    />
                    <input
                      type="text"
                      className="w-full h-8 px-2 border border-gray-300 rounded-md"
                      placeholder="Document ID"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                    />
                    <button
                      type="button"
                      className="w-8 h-8"
                      onClick={addRelationship}
                    >
                      <Plus />
                    </button>
                  </div>

                  <div className="w-full flex justify-end h-8 gap-2">
                    <ButtonPrimaryGradient type="button" onClick={onSave}>
                      SAVE
                    </ButtonPrimaryGradient>
                    <ButtonGhost type="button" onClick={closeDialog}>
                      CANCEL
                    </ButtonGhost>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
