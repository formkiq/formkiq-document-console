import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Close } from '../../Icons/icons';

export default function AdvancedSearchModal({
  isOpened,
  onClose,
  siteId,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
}) {
  const {
    register,
    formState: { errors },
    reset,
  } = useForm();
  const advancedSearchFormRef = useRef<HTMLFormElement>(null);
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    if (isOpened) {
      setFormActive(true);
    }
  }, [isOpened]);

  const closeDialog = () => {
    setFormActive(false);
    reset();
    onClose();
  };

  const onAdvancedSearchFormSubmit = (event: any) => {
    if (formActive && advancedSearchFormRef.current) {
      //
    }
    event.preventDefault();
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-3/5 h-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Advanced Search
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="flex flext-wrap mt-4">
                    <form
                      className="w-full"
                      ref={advancedSearchFormRef}
                      onSubmit={(event) => onAdvancedSearchFormSubmit(event)}
                    >
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-1/4">
                          <label
                            className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                            htmlFor="content"
                          >
                            Keywords
                            <small className="block">
                              (path, document content)
                            </small>
                          </label>
                        </div>
                        <div className="w-3/4 pr-12">
                          <input
                            aria-label="Path and/or Content Keywords"
                            type="text"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder=""
                            {...register('content', {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-start mx-4 mb-4 relative w-full">
                        <div className="w-full mr-12">
                          <input
                            aria-label="Tags"
                            type="text"
                            className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                    text-sm
                                                    placeholder-gray-500 text-gray-900 rounded-t-md
                                                    focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"
                            placeholder="Tags"
                            {...register('tags', {
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                      <div className="mx-4">
                        <input
                          type="submit"
                          value="Search"
                          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded mr-2"
                        />
                        <button
                          onClick={closeDialog}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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
