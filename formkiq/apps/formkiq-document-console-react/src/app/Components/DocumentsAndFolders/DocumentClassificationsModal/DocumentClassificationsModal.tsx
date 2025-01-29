import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { openDialog as openConfirmationDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { ILine } from '../../../helpers/types/line';
import { Close, Pencil, Trash } from '../../Icons/icons';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { transformRelationshipValueFromString } from '../../../helpers/services/toolService';
import {
  fetchClassifications,
  SchemasState,
} from '../../../Store/reducers/schemas';
import { useSelector } from 'react-redux';
import { CopyButton } from '../../Generic/Buttons/CopyButton';

export default function DocumentClassificationsModal({
  isOpened,
  onClose,
  siteId,
  value,
  onDocumentDataChange,
}: {
  isOpened: boolean;
  onClose: () => void;
  siteId: string;
  value: ILine | null;
  onDocumentDataChange: any;
}) {
  const approveButtonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useAppDispatch();
  const { classifications } = useSelector(SchemasState);

  const [documentClassifications, setDocumentClassifications] = useState<any[]>(
    []
  );
  const [classificationsMap, setClassificationsMap] = useState<{
    [key: string]: string;
  }>({});
  const [selectedClassification, setSelectedClassification] =
    useState<string>('');
  // update schemas when different siteId selected
  useEffect(() => {
    if (!value) return;
    dispatch(fetchClassifications({ siteId, page: 1, limit: 20 }));
  }, [value]);

  useEffect(() => {
    console.log('classifications', classifications);
  }, [classifications]);

  const closeDialog = (e: any) => {
    console.log('closeDialog', e);
    setDocumentClassifications([]);
    onClose();
  };

  const getClassificationNameFromClassifications = (
    classificationId: string
  ) => {
    const classification = classifications.find(
      (classification) => classification.classificationId === classificationId
    );
    return classification?.name;
  };

  const getDocumentClassifications = () => {
    if (!value?.documentId) return;
    DocumentsService.getDocumentAttribute(
      siteId,
      value?.documentId,
      'Classification'
    ).then((response) => {
      if (response.status === 200) {
        let classificationIds = [];
        if (response.attribute.stringValue) {
          classificationIds = [response.attribute.stringValue];
        } else if (response.attribute.stringValues) {
          classificationIds = response.attribute.stringValues;
        }
        setDocumentClassifications(classificationIds);

        for (const classificationId of classificationIds) {
          if (classificationsMap[classificationId]) return;
          const classificationName =
            getClassificationNameFromClassifications(classificationId);
          if (classificationName) {
            setClassificationsMap((prev) => ({
              ...prev,
              [classificationId]: classificationName,
            }));
            return;
          }
          DocumentsService.getClassification(siteId, classificationId).then(
            (response) => {
              if (response.status === 200) {
                setClassificationsMap((prev) => ({
                  ...prev,
                  [classificationId]: response.classification.name,
                }));
              } else {
                setClassificationsMap((prev) => ({
                  ...prev,
                  [classificationId]: 'NOT_FOUND',
                }));
              }
            }
          );
        }
      } else {
        setDocumentClassifications([]);
      }
    });
  };

  function selectClassification(e: any) {
    setSelectedClassification(e.target.value);
  }

  useEffect(() => {
    getDocumentClassifications();
  }, [value]);

  function onDeleteClick() {
    function deleteClassificationAttribute() {
      if (!value?.documentId) return;
      DocumentsService.deleteDocumentAttribute(
        siteId,
        value.documentId,
        'Classification'
      ).then((response) => {
        if (response.status === 200) {
          // Update the local state immediately
          setDocumentClassifications([]);
          setClassificationsMap({});

          // Trigger parent updates
          onDocumentDataChange();

          // Optionally refresh the classifications
          getDocumentClassifications();
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Failed to remove classification',
            })
          );
        }
      });
    }

    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to remove this classification?',
        callback: deleteClassificationAttribute,
      })
    );
  }

  function saveChanges() {
    if (!value?.documentId) return;
    if (documentClassifications.length === 0) {
      DocumentsService.addDocumentAttributes(
        siteId,
        'false',
        value?.documentId,
        {
          attributes: [{ classificationId: selectedClassification }],
        }
      ).then((response) => {
        if (response.status === 201) {
          getDocumentClassifications();
          onDocumentDataChange();
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Failed to add classification',
            })
          );
        }
      });
    } else {
      DocumentsService.setDocumentAttributes(siteId, value?.documentId, {
        attributes: [{ classificationId: selectedClassification }],
      }).then((response) => {
        if (response.status === 201) {
          getDocumentClassifications();
          onDocumentDataChange();
        } else {
          dispatch(
            openNotificationDialog({
              dialogTitle: 'Failed to update classification',
            })
          );
        }
      });
    }
  }

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={closeDialog}
        initialFocus={approveButtonRef}
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
              <Dialog.Panel className="relative transform text-left transition-all w-full lg:w-4/5">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                      Document Classifications
                      <span className="block"></span>
                    </div>
                    <div className="w-100"></div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>

                  {/*Select a classification and add*/}

                  <div className="w-full mt-4">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-500">
                        Add Classification
                      </div>
                      <select
                        className="w-1/2 p-2 border border-gray-300 rounded-lg"
                        onChange={selectClassification}
                      >
                        <option value="">Select Classification</option>
                        {classifications.map((classification) => (
                          <option
                            key={classification.classificationId}
                            value={classification.classificationId}
                          >
                            {classification.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {documentClassifications.length > 0 && value?.documentId ? (
                    <div className="w-full mt-4">
                      {documentClassifications.map(
                        (classificationId, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
                          >
                            <div>
                              <h3 className="font-semibold text-neutral-700">
                                {classificationsMap[classificationId] ||
                                  'Loading...'}
                              </h3>
                              <p className="text-neutral-500 text-xs">
                                {classificationId}
                                <span className="pl-2">
                                  <CopyButton value={classificationId} />
                                </span>
                              </p>
                            </div>
                            <button
                              title="Delete Classification"
                              className="w-5 h-5 text-gray-500 cursor-pointer hover:text-red-500 transition duration-100"
                              onClick={onDeleteClick}
                            >
                              <Trash />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="w-full mt-4 text-center text-gray-400">
                      No classifications assigned
                    </div>
                  )}

                  <div className="w-full flex justify-end h-8 gap-2">
                    <ButtonPrimaryGradient onClick={saveChanges} type="button">
                      SAVE CHANGES
                    </ButtonPrimaryGradient>

                    <ButtonGhost type="button" onClick={closeDialog}>
                      CANCEL
                    </ButtonGhost>
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
