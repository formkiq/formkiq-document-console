import React, {useRef} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import ButtonPrimaryGradient from "../Buttons/ButtonPrimaryGradient";
import ButtonGhost from "../Buttons/ButtonGhost";

interface DuplicateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDuplicate: (newName: string) => void;
  initialName?: string; // Optional initial value for the input field
}

const DuplicateDialog: React.FC<DuplicateDialogProps> = ({
                                                           isOpen,
                                                           onClose,
                                                           onDuplicate,
                                                           initialName = '',
                                                         }) => {
  const newNameRef = useRef<HTMLInputElement>(null);

  const handleDuplicate = () => {
    const newName = newNameRef.current!.value.trim();
    if (newName) {
      onDuplicate(newName);
      onClose();
    }
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto bg-neutral-500 bg-opacity-75 p-4 md:p-0 flex items-center justify-center"
        onClose={onClose}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel
            className="fixed transform transition-all w-full max-w-sm p-5 mx-auto rounded-md shadow-lg bg-white">
            <Dialog.Title className="font-bold text-lg text-neutral-900">
              Duplicate
            </Dialog.Title>
            <div className="mt-6">
              <label
                htmlFor="newName"
                className="block text-sm font-medium text-neutral-700"
              >
                Enter a name for the new copy:
              </label>
              <input
                type="text"
                id="newName"
                ref={newNameRef}
                className="mt-1 px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500 block w-full rounded-md border border-neutral-300 shadow-sm"
                defaultValue={initialName}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <ButtonGhost
                type="button"
                style={{height: '40px'}}
                onClick={onClose}
              >
                Cancel
              </ButtonGhost>
              <ButtonPrimaryGradient
                type="button"
                style={{height: '40px'}}
                onClick={handleDuplicate}
              >
                Duplicate
              </ButtonPrimaryGradient>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default DuplicateDialog;
