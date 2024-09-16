import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { openDialog } from '../../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import { ILine } from '../../../helpers/types/line';
import { Close, Pencil, Trash } from '../../Icons/icons';
import ButtonPrimaryGradient from '../../Generic/Buttons/ButtonPrimaryGradient';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import {
  transformRelationshipValueFromString,
  transformRelationshipValueToString,
} from '../../../helpers/services/toolService';
import { fetchDocumentAttributes } from '../../../Store/reducers/attributes';
import { RelationshipType } from '../../../helpers/types/attributes';

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'PRIMARY',
  'ATTACHMENT',
  'APPENDIX',
  'SUPPLEMENT',
  'ASSOCIATED',
  'RENDITION',
];

export default function DocumentRelationshipsModal({
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
  const approveButtonRef = useRef<HTMLButtonElement>(null);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(
    RELATIONSHIP_TYPES[0]
  );
  const [inverseRelationshipType, setInverseRelationshipType] = useState<
    RelationshipType | ''
  >('');
  const [documentId, setDocumentId] = useState('');
  const [documentRelationships, setDocumentRelationships] = useState<any[]>([]);
  const [isDocumentRelationshipsExist, setIsDocumentRelationshipsExist] =
    useState(false);
  const [editingRelationshipValue, setEditingRelationshipValue] = useState<{
    relationship: RelationshipType;
    documentId: string;
    inverseRelationship?: RelationshipType | '';
  } | null>(null);

  const getDocumentRelationships = () => {
    if (!value?.documentId) return;
    DocumentsService.getDocumentAttribute(
      siteId,
      value?.documentId,
      'Relationships'
    ).then((response) => {
      if (response.status === 200) {
        const relationships = [];
        if (response.attribute.stringValue) {
          relationships.push(
            transformRelationshipValueFromString(response.attribute.stringValue)
          );
        } else if (response.attribute.stringValues) {
          relationships.push(
            ...response.attribute.stringValues.map((el: string) =>
              transformRelationshipValueFromString(el)
            )
          );
        }
        setDocumentRelationships(relationships);
        setIsDocumentRelationshipsExist(true);
      } else {
        setIsDocumentRelationshipsExist(false);
      }
    });
  };

  useEffect(() => {
    getDocumentRelationships();
  }, [value, siteId]);

  const closeDialog = () => {
    // Reset the state
    setDocumentId('');
    setRelationshipType(RELATIONSHIP_TYPES[0]);
    setEditingRelationshipValue(null);
    setIsDocumentRelationshipsExist(false);
    setDocumentRelationships([]);
    // Close the dialog
    onClose();
  };

  function relationshipExistsExcludingIndex(
    documentId: string,
    relationshipType: RelationshipType,
    excludeIndex: number
  ) {
    return documentRelationships.some(
      (el, index) =>
        index !== excludeIndex &&
        el.documentId === documentId &&
        el.relationship === relationshipType
    );
  }

  async function validateRelationship(
    documentId: string,
    relationshipType: RelationshipType,
    currentIndex = -1
  ) {
    if (!documentId) {
      throw new Error('Please enter a document ID');
    }

    if (documentId === value?.documentId) {
      throw new Error('You cannot add a relationship to the same document');
    }

    if (
      relationshipExistsExcludingIndex(
        documentId,
        relationshipType,
        currentIndex
      )
    ) {
      throw new Error('This relationship already exists');
    }

    // Check if document exists
    const response = await DocumentsService.getDocumentById(documentId, siteId);
    if (response.status !== 200) {
      throw new Error('Document not found. Please enter a valid document ID');
    }
  }

  async function addRelationship() {
    if (!value?.documentId) return;
    try {
      await validateRelationship(documentId, relationshipType);
      const newRelationship: any = {
        documentId,
        relationship: relationshipType,
      };
      if (inverseRelationshipType.length > 0) {
        newRelationship['inverseRelationship'] = inverseRelationshipType;
      }
      DocumentsService.addDocumentAttributes(
        siteId,
        'false',
        value.documentId,
        { attributes: [newRelationship] }
      ).then(() => {
        getDocumentRelationships()
        dispatch(
          fetchDocumentAttributes({
            siteId,
            documentId: value.documentId,
            limit: 100,
            page: 1,
            nextToken: null,
          })
        );
      });
    } catch (error: any) {
      dispatch(openDialog({ dialogTitle: error.message }));
    }
  }

  async function onSave(relationships: any[]) {
    if (!value?.documentId) return;
    if (relationships.length === 0) {
      await DocumentsService.deleteDocumentAttribute(
        siteId,
        value.documentId,
        'Relationships'
      );
    } else {
      await DocumentsService.setDocumentAttributeValue(
        siteId,
        value.documentId,
        'Relationships',
        {
          attribute: {
            stringValues: relationships.map((rel) =>
              transformRelationshipValueToString(rel)
            ),
          },
        }
      );
    }
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

  function deleteRelationship(index: number) {
    const newRelationships = [...documentRelationships];
    newRelationships.splice(index, 1);
    setDocumentRelationships(newRelationships);
    onSave(newRelationships);
  }

  function handleEditRelationship(index: number) {
    const newRelationships = [...documentRelationships];
    newRelationships.map((el, i) => {
      el.isEdit = i === index;
    });
    setDocumentRelationships(newRelationships);
    setEditingRelationshipValue({
      relationship: newRelationships[index].relationship,
      documentId: newRelationships[index].documentId,
    });
  }

  async function saveEditedRelationship(index: number) {
    if (!editingRelationshipValue) return;
    try {
      const { documentId, relationship } = editingRelationshipValue;
      await validateRelationship(documentId, relationship, index);

      // Save the edited relationship
      setDocumentRelationships((prevRelationships) => {
        const newRelationships = [...prevRelationships];
        newRelationships[index] = editingRelationshipValue;
        onSave(newRelationships);
        return newRelationships;
      });
    } catch (error: any) {
      dispatch(openDialog({ dialogTitle: error.message }));
    }
  }

  function resetRelationship(index: number) {
    const newRelationships = [...documentRelationships];
    newRelationships[index].isEdit = false;
    setDocumentRelationships(newRelationships);
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
              <Dialog.Panel className="relative transform text-left transition-all w-full lg:w-4/5">
                <div className="bg-white p-4 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="flex w-full items-center">
                    <div className="font-semibold grow text-lg text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 inline-block pr-6">
                      Document Relationships
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

                  <div className="flex gap-2 my-4 px-4 flex-col xl:w-1/2 ">
                    <div className="flex gap-2 ">
                      <div className="w-1/2 ">
                        <h3 className="text-sm font-semibold text-gray-500">
                          Relationship
                        </h3>
                        <div className=" h-8">
                          <RadioListbox
                            values={RELATIONSHIP_TYPES}
                            titles={RELATIONSHIP_TYPES}
                            selectedValue={relationshipType}
                            setSelectedValue={setRelationshipType}
                          />
                        </div>
                      </div>
                      <div className="w-1/2">
                        <h3 className="text-sm font-semibold text-gray-500">
                          Inverse Relationship{' '}
                          <span className="text-xs text-gray-400">
                            (optional)
                          </span>
                        </h3>
                        <div className=" h-8">
                          <RadioListbox
                            values={[...RELATIONSHIP_TYPES, '']}
                            titles={[...RELATIONSHIP_TYPES, 'None']}
                            selectedValue={inverseRelationshipType}
                            setSelectedValue={setInverseRelationshipType}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full h-8">
                      <input
                        type="text"
                        className="w-full h-8 px-2 border border-gray-300 rounded-md"
                        placeholder="Document ID"
                        value={documentId}
                        onChange={(e) => setDocumentId(e.target.value)}
                      />
                      <ButtonPrimaryGradient onClick={addRelationship}>
                        +ADD
                      </ButtonPrimaryGradient>
                    </div>
                  </div>

                  {documentRelationships.length > 0 ? (
                    <div className="overflow-y-auto overflow-x-visible max-h-64 h-64 px-4 my-4">
                      <table
                        className="max-w-full overflow-visible table-fixed border border-neutral-300 border-collapse table-auto w-full max-w-full text-sm"
                        id="documentAttributesScrollPane"
                      >
                        <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100 z-20">
                          <tr>
                            <th className="w-40 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                              Relationship
                            </th>
                            <th className="max-w-2/3 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                              Document
                            </th>
                            <th className="w-52 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-end">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white nodark:bg-slate-800 overflow-visible">
                          {documentRelationships.map((relationship, index) => (
                            <tr
                              key={index}
                              className="border-t border-neutral-300 overflow-visible"
                            >
                              <td
                                className="p-4 text-start truncate w-40 "
                                style={{ overflow: 'visible' }}
                              >
                                {relationship.isEdit &&
                                editingRelationshipValue ? (
                                  <div className="w-full h-8 overflow-visible">
                                    <RadioListbox
                                      values={RELATIONSHIP_TYPES}
                                      titles={RELATIONSHIP_TYPES}
                                      selectedValue={
                                        editingRelationshipValue.relationship
                                      }
                                      setSelectedValue={(val) =>
                                        setEditingRelationshipValue({
                                          ...editingRelationshipValue,
                                          relationship: val,
                                        })
                                      }
                                    />
                                  </div>
                                ) : (
                                  relationship.relationship
                                )}
                              </td>
                              <td className="p-4 text-start max-w-2/3">
                                {relationship.isEdit &&
                                editingRelationshipValue ? (
                                  <input
                                    type="text"
                                    className="w-full h-8 px-2 border border-gray-300 rounded-md"
                                    placeholder="Document ID"
                                    value={editingRelationshipValue.documentId}
                                    onChange={(e) =>
                                      setEditingRelationshipValue({
                                        ...editingRelationshipValue,
                                        documentId: e.target.value.trim(),
                                      })
                                    }
                                  />
                                ) : (
                                  relationship.documentId
                                )}
                              </td>
                              <td className="p-4 text-end w-52">
                                {relationship.isEdit ? (
                                  <>
                                    <ButtonPrimaryGradient
                                      onClick={() =>
                                        saveEditedRelationship(index)
                                      }
                                    >
                                      Save
                                    </ButtonPrimaryGradient>
                                    <ButtonGhost
                                      className="ml-2"
                                      onClick={() => resetRelationship(index)}
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
                                        handleEditRelationship(index)
                                      }
                                    >
                                      <Pencil />
                                    </button>
                                    <button
                                      className="w-4 h-4 hover:text-primary-500 mr-2"
                                      type="button"
                                      onClick={() => deleteRelationship(index)}
                                    >
                                      <Trash />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center mt-4 px-4">
                      <div role="status">
                        <div className="overflow-x-auto relative h-64">
                          No document attributes found
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
