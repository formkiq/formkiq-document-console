import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import {
  MappingAttribute,
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../helpers/types/mappings';
import { useSelector } from 'react-redux';
import {
  AttributesDataState,
  setAllAttributesData,
} from '../../../Store/reducers/attributesData';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import AddAttributesTab from './AddAttributesTab';
import { openDialog as openNotificationDialog } from '../../../Store/reducers/globalNotificationControls';
import { addMapping } from '../../../Store/reducers/mappings';

type CreateMappingDialogPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
};

function CreateMappingDialog({
  isOpen,
  setIsOpen,
  siteId,
}: CreateMappingDialogPropsType) {
  const initialMappingValue: {
    name: string;
    description: string;
    attributes: MappingAttribute[];
  } = { name: '', description: '', attributes: [] };
  const initialAttributeValue: {
    attributeKey: string;
    defaultValue: string;
    defaultValues: string[];
    sourceType: MappingAttributeSourceType | string;
    labelText: string;
    labelTexts: string[];
    labelMatchingType: MappingAttributeLabelMatchingType | string;
    metadataField: MappingAttributeMetadataField | string;
    validationRegex: string;
  } = {
    attributeKey: '',
    defaultValue: '',
    defaultValues: [],
    sourceType: '',
    labelText: '',
    labelTexts: [],
    labelMatchingType: '',
    metadataField: '',
    validationRegex: '',
  };

  const [selectedTab, setSelectedTab] = useState<'generalInfo' | 'attributes'>(
    'generalInfo'
  );
  const [mapping, setMapping] = useState(initialMappingValue);
  const [attribute, setAttribute] = useState(initialAttributeValue);
  const { allAttributes } = useSelector(AttributesDataState);
  const [attributeKeys, setAttributeKeys] = useState<
    { key: string; title: string }[]
  >([]);
  const mappingNameRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

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
      await dispatch(addMapping({ mapping: { mapping }, siteId })).unwrap();
      closeModal();
    } catch (error: any) {
      dispatch(openNotificationDialog({ dialogTitle: error.message }));
    }
  };

  const closeModal = () => {
    setMapping(initialMappingValue);
    setAttribute(initialAttributeValue);
    setSelectedTab('generalInfo');
    setIsOpen(false);
  };

  const addDefaultValue = () => {
    if (attribute.defaultValue.length === 0) {
      return;
    }
    if (attribute.defaultValues.includes(attribute.defaultValue)) {
      dispatch(openNotificationDialog({ dialogTitle: 'Value already exists' }));
      return;
    }
    setAttribute({
      ...attribute,
      defaultValues: [...attribute.defaultValues, attribute.defaultValue],
      defaultValue: '',
    });
  };

  const addLabelText = () => {
    if (attribute.labelText.length === 0) {
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

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const addAttributesToMapping = () => {
    if (attribute.attributeKey.length === 0) return;
    if (attribute.sourceType.length === 0) {
      dispatch(
        openNotificationDialog({ dialogTitle: 'Please select a source type' })
      );
      return;
    }
    if (attribute.labelMatchingType.length === 0) {
      dispatch(
        openNotificationDialog({
          dialogTitle: 'Please select a label matching type',
        })
      );
      return;
    }
    if (attribute.labelTexts.length === 0 && attribute.labelText.length === 0) {
      dispatch(
        openNotificationDialog({ dialogTitle: 'Please add a label text' })
      );
      return;
    }

    const newMapping = { ...mapping };
    const newAttribute: MappingAttribute = {
      attributeKey: attribute.attributeKey,
      sourceType: attribute.sourceType as MappingAttributeSourceType,
      labelMatchingType:
        attribute.labelMatchingType as MappingAttributeLabelMatchingType,
      metadataField: attribute.metadataField as MappingAttributeMetadataField,
      validationRegex: attribute.validationRegex,
    };
    if (attribute.defaultValues.length > 0) {
      newAttribute.defaultValues = attribute.defaultValues;
    } else if (attribute.defaultValue.length > 0) {
      newAttribute.defaultValue = attribute.defaultValue;
    }
    if (attribute.labelTexts.length > 0) {
      newAttribute.labelTexts = attribute.labelTexts;
    } else if (attribute.labelText.length > 0) {
      newAttribute.labelTexts = [attribute.labelText];
    }

    newMapping.attributes.push(newAttribute);
    setMapping(newMapping);
    setAttribute(initialAttributeValue);
  };

  const deleteAttributeFromMapping = (index: number) => {
    const newMapping = { ...mapping };
    newMapping.attributes.splice(index, 1);
    setMapping(newMapping);
  };

  const deleteLabelTextFromMapping = (index: number) => {
    const newMapping = { ...mapping };
    newMapping.attributes[index].labelTexts?.splice(index, 1);
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
            Create New Mapping
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

            {selectedTab === 'generalInfo' && (
              <>
                <input
                  type="text"
                  className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                  placeholder="Add mapping name"
                  required
                  value={mapping.name}
                  onChange={(e) =>
                    setMapping({ ...mapping, name: e.target.value })
                  }
                  ref={mappingNameRef}
                />
                <textarea
                  className="h-24 px-4 py-2 border border-neutral-300 text-sm rounded-md"
                  placeholder="Add mapping description"
                  value={mapping.description}
                  onChange={(e) =>
                    setMapping({ ...mapping, description: e.target.value })
                  }
                />
              </>
            )}

            {selectedTab === 'attributes' && (
              <AddAttributesTab
                attributeKeys={attributeKeys}
                preventDialogClose={preventDialogClose}
                addDefaultValue={addDefaultValue}
                addAttributesToMapping={addAttributesToMapping}
                deleteAttributeFromMapping={deleteAttributeFromMapping}
                attributes={mapping.attributes}
                allAttributes={allAttributes}
                addLabelText={addLabelText}
                attribute={attribute}
                setAttribute={setAttribute}
              />
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
                + CREATE
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}

export default CreateMappingDialog;
