import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { closeDialog } from '../../../Store/reducers/globalNotificationControls';
import { RootState, useAppDispatch } from '../../../Store/store';

function GlobalNotificationDialog({ notificationDialog }: any) {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog());
  };
  return (
    <Transition appear show={notificationDialog.isOpened} as={Fragment}>
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
                  data-test-id="modal-title"
                  className="text-lg font-medium text-center leading-6 pb-2 text-gray-900"
                >
                  {notificationDialog.dialogTitle}
                </Dialog.Title>

                <div className="flex w-full justify-center pt-5">
                  <button
                    onClick={onClose}
                    type="button"
                    className="mr-2 bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"
                  >
                    OK
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
  const { notificationDialog } = state.globalNotificationControls;
  return { notificationDialog };
};

export default connect(mapStateToProps)(GlobalNotificationDialog as any);
