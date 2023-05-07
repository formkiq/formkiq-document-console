import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  closeDialog,
  confirmAction,
} from '../../../Store/reducers/globalConfirmControls';
import { RootState, useAppDispatch } from '../../../Store/store';

function GlobalConfirmDialog({ confirmDialog }: any) {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog());
  };
  const onConfirm = () => {
    dispatch(confirmAction());
  };
  return (
    <Transition appear show={confirmDialog.isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium text-center leading-6 pb-2 text-gray-900"
                >
                  {confirmDialog.dialogTitle}
                </Dialog.Title>

                <div className="flex w-full justify-center pt-5">
                  <button
                    onClick={onConfirm}
                    type="button"
                    data-test-id="global-modal-ok"
                    className="mr-2 bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    data-test-id="global-modal-cancel"
                    className="bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-sm font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const mapStateToProps = (state: RootState) => {
  const { confirmDialog } = state.globalConfirmControls;
  return { confirmDialog };
};

export default connect(mapStateToProps)(GlobalConfirmDialog);
