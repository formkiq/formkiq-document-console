import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from "react-router-dom";
import { DocumentsService } from '../../../helpers/services/documentsService'
import { ILine } from '../../../helpers/types/line'
import { Close, Upload } from '../../Icons/icons'
import { useDispatch } from 'react-redux';
import { InlineViewableContentTypes } from "../../../helpers/constants/contentTypes";
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import moment from "moment"

export default function DocumentVersionsModal({isOpened, onClose, onUploadClick, isUploadModalOpened, siteId, documentsRootUri, value}: {isOpened: boolean, onClose: any, onUploadClick: any, isUploadModalOpened: boolean, siteId: string, documentsRootUri: string, value: ILine | null}) {

  const [versions, setVersions] = useState(null)
  const cancelButtonRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const closeDialog = () => {
      onClose();
  }

  useEffect(() => {
    updateVersions()
  }, [value])

  useEffect(() => {
    if (isUploadModalOpened === false) {
      setTimeout(() => {
        updateVersions()
      }, 500)
    }
  }, [isUploadModalOpened])

  const updateVersions = () => {
    if(value) {
      setVersions(null)
      DocumentsService.getDocumentById(value.documentId as string, siteId).then((docResponse) => {
        DocumentsService.getDocumentVersions(value.documentId as string, siteId).then((data) => {
          const vers = data?.documents.map((doc: any) => {
            doc.insertedDate = moment(doc.insertedDate).format(
              'YYYY-MM-DD HH:mm'
            );
            doc.lastModifiedDate = moment(doc.lastModifiedDate).format(
              'YYYY-MM-DD HH:mm'
            );
            return doc
          })
          docResponse.insertedDate = moment(docResponse.insertedDate).format(
            'YYYY-MM-DD HH:mm'
          );
          docResponse.lastModifiedDate = moment(docResponse.lastModifiedDate).format(
            'YYYY-MM-DD HH:mm'
          );
          vers.unshift(docResponse)
          setVersions(vers)
        })
      })
    }
  }
  const viewDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      if (versionKey !== undefined) {
        window.open(`${window.location.origin}${documentsRootUri}/${value.documentId}/view?versionKey=${versionKey}`)
        // navigate(`/documents/${value.documentId}/view?versionKey=${versionKey}`)
      } else {
        window.open(`${window.location.origin}${documentsRootUri}/${value.documentId}/view`)
        // navigate(`/documents/${value.documentId}/view`)
      }
    }
  }
  const downloadDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      let downloadVersionKey = ''
      if (versionKey && versionKey.length) {
        downloadVersionKey = versionKey
      }
      DocumentsService.getDocumentUrl(value.documentId, siteId, downloadVersionKey, false).then((urlResponse: any) => {
        if (urlResponse.url) {
          window.location.href = urlResponse.url;
        }
      });
    }
  }
  const revertDocumentVersion = (event: any, versionKey: string) => {
    if (value) {
      DocumentsService.putDocumentVersion(value.documentId, versionKey, siteId).then((urlResponse: any) => {
        if (urlResponse.status === '400') {
          dispatch(openDialog({ dialogTitle: 'An error has occurred. Please try again in a few minutes.'}))
        } else {
          updateVersions()
        }
      });
    }
  }

  /*
  const onTagDelete = (tagKey: string) => {
    const deleteFunc = () => {
      setAlltags(null)
      // TODO: add site id
      DocumentsService.deleteDocumentTag(value?.documentId as string, tagKey).then(() => {
        updateTags()
      })
    }
    dispatch(openDialog({ callback: deleteFunc, dialogTitle: 'Are you sure you want to delete this tag?'}))
  }
  */
  
  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-3/4">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg inline-block pr-6">
                      Document Versions
                      <span className="block">

                      </span>
                    </div>
                    <div className="w-100">
                      <button onClick={event => onUploadClick(event, (value as any).documentId)} className="w-64 flex bg-gray-100 justify-center px-4 py-1 text-base text-gray-900 rounded-md cursor-pointer" >
                        <span>Upload New Version</span>
                        <div className="w-4 h-4 ml-2 mt-1">
                          {Upload()}
                        </div>
                      </button>
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="mt-6 max-h-100 overflow-y-scroll">
                    <table className="border-collapse table-fixed w-full text-sm">
                      <thead>
                          <tr>
                          <th className="w-20 border-b nodark:border-slate-600 font-medium p-2 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Version</th>
                          <th className="w-48 border-b nodark:border-slate-600 font-medium p-2 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Path</th>
                          <th className="w-32 border-b nodark:border-slate-600 font-medium p-2 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Created</th>
                          <th className="w-32 border-b nodark:border-slate-600 font-medium p-2 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Last modified</th>
                          <th className="w-64 border-b nodark:border-slate-600 font-medium p-2 pr-4 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Content Type</th>
                          <th className="border-b nodark:border-slate-600 font-medium p-2 pt-0 pb-3 text-slate-400 nodark:text-slate-200 text-left">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                        {versions && (versions as []).length === 0 && (
                          <tr>
                            <td colSpan={3} className="p-2 text-center">
                              No versions exist for this document.
                            </td>
                          </tr>
                        )}
                        {versions && (versions as []).map((version: any, i: number) => {
                          return (
                            <tr key={i}>
                              <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                {version.version ? (
                                  <span>{version.version}</span>
                                ) : (
                                  <span className="font-bold">(current)</span>
                                )}
                                
                              </td>
                              <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400 overflow-hidden">
                                { version.path }
                              </td>
                              <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                { version.insertedDate }
                              </td>
                              <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                { version.lastModifiedDate }
                              </td>
                              <td className="border-b text-xs border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400 overflow-hidden">
                                { version.contentType }
                              </td>
                              <td className="border-b border-slate-100 nodark:border-slate-700 p-2 pr-2 text-slate-500 nodark:text-slate-400">
                                <div className='flex gap-4'>
                                  { InlineViewableContentTypes.indexOf(version.contentType) > -1 && (
                                    <button
                                      className="bg-coreOrange-500 hover:bg-coreOrange-600 text-smaller text-white font-semibold py-1 px-2 rounded"
                                      onClick={event => viewDocumentVersion(event, version.versionKey)}
                                      >
                                      View
                                    </button>
                                  )}
                                  <button
                                    className="bg-coreOrange-500 hover:bg-coreOrange-600 text-smaller text-white font-semibold py-1 px-2 rounded"
                                    onClick={event => downloadDocumentVersion(event, version.versionKey)}
                                    >
                                    Download
                                  </button>
                                  {version.version && (
                                    <>
                                      <button
                                        className="bg-coreOrange-500 hover:bg-coreOrange-600 text-smaller text-white font-semibold py-1 px-2 rounded"
                                        onClick={event => revertDocumentVersion(event, version.versionKey)}
                                        >
                                        Set as Current Version
                                      </button>
                                      <button className='hidden bg-red-400 hover:bg-red-700 text-smaller text-white font-semibold py-1 px-2 rounded'>
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
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