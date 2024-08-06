import {Dialog, Transition} from '@headlessui/react';
import {Fragment, useRef} from 'react';
import {Close} from '../Icons/icons';
import AddAttributeForm from "../DocumentsAndFolders/EditAttributesModal/AddAttributeForm";

export default function CreateNewAttributeModal({
                                                  isOpened,
                                                  onClose,
                                                  siteId,
                                                  updateAllAttributes,
                                                }: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  updateAllAttributes: any;
}) {
  const doneButtonRef = useRef(null);
  const closeDialog = () => {
    onClose();
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={doneButtonRef}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"/>
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
              <Dialog.Panel className="relative transform text-left transition-all w-full lg:w-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="w-full flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-bold mb-4 mx-2">
                      Create New Attribute
                    </Dialog.Title>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close/>
                    </div>
                  </div>
                  <div className="mr-4">
                    <AddAttributeForm siteId={siteId}
                                      onDocumentDataChange={() => updateAllAttributes()}
                                      value={null}
                                      getValue={() => {
                                      }}
                                      onClose={onClose}
                                      setSelectedAttributeKey={() => {
                                      }}
                                      isAddingDocumentAttribute={false}
                    />
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
