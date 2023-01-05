import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import { closeDialog } from '../../../Store/reducers/globalNotificationControls';

function GlobalNotificationDialog({ notificationDialog }: any) {
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeDialog() as any);
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
                  className="text-lg font-medium text-center leading-6 pb-2 text-gray-900"
                >
                  {notificationDialog.dialogTitle}
                </Dialog.Title>

                <div className="flex w-full justify-center pt-5">
                  <button
                    onClick={onClose}
                    type="button"
                    className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-coreOrange-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
