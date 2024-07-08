import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';
import { Close } from '../../Icons/icons';

function MultiValuedAttributeModal(props: any) {
  const item = props.item;
  const isOpened = props.isOpened;
  const visibilityFunc = props.onClose;

  const buttonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    isOpened && (
      <div className="mvModalBackground">
        <button onClick={visibilityFunc} ref={buttonRef}>
          X
        </button>
        <Transition.Root show={isOpened} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-20"
            onClose={visibilityFunc}
            initialFocus={buttonRef}
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
                        <div className="font-semibold grow text-xl text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                          {item.key}
                          {item.values && <> ({item.values.length} values)</>}
                          {item.stringValues && (
                            <> ({item.stringValues.length} values)</>
                          )}
                          {item.numberValues && (
                            <> ({item.numberValues.length} values)</>
                          )}
                          <span className="block"></span>
                        </div>
                        <div
                          className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                          onClick={visibilityFunc}
                        >
                          <Close />
                        </div>
                      </div>
                      <div className="mt-2 max-h-100 overflow-y-scroll">
                        {item?.values !== undefined && (
                          <div className="rounded-lg border border-gray-400 p-1 text-lg font-normal overflow-auto">
                            {item.values.map((val: any, index: number) => (
                              <>
                                {val}
                                {index < item.values.length - 1 && (
                                  <hr className="my-2 border border-gray-400" />
                                )}
                              </>
                            ))}
                          </div>
                        )}
                        {item?.stringValues !== undefined && (
                          <div className="rounded-lg border border-gray-400 p-1 text-lg font-normal  overflow-auto">
                            {item.stringValues.map(
                              (val: any, index: number) => (
                                <>
                                  {val}
                                  {index < item.stringValues.length - 1 && (
                                    <hr className="my-2 border border-gray-400" />
                                  )}
                                </>
                              )
                            )}
                          </div>
                        )}
                        {item?.numberValues !== undefined && (
                          <div className="rounded-lg border border-gray-400 p-1 text-lg font-normal  overflow-auto">
                            {item.numberValues.map(
                              (val: any, index: number) => (
                                <>
                                  {val}
                                  {index < item.numberValues.length - 1 && (
                                    <hr className="my-2 border border-gray-400" />
                                  )}
                                </>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    )
  );
}
export default MultiValuedAttributeModal;
