import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { Close } from '../../Icons/icons';
import AttributesTab from './AttributesTab';
import MetadataTab from './MetadataTab';
import TagsTab from './TagsTab';
import {useAppDispatch} from "../../../Store/store";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";

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
  const dispatch = useAppDispatch()
  const [allTags, setAlltags] = useState(null);
  const [selectedTab, setSelectedTab] = useState<
    'attributes' | 'metadata' | 'tags'
  >('attributes');

  const doneButtonRef = useRef(null);
  const closeDialog = () => {
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
        100
      ).then((data) => {
        setAlltags(data?.tags);
        if (data?.tags && data?.tags?.length === 0 && selectedTab === 'tags') {
          setSelectedTab('metadata');
        }
      });
    }
  };

  const onTagEdit = (tagKey: string, newValue: string | string[]) => {
    setAlltags(null);
    DocumentsService.updateDocumentTag(
      value?.documentId as string,
      tagKey,
      newValue,
      siteId
    ).then((res) => {
      if(res.status!==200){
        dispatch(openNotificationDialog({
          dialogTitle: res.errors[0].error
        }))
      }
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-1/2">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="w-full flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-bold mb-4 mx-2">
                      Document Attributes and Metadata
                    </Dialog.Title>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>

                  <div className="flex flex-row justify-start gap-2 text-sm font-bold">
                    <button
                      type="button"
                      className="h-8 px-4"
                      style={{
                        borderBottom:
                          selectedTab === 'attributes'
                            ? '1px solid #171C26'
                            : '1px solid transparent',
                        color:
                          selectedTab === 'attributes' ? '#171C26' : '#68758D',
                      }}
                      onClick={() => setSelectedTab('attributes')}
                    >
                      ATTRIBUTES
                    </button>
                    <button
                      type="button"
                      className="h-8 px-4"
                      style={{
                        borderBottom:
                          selectedTab === 'metadata'
                            ? '1px solid #171C26'
                            : '1px solid transparent',
                        color:
                          selectedTab === 'metadata' ? '#171C26' : '#68758D',
                      }}
                      onClick={() => setSelectedTab('metadata')}
                    >
                      METADATA
                    </button>
                    {allTags && (allTags as any[]).length > 0 && (
                      <button
                        type="button"
                        className="h-8 px-4"
                        style={{
                          borderBottom:
                            selectedTab === 'tags'
                              ? '1px solid #171C26'
                              : '1px solid transparent',
                          color: selectedTab === 'tags' ? '#171C26' : '#68758D',
                        }}
                        onClick={() => setSelectedTab('tags')}
                      >
                        TAGS
                        <span className="text-xs pl-2">(Legacy)</span>
                      </button>
                    )}
                  </div>

                  {selectedTab === 'attributes' && (
                    <AttributesTab
                      onDocumentDataChange={onDocumentDataChange}
                      siteId={siteId}
                      value={value}
                      getValue={getValue}
                    />
                  )}

                  {selectedTab === 'metadata' && (
                    <MetadataTab
                      siteId={siteId}
                      value={value}
                      onDocumentDataChange={onDocumentDataChange}
                    />
                  )}

                  {allTags &&
                    (allTags as any[]).length > 0 &&
                    selectedTab === 'tags' && (
                      <TagsTab
                        onDocumentDataChange={onDocumentDataChange}
                        siteId={siteId}
                        value={value}
                        getValue={getValue}
                        allTags={allTags}
                        setSelectedTab={setSelectedTab}
                        onTagEdit={onTagEdit}
                        setAlltags={setAlltags}
                        updateTags={updateTags}
                      />
                    )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
