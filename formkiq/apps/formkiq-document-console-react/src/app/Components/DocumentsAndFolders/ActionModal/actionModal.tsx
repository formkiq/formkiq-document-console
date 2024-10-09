import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useAppDispatch } from '../../../Store/store';
import { ILine } from '../../../helpers/types/line';
import { Close } from '../../Icons/icons';
import { NodeNameSelector } from '../../Workflows/WorkflowStep/NodeComponents/NodeNameSelector';
import { AntivirusContent } from '../../Workflows/WorkflowStep/Steps/Antivirus';
import { DocumentTaggingContent } from '../../Workflows/WorkflowStep/Steps/DocumentTagging';
import { EventBridgeContent } from '../../Workflows/WorkflowStep/Steps/EventBridge';
import { FulltextSearchContent } from '../../Workflows/WorkflowStep/Steps/FulltextSearch';
import { WebhookContent } from '../../Workflows/WorkflowStep/Steps/Webhook';
import { IntelligentDocumentProcessingContent } from '../../Workflows/WorkflowStep/Steps/IntelligentDocumentProcessing';
import { NotificationContent } from '../../Workflows/WorkflowStep/Steps/Notification';
import { OcrContent } from '../../Workflows/WorkflowStep/Steps/Ocr';
import { PublishContent } from '../../Workflows/WorkflowStep/Steps/Publish';
import { QueueContent } from '../../Workflows/WorkflowStep/Steps/Queue';

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

  const [newStep, setNewStep] = useState<any>(null);

  const onChange = (value: any, key: any) => {
    setNewStep((prev: any) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value,
      },
    }));
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full lg:w-4/5">
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
                  <NodeNameSelector newStep={newStep} setNewStep={setNewStep} />
                  {newStep?.name === 'ANTIVIRUS' && (
                    <AntivirusContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newStep?.name === 'DOCUMENTTAGGING' && (
                    <DocumentTaggingContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newStep?.name === 'EVENTBRIDGE' && (
                    <EventBridgeContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}
                  {newStep?.name === 'FULLTEXT' && (
                    <FulltextSearchContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newStep?.name === 'IDP' && (
                    <IntelligentDocumentProcessingContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newStep?.name === 'NOTIFICATION' && (
                    <NotificationContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newStep?.name === 'OCR' && (
                    <OcrContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newStep?.name === 'PUBLISH' && (
                    <PublishContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                    />
                  )}

                  {newStep?.name === 'QUEUE' && (
                    <QueueContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
                      siteId={siteId}
                      setNewStep={setNewStep}
                    />
                  )}

                  {newStep?.name === 'WEBHOOK' && (
                    <WebhookContent
                      newStep={newStep}
                      isEditing={true}
                      data={null}
                      onChange={onChange}
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
