import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from "react-hook-form";
import { DocumentsService } from '../../../helpers/services/documentsService'
import ESignatureConfigModal from './eSignatureConfigModal'
import { ILine } from '../../../helpers/types/line'
import { Close, Signature, SignatureTab, Plus, ArrowBottom, ArrowRight, Spinner, Settings } from '../../Icons/icons'
import { useDispatch } from 'react-redux';
import { openDialog } from '../../../Store/reducers/globalConfirmControls';
import { openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls"
import ESignatureRecipient from "./eSignatureRecipient"

export default function ESignaturesModal({isOpened, onClose, siteId, value}: {isOpened: boolean, onClose: any, siteId: string, value: ILine | null}) {

  const [document, setDocument] = useState(null)
  const [recipientFormValues, setRecipientFormValues] = useState([{ name: "", email : "", type: "signer"}])
  const [isFormProcessing, setIsFormProcessing] = useState(false)
  const { register, formState: { errors }, handleSubmit, reset, setValue } = useForm();
  const cancelButtonRef = useRef(null)
  const sendForESignatureFormRef = useRef(null)
  const [isConfigModalOpened, setIsConfigModalOpened] = useState(false)
  const [isESignatureLoading, setIsESignatureLoading] = useState(false)
  const onConfigModalClose = () => {
    setIsConfigModalOpened(false);
  };
  const [recipientsExpanded, setRecipientsExpanded] = useState(true)
  const toggleRecipientsExpand = () => {
    setRecipientsExpanded(!recipientsExpanded)
  }
  const toggleESignatureConfig = () => {
    setIsConfigModalOpened(!isConfigModalOpened)
  }
  const dispatch = useDispatch()
  const closeDialog = () => {
    reset();
    value = null
    setRecipientFormValues([{ name: "", email : "", type: "signer"}])
    onClose();
  }

  const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  useEffect(() => {
    if (value) {
      setIsESignatureLoading(true)
      DocumentsService.getESignatureConfig(siteId).then((response) => {
        if (!response.configured) {
          setIsConfigModalOpened(true)
        } else {
          DocumentsService.getDocumentById((value as ILine).documentId, siteId).then((response: any) => {
            setIsESignatureLoading(false)
            let filename = response.path
            if (filename.lastIndexOf('/') > -1) {
              filename = filename.substring(filename.lastIndexOf('/') + 1)
            }
            response.filename = filename
            setValue('subjectForMessage', 'Complete with DocuSign: ' + response.filename)
            setDocument(response)
          })
        }
      })
    }
  }, [value, isConfigModalOpened])
  
  const handleRecipientChange = (i: any, e: any) => {
    const newRecipientFormValues: any = [...recipientFormValues];
    newRecipientFormValues[i][e.target.name] = e.target.value;
    setRecipientFormValues(newRecipientFormValues);
    if (e.target.name === 'name') {
      if (e.target.value.length) {
        e.target.classList.remove('bg-red-100')
      } else {
        e.target.classList.add('bg-red-100')
      }
    }
    if (e.target.name === 'email') {
      if (emailRegex.test(e.target.value)) {
        e.target.classList.remove('bg-red-100')
      } else {
        e.target.classList.add('bg-red-100')
      }
    }
  }

  const addRecipientFormField = () => {
    setRecipientFormValues([...recipientFormValues, { name: "", email: "", type: "signer" }])
  }

  const removeRecipientFormField = (i: any) => {
    const newRecipientFormValues = [...recipientFormValues];
    newRecipientFormValues.splice(i, 1);
    setRecipientFormValues(newRecipientFormValues)
  }

  const onSendForESignatureSubmit = async (data: any) => {
    if (value) {
      let invalidName = false
      let invalidEmail = false
      if (recipientFormValues && recipientFormValues.length) {
        const signers: any[] = []
        const carbonCopies: any[] = []
        recipientFormValues.forEach((recipientFormValue) => {
          if (!recipientFormValue.name.length) {
            invalidName = true
          }
          if (!emailRegex.test(recipientFormValue.email)) {
            invalidEmail = true
          }
          if (!invalidName && !invalidEmail) {
            if (recipientFormValue.type === "signer") {
              signers.push({
                name: recipientFormValue.name,
                email: recipientFormValue.email
              })
            } else if (recipientFormValue.type === "carbonCopy") {
              carbonCopies.push({
                name: recipientFormValue.name,
                email: recipientFormValue.email
              })
            }
          }
        })
        if (invalidName || invalidEmail) {
          if (invalidName && invalidEmail) {
            dispatch(openNotificationDialog({ dialogTitle: 'You must provide valid names and email addresses for each recipient'}))
          } else if (invalidName) {
            dispatch(openNotificationDialog({ dialogTitle: 'You must provide valid names for each recipient'}))
          } else if (invalidEmail) {
            dispatch(openNotificationDialog({ dialogTitle: 'You must provide valid email addresses for each recipient'}))
          }
        } else if (signers.length === 0) {
          dispatch(openNotificationDialog({ dialogTitle: 'You must provide at least one recipient who needs to sign'}))
        } else {
          setIsFormProcessing(true)
          DocumentsService.sendForDocusignESignature((value as ILine).documentId, siteId, data.subjectForMessage, 'sent', signers as [], carbonCopies as []).then((response) => {
            if (response.message && response.message === "ok") {
              closeDialog();
              reset();
              setRecipientFormValues([{ name: "", email : "", type: "signer"}])
              dispatch(openNotificationDialog({ dialogTitle: 'This document has been sent out for signature'}))
              setIsFormProcessing(false)
            } else {
              dispatch(openNotificationDialog({ dialogTitle: 'An error has occured. Please try again in a few minutes.'}))
              setIsFormProcessing(false)
            }
          })
        }
      } else {
        dispatch(openNotificationDialog({ dialogTitle: 'You must include at least one recipient.'}))
      }

    }
  };
  
  return (
    <>
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-coreOrange-500 via-red-500 to-coreOrange-600">
                          Document eSignature
                        </span>
                        { document && (
                          <span className="block text-sm font-normal">
                            {(document as any).path}
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
                    { isESignatureLoading && (
                      <Spinner />
                    )}
                    { document && !isFormProcessing && (
                      <div className="mt-6">
                        <form
                          onSubmit={handleSubmit(onSendForESignatureSubmit)}
                          className="w-full"
                          ref={sendForESignatureFormRef}
                          >
                          <div className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4">
                            <div className="uppercase font-semibold text-base">
                              Subject for Email Message
                            </div>
                          </div>
                          <div className="flex items-start mx-4 mb-4 pr-12 relative w-full">
                            <div className="w-full mr-2">
                              <input
                                aria-label="Subject for Message"
                                type="text"
                                className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600
                                                  text-sm
                                                  placeholder-gray-500 text-gray-900 rounded-t-md
                                                  focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                                {...register('subjectForMessage', {
                                  required: false,
                                  value: "Complete with DocuSign: " + (document as any).filename
                                })}
                              />
                            </div>
                          </div>
                          <div
                            className="w-full flex self-start text-gray-400 hover:text-gray-500 justify-center lg:justify-start whitespace-nowrap py-4 cursor-pointer"
                            >
                            <div className="hidden flex justify-end mt-3 mr-1">
                              { recipientsExpanded ? ( <ArrowBottom /> ) : ( <ArrowRight /> )}
                            </div>
                            <div className="uppercase font-semibold text-base">
                              Recipients
                              <small className="block">
                                (in order of signing)
                              </small>
                            </div>
                          </div>
                          { recipientsExpanded && (
                            <>
                              {recipientFormValues.map((element, i) => {
                                let bgColorClass = 'bg-yellow-100'
                                switch (i % 3) {
                                  case 0:
                                    break
                                  case 1:
                                    bgColorClass = 'bg-orange-100'
                                    break
                                  case 2:
                                    bgColorClass = 'bg-violet-100'
                                    break
                                }
                                return (
                                  <div key={i} className={`${bgColorClass} border ml-2 mt-4 py-4 flex flex-cols`}>
                                    <div className="grow">
                                      <ESignatureRecipient element={element} index={i} handleChange={handleRecipientChange} removeFormField={removeRecipientFormField} />
                                    </div>
                                  </div>
                                )
                              })}
                              <div className="mt-4 w-full flex justify-start">
                                <button
                                  type="button"
                                  className="w-64 flex justify-center mr-2 bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                                  onClick={addRecipientFormField}
                                  >
                                  <span>Add Recipient</span>
                                  <div className="w-4 h-4 mt-1 ml-2">
                                    {Plus()}
                                  </div>
                                </button>
                              </div>
                            </>
                          )}
                          <div className="mt-8 flex items-center justify-center mx-4 mb-4 relative w-full">
                            <button type="button" className="w-64 flex justify-center mr-2 bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none">
                              <span>Set Up Signature Tabs...</span>
                              <div className="w-5 h-5 ml-2">
                                {SignatureTab()}
                              </div>
                            </button> 
                            <button type="submit" className="w-64 flex justify-center mr-2 bg-gradient-to-l from-coreOrange-400 via-red-400 to-coreOrange-500 hover:from-coreOrange-500 hover:via-red-500 hover:to-coreOrange-600 text-white text-base font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none" >
                              <span>Send for Signature</span>
                              <div className="w-4 h-4 ml-2 mt-1">
                                {Signature()}
                              </div>
                            </button>
                            <button
                              type="button"
                              className="w-48 flex justify-center mr-2 bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                              onClick={toggleESignatureConfig}
                              >
                              <span>Reconfigure</span>
                              <div className="w-4 h-4 ml-2 mt-1">
                                {Settings()}
                              </div>
                            </button> 
                            <button
                              type="button"
                              className="w-48 flex flex justify-center mr-2 bg-gradient-to-l from-gray-200 via-stone-200 to-gray-300 hover:from-gray-300 hover:via-stone-300 hover:to-gray-400 text-gray-900 text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                              onClick={closeDialog}
                              >
                              <span>Cancel</span>
                            </button> 
                          </div>
                          <div className="mt-4 flex justify-center w-full">
                              <div className="text-sm text-gray-600">
                                You can set up signature tabs or send as-is (recipients will place their own signature tab)
                              </div>
                          </div>
                        </form>
                      </div>
                    )}
                    { document && isFormProcessing && (
                      <>
                        <div className="flex justify-center">
                          <Spinner />
                        </div>
                        <div className="mt-4 flex justify-center font-semibold">
                          Submitting for eSignature...
                        </div>
                      </>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ESignatureConfigModal
        isOpened={isConfigModalOpened}
        onClose={onConfigModalClose}
        closeOpener={closeDialog}
        siteId={siteId}
      />
    </>
  );
}