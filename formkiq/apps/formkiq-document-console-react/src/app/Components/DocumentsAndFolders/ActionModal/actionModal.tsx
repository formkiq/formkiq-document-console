import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../Store/store';
import { ILine } from '../../../helpers/types/line';
import { Close } from '../../Icons/icons';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { AntivirusContent } from '../../Workflows/WorkflowStep/Steps/Antivirus';
import { DocumentTaggingContent } from '../../Workflows/WorkflowStep/Steps/DocumentTagging';
import { EventBridgeContent } from '../../Workflows/WorkflowStep/Steps/EventBridge';
import { FulltextSearchContent } from '../../Workflows/WorkflowStep/Steps/FulltextSearch';
import { WebhookContent } from '../../Workflows/WorkflowStep/Steps/Webhook';
import { IntelligentDocumentProcessingContent } from '../../Workflows/WorkflowStep/Steps/IntelligentDocumentProcessing';
import { NotificationContent } from '../../Workflows/WorkflowStep/Steps/Notification';
import { OcrContent } from '../../Workflows/WorkflowStep/Steps/Ocr';
import { PublishContent } from '../../Workflows/WorkflowStep/Steps/Publish';
import { DocumentsService } from '../../../helpers/services/documentsService';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import { ActionSelector } from './ActionSelector';

export default function ActionModal({
  isOpened,
  onClose,
  siteId,
  value,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  value: ILine | null;
}) {
  const dispatch = useAppDispatch();
  const closeDialog = () => {
    onClose();
  };

  const [newAction, setNewAction] = useState<any>(null);

  const onChange = (value: any, key: any) => {
    setNewAction((prev: any) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value,
      },
    }));
  };

  const onAddAction = () => {
    if (!newAction) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select a step',
        })
      );
    }
    DocumentsService.postDocumentActions(
      value!.documentId,
      [newAction],
      siteId
    ).then((res) => {
      if (res.status === 200) {
        setNewAction(null);
        onClose();
      } else {
        if (res?.errors) {
          const errors = res.errors.map((error: any) => error.error).join('\n');
          dispatch(openNotificationDialog({ dialogTitle: errors }));
        } else {
          dispatch(
            openNotificationDialog({ dialogTitle: 'Error saving workflow' })
          );
        }
      }
    });
  };

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full max-w-lg">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="w-full flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-bold mb-4 mx-2">
                      Document Action
                    </Dialog.Title>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>
                  <ActionSelector
                    newAction={newAction}
                    setNewAction={setNewAction}
                  />
                  {newAction?.type === 'ANTIVIRUS' && (
                    <AntivirusContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newAction?.type === 'DOCUMENTTAGGING' && (
                    <DocumentTaggingContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newAction?.type === 'EVENTBRIDGE' && (
                    <EventBridgeContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newAction?.type === 'FULLTEXT' && (
                    <FulltextSearchContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newAction?.type === 'IDP' && (
                    <IntelligentDocumentProcessingContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newAction?.type === 'NOTIFICATION' && (
                    <NotificationContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newAction?.type === 'OCR' && (
                    <OcrContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newAction?.type === 'PUBLISH' && (
                    <PublishContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newAction?.type === 'WEBHOOK' && (
                    <WebhookContent
                      newStep={newAction}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  <div className="w-full flex justify-end mt-4 h-10 gap-2">
                    <ButtonGhost
                      onClick={() => {
                        setNewAction(null);
                        onClose();
                      }}
                    >
                      CANCEL
                    </ButtonGhost>
                    <ButtonPrimaryGradient onClick={onAddAction}>
                      ADD
                    </ButtonPrimaryGradient>
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
