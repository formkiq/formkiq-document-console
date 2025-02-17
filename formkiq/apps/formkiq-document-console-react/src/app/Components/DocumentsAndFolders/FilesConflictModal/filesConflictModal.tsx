import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Close } from '../../Icons/icons';

interface FilesConflictModalProps {
  isOpened: boolean;
  existedFile: any;
  handleSeparateFile: () => void;
  handleNewVersionFile: () => void;
  onFilesConflictModalClosed: () => void;
}

export default function FilesConflictModal({
  isOpened,
  existedFile,
  handleSeparateFile,
  handleNewVersionFile,
  onFilesConflictModalClosed,
}: FilesConflictModalProps) {
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => {}}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Dialog.Panel className="bg-white rounded-lg p-6 shadow-xl relative">
              <div
                className="absolute right-4 w-5 h-5 mr-2 cursor-pointer text-gray-400"
                onClick={onFilesConflictModalClosed}
                title="Close"
              >
                <Close />
              </div>
              <Dialog.Title className="mt-10 text-lg font-bold">
                There is already a document named {existedFile?.path}.
              </Dialog.Title>
              <p>
                Would you like to upload a new version of this document or a
                separate file?
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleSeparateFile}
                  className="nline-flex w-full justify-center rounded-md border border-gray-300 bg-primary-500 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Separate File
                </button>
                <button
                  onClick={handleNewVersionFile}
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  New Version
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
