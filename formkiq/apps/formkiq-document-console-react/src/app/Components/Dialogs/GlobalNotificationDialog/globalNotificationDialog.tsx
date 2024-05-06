import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  GlobalNotificationState,
  closeDialog,
} from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";

function GlobalNotificationDialog() {
  const dispatch = useAppDispatch();

  const { isOpen, dialogTitle } = useSelector(GlobalNotificationState);

  const onClose = () => {
    dispatch(closeDialog());
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  data-test-id="modal-title"
                  className="text-base font-medium text-center leading-6 pb-2 text-gray-900 pr-2 whitespace-pre-line"
                >
                  {dialogTitle}
                </Dialog.Title>

                <div className="flex w-full justify-center mt-5 h-9">
                  <ButtonPrimaryGradient
                    onClick={onClose}
                    type="button"
                    className="mr-2 font-semibold cursor-pointer focus:outline-none w-20"
                  >
                    OK
                  </ButtonPrimaryGradient>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default GlobalNotificationDialog;
