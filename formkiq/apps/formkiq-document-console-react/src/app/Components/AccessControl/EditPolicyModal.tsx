import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { useAppDispatch } from '../../Store/store';
import { DocumentsService } from '../../helpers/services/documentsService';
import { Attribute, OpaAttributeType } from '../../helpers/types/attributes';
import AddAttributeForm from '../DocumentsAndFolders/EditAttributesModal/AddAttributeForm';
import ButtonGhost from '../Generic/Buttons/ButtonGhost';
import ButtonPrimaryGradient from '../Generic/Buttons/ButtonPrimaryGradient';
import ButtonTertiary from '../Generic/Buttons/ButtonTertiary';
import RadioListbox from '../Generic/Listboxes/RadioListbox';
import { CheckedRadio, Close, UncheckedRadio } from '../Icons/icons';
import GroupsSelect from './GroupsSelect';
import {AttributesDataState, setAllAttributesData} from "../../Store/reducers/attributesData";
import RadioCombobox from "../Generic/Listboxes/RadioCombobox";

export default function EditPolicyModal({
  isOpened,
  onClose,
  siteId,
  policyItems,
  index,
}: {
  isOpened: boolean;
  onClose: any;
  siteId: string;
  policyItems: any[];
  index: number;
}) {
  const numberAttributeCriteria = [
    { key: 'eq', title: 'Equal' },
    { key: 'neq', title: 'Not Equal' },
    { key: 'gt', title: 'Greater Than' },
    { key: 'gte', title: 'Greater Than or Equal' },
    { key: 'lt', title: 'Less Than' },
    { key: 'lte', title: 'Less Than or Equal' },
  ];

  const stringAttributeCriteria = [
    { key: 'eq', title: 'Equal' },
    { key: 'neq', title: 'Not Equal' },
  ];

  const policyItemsTypes = ['ALLOW'];
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>('ALLOW');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTypeOfRoles, setSelectedTypeOfRoles] =
    useState<string>('anyRoles');
  // const { allAttributes } = useSelector(DataCacheState);
  const {allAttributes} = useSelector(AttributesDataState);
  const [attributeKeys, setAttributeKeys] = useState<{ key: string; title: string }[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>('');
  const [isAddAttributeFormOpen, setIsAddAttributeFormOpen] =
    useState<boolean>(false);
  const [attributeCriteria, setAttributeCriteria] = useState<
    { key: string; title: string }[]
  >(stringAttributeCriteria);
  const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<
    string | null
  >(null);
  const [newAttributeValue, setNewAttributeValue] = useState<
    string | number | boolean
  >('');
  const [matchUsername, setMatchUsername] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<OpaAttributeType[]>([]);
  const [isCreateAttributeFormOpen, setIsCreateAttributeFormOpen] =
    useState<boolean>(false);

  const doneButtonRef = useRef(null);

  const dispatch = useAppDispatch();

  function onSelectedTypeOfRolesChange(event: any) {
    setSelectedTypeOfRoles(event.target.value);
  }

  const updateAllAttributes = () => {
    DocumentsService.getAttributes(siteId).then((response) => {
      if (response.status === 200) {
        const allAttributeData = {
          allAttributes: response?.attributes,
          attributesLastRefreshed: new Date(),
          attributesSiteId: siteId,
        };
        dispatch(setAllAttributesData(allAttributeData));
      }
    });
  };

  useEffect(() => {
    updateAllAttributes();
  }, []);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  useEffect(() => {
    if (!selectedAttributeKey) return;
    const attribute = allAttributes.find(
      (item) => item.key === selectedAttributeKey
    );
    if (!attribute) return;
    setSelectedAttribute(attribute);
  }, [selectedAttributeKey]);

  useEffect(() => {
    if (!selectedAttribute) return;
    if (selectedAttribute.dataType === 'NUMBER') {
      setAttributeCriteria(numberAttributeCriteria);
      setSelectedAttributeCriteria('eq');
      setNewAttributeValue(0);
      setMatchUsername(false);
    } else if (selectedAttribute.dataType === 'STRING') {
      setAttributeCriteria(stringAttributeCriteria);
      setSelectedAttributeCriteria('eq');
      setNewAttributeValue('');
      setMatchUsername(false);
    } else if (selectedAttribute.dataType === 'BOOLEAN') {
      setNewAttributeValue(false);
      setSelectedAttributeCriteria('eq');
      setMatchUsername(false);
    } else if (selectedAttribute.dataType === 'KEY_ONLY') {
      setMatchUsername(false);
    }
  }, [selectedAttribute]);

  function cleanAttributeForm() {
    setSelectedAttribute(null);
    setSelectedAttributeKey('');
    setNewAttributeValue('');
    setSelectedAttributeCriteria(null);
    setAttributeCriteria(stringAttributeCriteria);
    setMatchUsername(false);
  }

  function onAddAttribute() {
    if (!selectedAttributeKey) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Error. Please select the attribute',
        })
      );
      return;
    }

    let attribute: OpaAttributeType = {
      key: selectedAttributeKey,
    };

    if (matchUsername) {
      attribute = {
        ...attribute,
        eq: {
          input: {
            matchUsername,
          },
        },
      };
    }

    if (selectedAttribute && selectedAttributeCriteria && !matchUsername) {
      attribute = {
        ...attribute,
        [selectedAttributeCriteria]: {
          ...(selectedAttribute.dataType === 'NUMBER' && {
            numberValue: newAttributeValue,
          }),
          ...(selectedAttribute.dataType === 'STRING' && {
            stringValue: newAttributeValue,
          }),
          ...(selectedAttribute.dataType === 'BOOLEAN' && {
            booleanValue: newAttributeValue,
          }),
        },
      };
    }
    setAttributes([...attributes, attribute]);
    cleanAttributeForm();
  }

  const renderCriteria = (item: OpaAttributeType) => {
    if (item.eq) return 'Equal';
    if (item.gt) return 'Greater Than';
    if (item.gte) return 'Greater Than or Equal';
    if (item.lt) return 'Less Than';
    if (item.lte) return 'Less Than or Equal';
    if (item.neq) return 'Not Equal';
    return '-';
  };

  const renderValue = (item: OpaAttributeType) => {
    let result: any = '-';
    numberAttributeCriteria.map((criteria) => {
      const value: any = item[criteria.key as keyof OpaAttributeType];
      if (value) {
        if (value?.numberValue !== undefined) {
          result = value.numberValue;
        } else if (value?.stringValue !== undefined) {
          result = value.stringValue;
        } else if (value?.booleanValue !== undefined) {
          result = value.booleanValue ? 'Yes' : 'No';
        }
      }
    });
    return result;
  };

  function onCancelEdit() {
    cleanAttributeForm();
    setIsAddAttributeFormOpen(false);
    onClose();
  }

  function onSavePolicy() {
    // get all policy items
    const newPolicyItems: any = [...policyItems];
    newPolicyItems.forEach((item: any, i: number) => {
      newPolicyItems[i] = {
        ...item,
        type: 'ALLOW',
      };
    });
    // add new policy item to the list
    const newPolicyItem = {
      type: selectedPolicyType,
      [selectedTypeOfRoles]: selectedRoles,
      attributes: attributes,
    };
    newPolicyItems.splice(index, 1, newPolicyItem);

    // set updated policy items
    DocumentsService.setOpenPolicyAgentPolicyItems(siteId, {
      policyItems: newPolicyItems,
    }).then((response) => {
      if (response.status === 200) {
        onClose();
      } else {
        const errorsString = response.errors
          .map((error: any) => error.error)
          .join(', \n');
        dispatch(
          openNotificationDialog({ dialogTitle: `Error.\n ${errorsString}` })
        );
      }
    });
  }

  function onMatchUsernameChange() {
    if (!matchUsername) {
      setNewAttributeValue('');
      setSelectedAttributeCriteria('eq');
    }
    setMatchUsername(!matchUsername);
  }

  useEffect(() => {
    if (matchUsername && selectedAttributeCriteria !== 'eq') {
      setMatchUsername(false);
    }
  }, [selectedAttributeCriteria]);

  function onRemoveAttribute(index: number) {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  }

  const onCreateAttributeFormClose = () => {
    setIsCreateAttributeFormOpen(false);
  };

  useEffect(() => {
    const policyItem = policyItems[index];
    const initialRoles =
      policyItem?.allRoles !== undefined
        ? policyItem.allRoles
        : policyItem?.anyRoles
        ? policyItem.anyRoles
        : [];
    const initialTypeOfRoles =
      policyItem?.allRoles !== undefined ? 'allRoles' : 'anyRoles';
    const initialAttributes = policyItem?.attributes
      ? policyItem.attributes
      : [];
    setSelectedRoles(initialRoles);
    setSelectedTypeOfRoles(initialTypeOfRoles);
    setAttributes(initialAttributes);
  }, [index, policyItems]);

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={doneButtonRef}
        onClose={() => null}
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
              <Dialog.Panel className="relative transform overflow-hidden text-left transition-all w-full xl-w-1/2 lg:w-2/3 min-w-[850px]">
                <div className="bg-white p-6 rounded-lg bg-white shadow-xl border w-full h-full">
                  <div className="w-full flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-bold">
                      Edit OPA Access Policy Item
                    </Dialog.Title>
                    <div
                      className="w-5 h-5 mr-2 cursor-pointer text-gray-400"
                      onClick={onCancelEdit}
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="h-8 flex gap-2 items-center w-full mt-6">
                    <h6 className="text-md font-bold">Policy Type</h6>
                    <div className="h-8 w-32">
                      <RadioListbox
                        values={policyItemsTypes}
                        titles={policyItemsTypes}
                        selectedValue={selectedPolicyType}
                        setSelectedValue={setSelectedPolicyType}
                      />
                    </div>
                  </div>

                  <h2 className="text-lg font-bold mt-6">Conditions</h2>

                  <div className="flex gap-2 items-center justify-even w-full mt-2">
                    <div className="flex gap-8 w-full mt-2">
                      <div className="flex gap-2 items-top">
                        <h6 className="text-sm font-bold">Roles</h6>
                        <div className="h-8 w-60">
                          <GroupsSelect
                            selectedGroups={selectedRoles}
                            setSelectedGroups={setSelectedRoles}
                            siteId={siteId}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 items-top w-full">
                        <h6 className="text-sm font-bold whitespace-nowrap">
                          User must match:
                        </h6>
                        <div className="flex flex-col gap-2 w-full ">
                          <div className="relative">
                            <input
                              type="radio"
                              name="roles"
                              value="anyRoles"
                              checked={selectedTypeOfRoles === 'anyRoles'}
                              onChange={onSelectedTypeOfRolesChange}
                              className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <label className="flex items-center gap-2 w-full">
                              <div className="w-4">
                                {selectedTypeOfRoles === 'anyRoles' ? (
                                  <CheckedRadio />
                                ) : (
                                  <UncheckedRadio />
                                )}
                              </div>
                              <span className="block truncate text-sm">
                                Any role
                              </span>
                            </label>
                          </div>
                          <div className="relative">
                            <input
                              type="radio"
                              name="roles"
                              value="allRoles"
                              checked={selectedTypeOfRoles === 'allRoles'}
                              onChange={onSelectedTypeOfRolesChange}
                              className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                            />
                            <label className="flex items-center gap-2 w-full">
                              <div className="w-4">
                                {selectedTypeOfRoles === 'allRoles' ? (
                                  <CheckedRadio />
                                ) : (
                                  <UncheckedRadio />
                                )}
                              </div>
                              <span className="block truncate text-sm">
                                All roles
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isAddAttributeFormOpen && (
                    <button
                      onClick={() => {
                        setIsAddAttributeFormOpen(true);
                      }}
                      className="text-neutral-500 font-bold hover:text-primary-500 cursor-pointer ml-2 mt-2"
                    >
                      {' '}
                      + Add Attribute
                    </button>
                  )}
                  {isAddAttributeFormOpen && (
                    <>
                      <h6 className="text-sm font-bold mt-6">
                        Attribute Conditions
                      </h6>

                      <div className="w-full flex justify-between flex-wrap mt-2 gap-2">
                        <div className="h-8 flex gap-2 items-center grow">
                          <div className="relative w-full max-w-[300px]">
                            <RadioCombobox
                              values={attributeKeys}
                              selectedValue={selectedAttributeKey}
                              setSelectedValue={setSelectedAttributeKey}
                              placeholderText="Attribute"
                            />
                          </div>
                          {selectedAttribute && (
                            <div className="text-xs bg-neutral-100 rounded-md font-bold h-8 p-2 text-center whitespace-nowrap">
                              {selectedAttribute.dataType}
                            </div>
                          )}

                          {selectedAttribute &&
                            (selectedAttribute.dataType === 'NUMBER' ||
                              selectedAttribute.dataType === 'STRING') && (
                              <div className="h-8">
                                <RadioListbox
                                  values={attributeCriteria.map(
                                    (item) => item.key
                                  )}
                                  titles={attributeCriteria.map(
                                    (item) => item.title
                                  )}
                                  selectedValue={
                                    selectedAttributeCriteria as string
                                  }
                                  setSelectedValue={
                                    setSelectedAttributeCriteria
                                  }
                                />
                              </div>
                            )}

                          {selectedAttribute &&
                            selectedAttribute.dataType === 'NUMBER' && (
                              <input
                                type="number"
                                required
                                className="h-8 w-32 px-4 border border-neutral-300 text-sm rounded-md"
                                placeholder="Value"
                                step="any"
                                value={newAttributeValue as number}
                                onChange={(e) => {
                                  setNewAttributeValue(e.target.value);
                                }}
                              />
                            )}
                          {selectedAttribute &&
                            selectedAttribute.dataType === 'STRING' &&
                            !matchUsername && (
                              <input
                                type="text"
                                required
                                className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                                placeholder="Value"
                                value={newAttributeValue as string}
                                onChange={(e) => {
                                  setNewAttributeValue(e.target.value);
                                }}
                              />
                            )}
                          {selectedAttribute &&
                            selectedAttribute.dataType === 'BOOLEAN' && (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                                  checked={newAttributeValue as boolean}
                                  onChange={(e) => {
                                    setNewAttributeValue(e.target.checked);
                                  }}
                                />
                                <label className="text-sm">
                                  {newAttributeValue ? 'TRUE' : 'FALSE'}
                                </label>
                              </div>
                            )}
                          {selectedAttribute &&
                            selectedAttribute.dataType === 'STRING' && (
                              <div className="mt-2 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="matchUsername"
                                  className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                                  checked={matchUsername}
                                  onChange={onMatchUsernameChange}
                                />
                                <label
                                  htmlFor="matchUsername"
                                  onChange={onMatchUsernameChange}
                                  className="text-sm cursor-pointer whitespace-nowrap"
                                >
                                  Must match Username
                                </label>
                              </div>
                            )}
                        </div>
                        <div className="h-8 flex gap-2 grow justify-end">
                          <ButtonPrimaryGradient
                            type="button"
                            onClick={onAddAttribute}
                          >
                            Add Existing
                          </ButtonPrimaryGradient>
                          <ButtonTertiary
                            type="button"
                            onClick={() => {
                              setIsCreateAttributeFormOpen(true);
                            }}
                          >
                            Add New
                          </ButtonTertiary>
                        </div>
                      </div>
                      <div className="flex w-full">
                        {isCreateAttributeFormOpen && (
                          <div className="-ml-2 mt-4 w-full">
                            <AddAttributeForm
                              siteId={siteId}
                              onDocumentDataChange={() => updateAllAttributes()}
                              value={null}
                              getValue={() => {}}
                              onClose={onCreateAttributeFormClose}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="overflow-auto max-h-64 mt-4">
                    <table className="border border-neutral-300 border-collapse table-fixed w-full text-sm">
                      <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
                        <tr>
                          <th className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                            Key
                          </th>
                          <th className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 whitespace-nowrap">
                            Data Type
                          </th>
                          <th className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 whitespace-nowrap">
                            Match Username
                          </th>
                          <th className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                            Criteria
                          </th>
                          <th className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                            Value
                          </th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody className="bg-white nodark:bg-slate-800">
                        {attributes.length === 0 ? (
                          <tr className="border-t border-neutral-300">
                            <td colSpan={4} className="p-4 text-center">
                              No attributes added
                            </td>
                          </tr>
                        ) : (
                          attributes.map((attribute, index) => (
                            <tr
                              key={'attribute' + index}
                              className="border-t border-neutral-300"
                            >
                              <td className="p-4 text-start truncate">
                                {attribute.key}
                              </td>
                              <td className="p-4 text-start ">
                                {
                                  allAttributes.find(
                                    (item) => item.key === attribute.key
                                  )?.dataType
                                }
                              </td>
                              <td className="p-4 text-start ">
                                {attribute.eq &&
                                attribute.eq?.input?.matchUsername
                                  ? 'Yes'
                                  : 'No'}
                              </td>
                              <td className="p-4 text-start">
                                {renderCriteria(attribute)}
                              </td>
                              <td className="p-4 text-start">
                                {renderValue(attribute)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  title="Remove"
                                  onClick={() => onRemoveAttribute(index)}
                                  className="text-neutral-900 hover:text-primary-500 w-4 h-4 ml-2"
                                >
                                  <Close />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2 h-8 justify-end mt-4">
                    <ButtonPrimaryGradient type="button" onClick={onSavePolicy}>
                      Save
                    </ButtonPrimaryGradient>
                    <ButtonGhost type="button" onClick={onCancelEdit}>
                      Cancel
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
