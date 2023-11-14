import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Close, Workspace } from '../Icons/icons';

export default function WorkspacesModal({
  isOpened,
  onClose,
  workspaceSites,
}: {
  isOpened: boolean;
  onClose: any;
  workspaceSites: any;
}) {
  const closeDialog = () => {
    onClose();
  };
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => {}}>
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-1/2 h-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Workspaces
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flext-wrap mt-4">
                    {workspaceSites &&
                      workspaceSites.map((site: any, i: number) => {
                        return (
                          <li
                            key={i}
                            className="pl-3 w-full flex self-start justify-center lg:justify-start whitespace-nowrap"
                          >
                            <NavLink
                              to={'/workspaces/' + site.siteId}
                              end
                              onClick={closeDialog}
                              className={({ isActive }) =>
                                (isActive
                                  ? 'text-coreOrange-500 bg-gray-100 '
                                  : 'text-gray-500') +
                                ' w-full text-sm font-medium flex bg-white'
                              }
                            >
                              <div
                                className={
                                  'w-full text-sm font-medium flex pl-5 py-4 bg-white'
                                }
                              >
                                <div className="w-4 flex flex-wrap items-center mr-2">
                                  <Workspace />
                                </div>
                                <div>
                                  <span>
                                    {site.siteId.replaceAll('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </NavLink>
                          </li>
                        );
                      })}
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
