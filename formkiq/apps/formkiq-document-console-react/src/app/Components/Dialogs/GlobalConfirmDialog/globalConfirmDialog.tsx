import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  GlobalConfirmState,
  hideDialog,
} from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";

function GlobalConfirmDialog() {
  const dispatch = useAppDispatch();

  const { isOpen, dialogTitle, callback } = useSelector(GlobalConfirmState);

  const onClose = () => {
    dispatch(hideDialog());
  };

  const onConfirm = async () => {
    if (callback) {
      await callback();
    }
    dispatch(hideDialog());
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        data-test-id="global-confirm-body"
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
                  {dialogTitle}
                </Dialog.Title>

                <div className="flex w-full justify-center mt-5 h-9">
                  <ButtonPrimaryGradient
                    onClick={onConfirm}
                    type="button"
                    data-test-id="global-modal-ok"
                    className="mr-2 font-semibold cursor-pointer focus:outline-none w-20"
                  >
                    OK
                  </ButtonPrimaryGradient>
                  <ButtonGhost
                    type="button"
                    data-test-id="global-modal-cancel"
                    onClick={onClose}
                  >
                    Cancel
                  </ButtonGhost>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default GlobalConfirmDialog;
