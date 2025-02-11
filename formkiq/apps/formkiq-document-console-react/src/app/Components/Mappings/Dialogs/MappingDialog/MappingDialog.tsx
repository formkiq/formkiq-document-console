import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import {
  Mapping,
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../../helpers/types/mappings';

import { openDialog as openNotificationDialog } from '../../../../Store/reducers/globalNotificationControls';
import {
  addMapping,
  fetchMappings,
  updateMapping,
} from '../../../../Store/reducers/mappings';
import { useAppDispatch } from '../../../../Store/store';
import {
  createNewAttribute,
  getAttributeErrorMessages,
  isAttributeValid,
} from '../helpers';
import AttributesTab from './AttributesTab';
import GeneralInfoTab from './GeneralInfoTab';

type MappingDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
  type: 'create' | 'edit';
  initialMappingValue: Mapping;
};

function MappingDialog({
  isOpen,
  setIsOpen,
  siteId,
  type,
  initialMappingValue,
}: MappingDialogPropsType) {
  const initialAttributeValue: {
    attributeKey: string;
    defaultValue: string;
    defaultValues: string[];
    sourceType?: MappingAttributeSourceType;
    labelText: string;
    labelTexts: string[];
    labelMatchingType?: MappingAttributeLabelMatchingType;
    metadataField?: MappingAttributeMetadataField;
    validationRegex: string;
  } = {
    attributeKey: '',
    defaultValue: '',
    defaultValues: [],
    labelText: '',
    labelTexts: [],
    validationRegex: '',
  };

  const [selectedTab, setSelectedTab] = useState<'generalInfo' | 'attributes'>(
    'generalInfo'
  );
  const [mapping, setMapping] = useState(initialMappingValue);
  const [attribute, setAttribute] = useState(initialAttributeValue);
  const mappingNameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMapping(initialMappingValue);
  }, [initialMappingValue]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mapping.name.length === 0) {
      dispatch(
        openNotificationDialog({ dialogTitle: 'Please enter the name.' })
      );
      setSelectedTab('generalInfo');
      return;
    }
    try {
      if (type === 'create') {
        await dispatch(addMapping({ mapping: { mapping }, siteId })).unwrap();
      } else if (type === 'edit' && mapping.mappingId) {
        await dispatch(
          updateMapping({
            mapping: { mapping },
            siteId,
            mappingId: mapping.mappingId,
          })
        ).unwrap();
      }
      dispatch(fetchMappings({ siteId, page: 1, limit: 20, nextToken: null }));
      closeModal();
    } catch (error: any) {
      dispatch(openNotificationDialog({ dialogTitle: error.message }));
    }
  };

  const closeModal = () => {
    resetMapping();
    setSelectedTab('generalInfo');
    setIsOpen(false);
  };

  const addDefaultValue = () => {
    if (!attribute.defaultValue || attribute.defaultValue.trim().length === 0) {
      return;
    }

    // Ensure defaultValues is an array
    const currentDefaultValues = Array.isArray(attribute.defaultValues)
      ? attribute.defaultValues
      : [];

    if (currentDefaultValues.includes(attribute.defaultValue)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Value already exists' }));
      return;
    }

    setAttribute({
      ...attribute,
      defaultValues: [...currentDefaultValues, attribute.defaultValue],
      defaultValue: '',
    });
  };

  const addLabelText = () => {
    if (attribute.labelText?.length === 0) {
      return;
    }
    if (attribute.labelTexts.includes(attribute.labelText)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Label already exists' }));
      return;
    }
    setAttribute({
      ...attribute,
      labelTexts: [...attribute.labelTexts, attribute.labelText],
      labelText: '',
    });
  };

  const addAttributesToMapping = () => {
    if (!isAttributeValid(attribute)) {
      const errorMessages = getAttributeErrorMessages(attribute);
      if (errorMessages.length > 0) {
        dispatch(
          openNotificationDialog({ dialogTitle: errorMessages.join('\n') })
        );
      }
      return;
    }
    const newMapping = { ...mapping };
    const newAttributes = [...newMapping.attributes];
    const newAttribute = createNewAttribute(attribute);
    newAttributes.push(newAttribute);
    newMapping.attributes = newAttributes;
    setMapping(newMapping);
    resetAttribute();
  };

  const updateAttributeInMapping = (index: number) => {
    if (!isAttributeValid(attribute)) {
      const errorMessages = getAttributeErrorMessages(attribute);
      if (errorMessages.length > 0) {
        dispatch(
          openNotificationDialog({ dialogTitle: errorMessages.join('\n') })
        );
      }
      return 'failed';
    }
    const newMapping = { ...mapping };
    const newAttributes = [...newMapping.attributes];
    newAttributes[index] = createNewAttribute(attribute);
    newMapping.attributes = newAttributes;
    setMapping(newMapping);
    resetAttribute();
    return 'success';
  };

  const resetAttribute = () => {
    setAttribute(initialAttributeValue);
  };

  const resetMapping = () => {
    resetAttribute();
    setMapping(initialMappingValue);
  };

  const deleteAttributeFromMapping = (index: number) => {
    const newMapping = { ...mapping };
    const newAttributes = [...newMapping.attributes];
    newAttributes.splice(index, 1);
    newMapping.attributes = newAttributes;
    setMapping(newMapping);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => null}
      className="relative z-20 text-neutral-900"
      initialFocus={mappingNameRef}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white p-6 rounded-md">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {type === 'create' ? 'Create New Mapping' : 'Edit Mapping'}
          </Dialog.Title>
          <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>
            <div className="flex flex-row justify-start gap-2 text-sm font-bold">
              <button
                type="button"
                className="h-8 px-4"
                style={{
                  borderBottom:
                    selectedTab === 'generalInfo'
                      ? '1px solid #171C26'
                      : '1px solid transparent',
                  color: selectedTab === 'generalInfo' ? '#171C26' : '#68758D',
                }}
                onClick={() => setSelectedTab('generalInfo')}
              >
                GENERAL
              </button>
              <button
                type="button"
                className="h-8 px-4"
                style={{
                  borderBottom:
                    selectedTab === 'attributes'
                      ? '1px solid #171C26'
                      : '1px solid transparent',
                  color: selectedTab === 'attributes' ? '#171C26' : '#68758D',
                }}
                onClick={() => setSelectedTab('attributes')}
              >
                ATTRIBUTES
              </button>
            </div>
            {mapping && (
              <>
                {selectedTab === 'generalInfo' && (
                  <GeneralInfoTab
                    mapping={mapping}
                    setMapping={setMapping}
                    mappingNameRef={mappingNameRef}
                  />
                )}

                {selectedTab === 'attributes' && (
                  <AttributesTab
                    siteId={siteId}
                    addDefaultValue={addDefaultValue}
                    addAttributesToMapping={addAttributesToMapping}
                    updateAttributeInMapping={updateAttributeInMapping}
                    resetAttribute={resetAttribute}
                    deleteAttributeFromMapping={deleteAttributeFromMapping}
                    attributes={mapping.attributes}
                    addLabelText={addLabelText}
                    attribute={attribute}
                    setAttribute={setAttribute}
                  />
                )}
              </>
            )}
            <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="h-10 border border-neutral-900 px-4 rounded-md"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md"
              >
                {type === 'create' ? '+ CREATE' : 'SAVE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default MappingDialog;
