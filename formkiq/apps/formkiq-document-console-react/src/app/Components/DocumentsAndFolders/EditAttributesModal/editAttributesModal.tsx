import {Dialog, Transition} from '@headlessui/react';
import {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {openDialog} from '../../../Store/reducers/globalConfirmControls';
import {openDialog as openNotificationDialog} from '../../../Store/reducers/globalNotificationControls';
import {useAppDispatch} from '../../../Store/store';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {ILine} from '../../../helpers/types/line';
import {Close} from '../../Icons/icons';
import EditTagsAndMetadataList from './editTagsAndMetadataList';
import {
  AttributesState, fetchAllAttributes,
  fetchDocumentAttributes,
  setDocumentAttributesLoadingStatusPending
} from "../../../Store/reducers/attributes";
import {useSelector} from 'react-redux';
import {RequestStatus} from "../../../helpers/types/document";
import MetadataList from "./MetadataList";
import AttributesList from "./AttributesList";
import AddAttributeForm from './AddAttributeForm';


export default function EditAttributesModal({
                                              isOpened,
                                              onClose,
                                              siteId,
                                              getValue,
                                              value,
                                              onDocumentDataChange,
                                            }: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  getValue: any;
  value: ILine | null;
  onDocumentDataChange: any;
}) {
  const [allTags, setAlltags] = useState(null);
  const {
    register,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm();
  const doneButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const addTagFormRef = useRef<HTMLFormElement>(null);
  const closeDialog = () => {
    reset();
    onClose();
  };
  useEffect(() => {
    updateTags();
  }, [value]);

  const updateTags = () => {
    if (value) {
      setAlltags(null);
      DocumentsService.getDocumentTags(
        value.documentId as string,
        siteId,
        50
      ).then((data) => {
        setAlltags(data?.tags);
      });
    }
  };

  const {
    documentAttributes,
    documentAttributesNextToken,
    documentAttributesLoadingStatus,
    documentAttributesCurrentSearchPage,
    documentAttributesIsLastSearchPageLoaded
  } = useSelector(AttributesState)

  // load attributes initially
  useEffect(() => {
    if (!value?.documentId || !siteId) {
      return;
    }
    dispatch(fetchDocumentAttributes({siteId, documentId: value?.documentId as string}));
    dispatch(fetchAllAttributes({siteId, page: 1, limit: 50}));
  }, [value]);

  const [metadata, setMetadata] = useState<any>(null)


  useEffect(() => {
    if (value?.documentInstance) {
      const newMetadata = {
        path: value?.documentInstance?.path as string,
        deepLinkPath: value?.documentInstance?.deepLinkPath as string,
        contentType: value?.documentInstance?.contentType as string,
        filesize: value?.documentInstance?.contentLength as number,
      }
      setMetadata(newMetadata)
    }

    if (!value?.documentInstance) {
      DocumentsService.getDocumentById(value?.documentId as string, siteId).then((res) => {
        const newMetadata = {
          path: res?.path as string,
          deepLinkPath: res?.deepLinkPath as string,
          contentType: res?.contentType as string,
          filesize: res?.contentLength as number,

        }
        setMetadata(newMetadata)
      })
    }
  }, [value]);

  const onMetadataEdit = (fieldName: string, val: any,) => {
    if (fieldName === 'deepLinkPath') {
      DocumentsService.patchDocumentDetails(value?.documentId as string, {deepLinkPath: val}, siteId).then((res) => {
        if (res.status !== 200) {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Error updating deep link path',
            })
          );
        }
      });
    }
  }

  // load more documentAttributes when table reaches bottom
  const trackScrolling = useCallback(async () => {
    const isBottom = (el: HTMLElement) => {
      if (el) {
        return el.offsetHeight + el.scrollTop + 10 > el.scrollHeight;
      }
      return false;
    };

    const scrollpane = document.getElementById('documentAttributesScrollPane');

    console.log(isBottom(scrollpane as HTMLElement),
      documentAttributesNextToken,
      documentAttributesLoadingStatus === RequestStatus.fulfilled)
    if (
      isBottom(scrollpane as HTMLElement) &&
      documentAttributesNextToken &&
      documentAttributesLoadingStatus === RequestStatus.fulfilled
    ) {
      dispatch(setDocumentAttributesLoadingStatusPending());
      if (documentAttributesNextToken) {
        await dispatch(
          fetchDocumentAttributes({
            siteId: siteId,
            nextToken: documentAttributesNextToken,
            page: documentAttributesCurrentSearchPage + 1,
            documentId: value?.documentId as string,
            limit: 50
          })
        );
      }
    }
  }, [documentAttributesNextToken, documentAttributesLoadingStatus, documentAttributesIsLastSearchPageLoaded]);

  const handleScroll = (event: any) => {
    console.log('scrolling')
    const el = event.target;
    // Track scroll when table reaches bottom
    if (el.offsetHeight + el.scrollTop + 10 > el.scrollHeight) {
      if (el.scrollTop > 0) {
        trackScrolling();
        console.log('scroll bottom')
      }
    }
  };


  const onTagDelete = (tagKey: string) => {
    const deleteFunc = () => {
      setAlltags(null);
      DocumentsService.deleteDocumentTag(
        value?.documentId as string,
        siteId,
        tagKey
      ).then(() => {
        updateTags();
        setTimeout(() => {
          onDocumentDataChange(value);
        }, 500);
      });
    };
    dispatch(
      openDialog({
        callback: deleteFunc,
        dialogTitle: 'Are you sure you want to delete this tag?',
      })
    );
  };
  // const onAddTagSubmit = async (data: any) => {
  //   if (
  //     data.key.indexOf('/') > -1 ||
  //     (data.value && data.value.indexOf('/') > -1)
  //   ) {
  //     dispatch(
  //       openNotificationDialog({
  //         dialogTitle:
  //           'Neither Tags nor Metadata cannot contain forward slashes.',
  //       })
  //     );
  //     return;
  //   }
  //   DocumentsService.addTag(getValue().documentId, siteId, data).then(
  //     (response) => {
  //       updateTags();
  //       setTimeout(() => {
  //         onDocumentDataChange(value);
  //       }, 500);
  //     }
  //   );
  //   reset();
  // };

  const onAddAttributeSubmit = async (data: any) => {
    if (
      data.key.indexOf('/') > -1 ||
      (data.value && data.value.indexOf('/') > -1)
    ) {
      dispatch(
        openNotificationDialog({
          dialogTitle:
            'Attributes cannot contain forward slashes.',
        })
      );
      return;
    }

    const documentAttributes = {
      "attributes": [
        {
          "key": data.key,
          "stringValue": data.value,
        }
      ]
    }

    const addDocumentAttributes = (documentId: string, attributes: any) => {
      DocumentsService.addDocumentAttributes(siteId, "false", documentId, attributes).then(
        (response) => {
          updateTags();
          setTimeout(() => {
            onDocumentDataChange(value);
          }, 500);
        }
      )
    }


    DocumentsService.getAttribute(siteId, data.key).then(
      (res) => {
        // if attribute exists, add it to document
        if (res.status === 200) {
          addDocumentAttributes(getValue().documentId, documentAttributes)
        } else {
          // create attribute first, then add it to document
          const attributeParameters = {
            "attribute": {
              "key": data.key,
              "dataType": "STRING",
              "type": "STANDARD"
            }
          }
          DocumentsService.addAttribute(siteId, attributeParameters).then(
            (response) => {
              if (response.status === 200) {
                addDocumentAttributes(getValue().documentId, documentAttributes)
              }
            })
        }
      }
    )
    reset();
  };

  const onTagEdit = (tagKey: string, newValue: string) => {
    setAlltags(null);
    DocumentsService.updateDocumentTag(
      value?.documentId as string,
      tagKey,
      newValue,
      siteId
    ).then(() => {
      updateTags();
      setTimeout(() => {
        onDocumentDataChange(value);
      }, 500);
    });
  };


  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={doneButtonRef}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity"/>
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
                    <div className="font-semibold grow text-lg pr-6">
                      <span
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                        Add Attribute
                      </span>
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close/>
                    </div>
                  </div>
                  <AddAttributeForm closeDialog={closeDialog}
                                    onAddAttributeSubmit={onAddAttributeSubmit}
                                    register={register}
                                    handleSubmit={handleSubmit}
                                    addTagFormRef={addTagFormRef}/>
                  {/*<div className="mt-2 flex justify-center items-center w-full">*/}
                  {/*  <form*/}
                  {/*    onSubmit={handleSubmit(onAddAttributeSubmit)}*/}
                  {/*    className="w-full"*/}
                  {/*    ref={addTagFormRef}*/}
                  {/*  >*/}
                  {/*    <div className="flex items-start mx-4 mb-4 relative w-full">*/}
                  {/*      <div className="w-48 mr-2">*/}
                  {/*        <input*/}
                  {/*          aria-label="Tag Key"*/}
                  {/*          type="text"*/}
                  {/*          required*/}
                  {/*          className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600*/}
                  {/*                            text-sm*/}
                  {/*                            placeholder-gray-500 text-gray-900 rounded-t-md*/}
                  {/*                            focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"*/}
                  {/*          placeholder="key"*/}
                  {/*          {...register('key', {*/}
                  {/*            required: true,*/}
                  {/*          })}*/}
                  {/*        />*/}
                  {/*      </div>*/}
                  {/*      <div className="grow">*/}
                  {/*        <input*/}
                  {/*          type="text"*/}
                  {/*          aria-label="Tag Value"*/}
                  {/*          className="appearance-none rounded-md relative block w-full px-2 py-2 border border-gray-600*/}
                  {/*                            text-sm*/}
                  {/*                            placeholder-gray-500 text-gray-900 rounded-t-md*/}
                  {/*                            focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-20"*/}
                  {/*          placeholder="value (optional)"*/}
                  {/*          {...register('value', {*/}
                  {/*            required: false,*/}
                  {/*          })}*/}
                  {/*        />*/}
                  {/*      </div>*/}
                  {/*      <div className="flex w-48 justify-start ml-2">*/}
                  {/*        <input*/}
                  {/*          type="submit"*/}
                  {/*          value="Add"*/}
                  {/*          className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-sm font-semibold py-2 px-8 rounded-2xl flex cursor-pointer focus:outline-none"*/}
                  {/*        />*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*    <div className="flex justify-center w-full">*/}
                  {/*      <div className="text-sm text-gray-400">*/}
                  {/*        You can add multiple values by separating each value*/}
                  {/*        with a comma*/}
                  {/*      </div>*/}
                  {/*    </div>*/}
                  {/*  </form>*/}
                  {/*</div>*/}

                  <div className="flex w-full items-center mt-2">
                    <div
                      className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                      Attributes
                    </div>
                  </div>

                  <div className="flex w-full mt-4">
                    <div className="w-full mt-2 mx-6 border-b">
                      <AttributesList attributes={documentAttributes} handleScroll={handleScroll}/>
                    </div>
                  </div>

                  <div className="flex w-full items-center mt-2">
                    <div
                      className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                      Document Metadata
                    </div>
                  </div>

                  <div className="flex w-full mt-4">
                    <div className="w-full mt-2 mx-6 border-b">
                      <MetadataList
                        metadata={metadata}
                        onEdit={onMetadataEdit}
                      />
                    </div>
                  </div>
                  {allTags && (allTags as any[]).length > 0 && <>
                    <div className="flex w-full items-center mt-2">
                      <div
                        className="font-semibold grow text-lg inline-block text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 pr-6">
                        Edit Tags
                      </div>
                    </div>
                    <div className="flex w-full mt-4">
                      <div className="w-full mt-2 mx-6 border-b">
                        <EditTagsAndMetadataList
                          tags={allTags}
                          onEdit={onTagEdit}
                          onDelete={onTagDelete}
                        />
                      </div>
                    </div>
                  </>}


                  <div className="w-full flex mt-4 justify-center">
                    <button
                      type="button"
                      className="flex items-center bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white text-base font-semibold py-2 px-5 rounded-2xl flex cursor-pointer focus:outline-none"
                      onClick={closeDialog}
                      ref={doneButtonRef}
                    >
                      Done
                    </button>
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
