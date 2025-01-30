import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { openDialog as openConfirmationDialog } from '../../../Store/reducers/globalConfirmControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { Close, Pencil, Trash } from '../../Icons/icons';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import { fetchDocumentAttributes } from '../../../Store/reducers/attributes';
import { useSelector } from 'react-redux';
import { CopyButton } from '../../Generic/Buttons/CopyButton';
import {
  fetchClassifications,
  SchemasState,
} from '../../../Store/reducers/schemas';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';

interface Classification {
  classificationId: string;
  name: string;
  userId: string;
  insertedDate: string;
}

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
  const dispatch = useAppDispatch();
  const { classifications } = useSelector(SchemasState);

  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const [classificationId, setClassificationId] = useState('');
  const [documentClassifications, setDocumentClassifications] = useState<any[]>(
    []
  );
  const [editingClassificationId, setEditingClassificationId] = useState<
    string | null
  >(null);
  const [infoDocumentId, setInfoDocumentId] = useState('');
  const [classificationsMap, setClassificationsMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const documentId = hash.substring(4);
      setInfoDocumentId(documentId);
    }
  }, [isOpened]);

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
        const classifications = [];
        if (response.attribute.stringValue) {
          classifications.push({
            classificationId: response.attribute.stringValue,
          });
        } else if (response.attribute.stringValues) {
          classifications.push(
            ...response.attribute.stringValues.map((id: string) => ({
              classificationId: id,
            }))
          );
        }
        setDocumentClassifications(classifications);
        for (const classification of classifications) {
          if (classificationsMap[classification.classificationId]) return;
          const classificationName = getClassificationNameFromClassifications(
            classification.classificationId
          );
          if (classificationName) {
            setClassificationsMap((prev) => ({
              ...prev,
              [classification.classificationId]: classificationName,
            }));
            return;
          }
          DocumentsService.getClassification(
            siteId,
            classification.classificationId
          ).then((response) => {
            if (response.status === 200) {
              setClassificationsMap((prev) => ({
                ...prev,
                [classification.classificationId]: response.classification.name,
              }));
            } else {
              setClassificationsMap((prev) => ({
                ...prev,
                [classification.classificationId]: 'NOT_FOUND',
              }));
            }
          });
        }
      } else {
        setDocumentClassifications([]);
      }
    });
  };
  useEffect(() => {
    if (!value) return;
    dispatch(fetchClassifications({ siteId, page: 1, limit: 20 }));
  }, [siteId, value]);

  useEffect(() => {
    getDocumentClassifications();
  }, [value, siteId]);

  const closeDialog = () => {
    setClassificationId('');
    setEditingClassificationId(null);
    setDocumentClassifications([]);
    onClose();
  };

  async function addClassification() {
    if (!value?.documentId) return;
    if (
      documentClassifications.some(
        (el) => el.classificationId === classificationId
      )
    ) {
      const classificationName = classifications.find(
        (classification) => classification.classificationId === classificationId
      )?.name;
      if (classificationName) {
        dispatch(
          openDialog({
            dialogTitle:
              'Classification "' +
              classificationName +
              '" is already set for this document',
          })
        );
      }
      return;
    }
    if (documentClassifications.length === 0) {
      const response = await DocumentsService.addDocumentAttributes(
        siteId,
        'false',
        value.documentId,
        { attributes: [{ classificationId }] }
      );

      if (response.status === 201) {
        await getDocumentClassifications();
        if (value.documentId === infoDocumentId) {
          dispatch(
            fetchDocumentAttributes({
              siteId,
              documentId: value.documentId,
              limit: 100,
              page: 1,
              nextToken: null,
            })
          );
        }
        setClassificationId('');
      } else {
        dispatch(
          openDialog({
            dialogTitle:
              response?.errors[0].error || 'Error adding classification',
          })
        );
      }
    } else {
      const newClassifications = [
        ...documentClassifications,
        { classificationId },
      ];
      const success = await onSave(newClassifications);
      if (success) {
        setClassificationId('');
      }
    }
  }

  async function onSave(classifications: Classification[]) {
    if (!value?.documentId) return;
    try {
      if (classifications.length === 0) {
        const response = await DocumentsService.deleteDocumentAttribute(
          siteId,
          value.documentId,
          'Classification'
        );
        if (response.status !== 200) {
          dispatch(
            openDialog({ dialogTitle: 'Error deleting classifications' })
          );
          return false;
        }
      } else {
        const attribute: any = {};
        if (classifications.length === 1) {
          attribute['stringValue'] = classifications[0].classificationId;
        } else {
          attribute['stringValues'] = classifications.map(
            (c) => c.classificationId
          );
        }
        const response = await DocumentsService.setDocumentAttributeValue(
          siteId,
          value.documentId,
          'Classification',
          {
            attribute,
          }
        );
        if (response.status !== 200) {
          dispatch(
            openDialog({
              dialogTitle: response?.errors[0].error || 'Error saving changes',
            })
          );
          return false;
        }
      }

      await getDocumentClassifications();
      if (value.documentId === infoDocumentId) {
        dispatch(
          fetchDocumentAttributes({
            siteId,
            documentId: value.documentId,
            limit: 100,
            page: 1,
            nextToken: null,
          })
        );
      }
      return true;
    } catch (error) {
      dispatch(openDialog({ dialogTitle: 'Error saving changes' }));
      return false;
    }
  }

  function deleteClassification(index: number) {
    const onDelete = async () => {
      const newClassifications = [...documentClassifications];
      newClassifications.splice(index, 1);
      const success = await onSave(newClassifications);
      if (!success) {
        getDocumentClassifications();
      }
    };
    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this classification?',
        callback: onDelete,
      })
    );
  }

  function handleEditClassification(index: number) {
    const classification = documentClassifications[index];
    setEditingClassificationId(classification.classificationId);

    const newClassifications = documentClassifications.map((cls, i) => ({
      ...cls,
      isEdit: i === index,
    }));
    setDocumentClassifications(newClassifications);
  }

  async function saveEditedClassification(index: number) {
    if (!editingClassificationId) return;

    const newClassifications = [...documentClassifications];
    newClassifications[index] = {
      ...newClassifications[index],
      classificationId: editingClassificationId,
      isEdit: false,
    };

    const success = await onSave(newClassifications);
    if (success) {
      setEditingClassificationId(null);
      setClassificationId('');
    } else {
      getDocumentClassifications();
    }
  }

  function resetClassifications() {
    getDocumentClassifications();
    setEditingClassificationId(null);
    setClassificationId('');
  }

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={approveButtonRef}
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
              <Dialog.Panel className="relative transform text-left transition-all w-full lg:w-4/5 max-w-3xl">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                      Document Classifications
                    </div>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={closeDialog}
                    >
                      <Close />
                    </div>
                  </div>

                  <div className="flex gap-2 my-4 px-4 flex-col xl:w-1/2">
                    <div className="flex gap-2 w-full h-8">
                      <RadioListbox
                        values={classifications.map(
                          (classification) => classification.classificationId
                        )}
                        titles={classifications.map(
                          (classification) => classification.name
                        )}
                        selectedValue={classificationId}
                        setSelectedValue={setClassificationId}
                        placeholderText="Select Classification"
                      />
                      <ButtonPrimaryGradient onClick={addClassification}>
                        +ADD
                      </ButtonPrimaryGradient>
                    </div>
                  </div>

                  {documentClassifications.length > 0 ? (
                    <div className="overflow-y-auto overflow-x-visible max-h-64 h-64 px-4 my-4">
                      <table className="max-w-full overflow-visible table-fixed border border-neutral-300 border-collapse table-auto w-full max-w-full text-sm">
                        <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100 z-20">
                          <tr>
                            <th className="w-1/2 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                              Classification ID
                            </th>
                            <th className="w-52 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-end">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white nodark:bg-slate-800 overflow-visible">
                          {documentClassifications.map(
                            (classification, index) => (
                              <tr
                                key={index}
                                className="border-t border-neutral-300 overflow-visible"
                              >
                                <td className="p-4 text-start">
                                  {classification.isEdit &&
                                  editingClassificationId ? (
                                    <div className="h-8">
                                      <RadioListbox
                                        values={classifications.map(
                                          (classification) =>
                                            classification.classificationId
                                        )}
                                        titles={classifications.map(
                                          (classification) =>
                                            classification.name
                                        )}
                                        selectedValue={editingClassificationId}
                                        setSelectedValue={
                                          setEditingClassificationId
                                        }
                                        placeholderText="Select Classification"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-2">
                                      {classificationsMap[
                                        classification.classificationId
                                      ] &&
                                        classificationsMap[
                                          classification.classificationId
                                        ] !== 'NOT_FOUND' && (
                                          <p
                                            className="break-words font-normal truncate"
                                            title={
                                              classificationsMap[
                                                classification.classificationId
                                              ]
                                            }
                                          >
                                            {
                                              classificationsMap[
                                                classification.classificationId
                                              ]
                                            }
                                          </p>
                                        )}
                                      <p className="text-xs font-bold">
                                        ID:{' '}
                                        <span className="text-neutral-500">
                                          {classification.classificationId}
                                        </span>{' '}
                                        <div className="inline-block relative">
                                          <CopyButton
                                            value={
                                              classification.classificationId
                                            }
                                          />
                                        </div>
                                      </p>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-end w-52">
                                  {classification.isEdit ? (
                                    <>
                                      <ButtonPrimaryGradient
                                        onClick={() =>
                                          saveEditedClassification(index)
                                        }
                                      >
                                        Save
                                      </ButtonPrimaryGradient>
                                      <ButtonGhost
                                        className="ml-2"
                                        onClick={resetClassifications}
                                      >
                                        Cancel
                                      </ButtonGhost>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="w-4 h-4 hover:text-primary-500 mr-2"
                                        type="button"
                                        onClick={() =>
                                          handleEditClassification(index)
                                        }
                                      >
                                        <Pencil />
                                      </button>
                                      <button
                                        className="w-4 h-4 hover:text-primary-500 mr-2"
                                        type="button"
                                        onClick={() =>
                                          deleteClassification(index)
                                        }
                                      >
                                        <Trash />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center mt-4 px-4">
                      <div role="status">
                        <div className="overflow-x-auto relative h-64">
                          No document classifications found
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="w-full flex justify-end h-8 gap-2">
                    <ButtonGhost type="button" onClick={closeDialog}>
                      CLOSE
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
