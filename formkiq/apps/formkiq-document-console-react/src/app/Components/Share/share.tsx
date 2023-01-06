import { Fragment, useRef, } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ILine } from '../../helpers/types/line'
import { ArrowBottom, Close, Search, Settings, UserIcon } from '../Icons/icons'

export default function ShareModal({isOpened, onClose, getValue, value}: {isOpened: boolean, onClose: any, getValue: any, value: ILine | null}) {

    const cancelButtonRef = useRef(null)
    //const uploaderRef = useRef<UploaderComponent>(null)

    const closeDialog = () => {
        // setUploaded([]);
        onClose();
    }

    return (
        <Transition.Root show={isOpened} as={Fragment}>
            <Dialog as="div" className="relative z-20" initialFocus={cancelButtonRef} onClose={onClose}>
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
                                    {getValue() && getValue().lineType === 'folder' && (
                                        <span>
                                            Share folder - {getValue().folder}
                                        </span>
                                    )}
                                    {getValue() && getValue().lineType === 'document' && (
                                        <span>
                                            Share with others
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                                    onClick={closeDialog}
                                    >
                                    <Close />
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                <div _ngcontent-wxp-c51="" className="w-full md:flex md:items-center rounded-md mx-4 mb-4 mt-2.5 relative bg-white border " >
                                    <Search></Search>
                                    <input 
                                        aria-label="text" 
                                        type="text" 
                                        placeholder="Enter email address" 
                                        className="block w-full appearance-none bg-transparent py-2 pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-600 focus:outline-none sm:text-sm sm:leading-6" 
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full h-72 items-start">
                                <div className="flex mx-4 mt-2 mb-4 w-full h-12">
                                    <div className="w-16 flex">
                                        <div className="w-10 h-10 flex justify-center text-white items-center bg-gray-100 rounded-full">
                                            <span className="w-4 h-4 text-gray-400">
                                                <UserIcon />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grow font-semibold text-sm">
                                        User
                                        <span className="block text-xs font-normal">
                                            me@email.com
                                        </span>
                                    </div>
                                    <div className="w-24 text-sm mr-2 text-gray-400 text-right">
                                        Owner
                                    </div>
                                </div>
                                <div className="flex mx-4 mt-2 mb-4 w-full h-12">
                                    <div className="w-16 flex">
                                        <div className="w-10 h-10 flex justify-center text-white items-center bg-gray-100 rounded-full">
                                            <span className="w-4 h-4 text-gray-400">
                                                <UserIcon />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grow font-semibold text-sm">
                                        Joanne Smith
                                        <span className="block text-xs font-normal">
                                            joanne.smith.client@gmail.com
                                        </span>
                                    </div>
                                    <div className="w-24 text-sm mr-2 text-gray-700 text-right">
                                        Can View
                                        <span className="ml-2" style={{width: '15px', height: '13px'}}>{ ArrowBottom() }</span>
                                    </div>
                                </div>
                                <div className="grow h-full"></div>
                            </div>
                            <div className="flex w-full">
                                <div className="w-full mt-2 mx-6 border-b"></div>
                            </div>
                            <div className="flex mt-2">
                                <div className="mt-2 flex w-12 pt-0.5 justify-center">
                                    <Settings />
                                </div>
                                <div className="mt-2 grow font-semibold text-sm text-gray-400">
                                    Advanced Settings
                                </div>
                                <div className="w-32 mr-8">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 cursor-pointer
                                            bg-coreOrange-500 px-4 py-2 text-base font-medium text-white focus:outline-none"
                                        onClick={closeDialog}
                                        ref={cancelButtonRef}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 bg-white p-4 rounded-lg bg-white shadow-xl border h-full">
                            <div className="flex ml-2">
                                <div className="grow font-bold text-base text-gray-600">
                                    Share link
                                    <span className="block text-xs font-normal text-gray-400">
                                        Only people with the link can access
                                        <span className="pl-2 text-sm text-coreOrange-500 font-semibold">
                                            Change
                                        </span>
                                    </span>
                                </div>
                                <div className="w-24 mr-8">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md
                                            bg-gray-100 px-2 py-2 text-sm font-medium text-gray-600 focus:outline-none"
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}