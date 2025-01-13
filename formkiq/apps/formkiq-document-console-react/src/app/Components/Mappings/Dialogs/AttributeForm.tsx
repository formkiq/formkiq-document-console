import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../helpers/types/mappings';
import {
  AttributesDataState,
  fetchAttributesData,
} from '../../../Store/reducers/attributesData';
import { useAppDispatch } from '../../../Store/store';
import ButtonTertiary from '../../Generic/Buttons/ButtonTertiary';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import { Close } from '../../Icons/icons';
import { preventDialogClose } from './helpers';

// **Enhanced Type Definitions**
type Attribute = {
  attributeKey: string;
  defaultValue: string;
  defaultValues: string[];
  sourceType: MappingAttributeSourceType;
  labelText: string;
  labelTexts: string[];
  labelMatchingType: MappingAttributeLabelMatchingType;
  metadataField: MappingAttributeMetadataField;
  validationRegex: string;
};

type AttributeFormProps = {
  siteId: string;
  attribute: Attribute;
  setAttribute: (attribute: Attribute) => void;
  addDefaultValue: () => void;
  addLabelText: () => void;
};

function AttributeForm({
  siteId,
  attribute,
  setAttribute,
  addDefaultValue,
  addLabelText,
}: AttributeFormProps) {
  const { allAttributes } = useSelector(AttributesDataState);
  const [attributeKeys, setAttributeKeys] = useState<
    { key: string; title: string }[]
  >([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) {
      dispatch(fetchAttributesData({ siteId }));
    }
  }, [siteId, allAttributes, dispatch]);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  useEffect(() => {
    if (attribute.defaultValue) return;
    const selectedAttribute = allAttributes.find(
      (a) => a.key === attribute.attributeKey
    );
    if (!selectedAttribute) return;

    let defaultValue = '';
    switch (selectedAttribute.dataType) {
      case 'BOOLEAN':
        defaultValue = 'false';
        break;
      case 'NUMBER':
        defaultValue = '0';
        break;
      case 'STRING':
        defaultValue = '';
        break;
    }
    setAttribute((prev: Attribute) => ({ ...prev, defaultValue }));
  }, [
    attribute.attributeKey,
    attribute.defaultValue,
    allAttributes,
    setAttribute,
  ]);

  // **Set labelMatchingType to "EXACT" when sourceType is "MANUAL"**
  useEffect(() => {
    if (attribute.sourceType === 'MANUAL') {
      setAttribute((prev: Attribute) => ({
        ...prev,
        labelMatchingType: 'EXACT',
        labelTexts: [], // Clear existing label texts
      }));
    }
  }, [attribute.sourceType, setAttribute]);

  const selectedAttribute = allAttributes.find(
    (a) => a.key === attribute.attributeKey
  );
  const dataType = selectedAttribute?.dataType;

  const onAttributeKeyChange = (attributeKey: string) => {
    setAttribute((prev: Attribute) => ({
      ...prev,
      attributeKey,
      defaultValue: '',
      defaultValues: [],
      labelText: '',
      labelTexts: [],
    }));
  };

  const deleteDefaultValue = (event: React.MouseEvent, value: string) => {
    event.stopPropagation();
    setAttribute((prev: Attribute) => ({
      ...prev,
      defaultValues: prev.defaultValues.filter((v: string) => v !== value),
    }));
  };

  const deleteLabelText = (index: number) => {
    setAttribute((prev: Attribute) => ({
      ...prev,
      labelTexts: prev.labelTexts.filter((_: string, i: number) => i !== index),
    }));
  };

  // **Determine if the current sourceType is MANUAL**
  const isManual = attribute.sourceType === 'MANUAL';

  return (
    <>
      {/* Attribute selection and default value input */}
      <div className="flex gap-4 w-full items-end">
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-bold">ATTRIBUTE</label>
          <div className="flex flex-row items-center gap-2 text-base h-10 w-full">
            <RadioCombobox
              values={attributeKeys}
              selectedValue={attribute.attributeKey}
              setSelectedValue={onAttributeKeyChange}
              placeholderText="Key"
            />
            {attribute.attributeKey && (
              <div className="text-xs bg-neutral-100 rounded-md font-bold h-10 p-3 text-center whitespace-nowrap">
                {dataType}
              </div>
            )}
          </div>
        </div>

        {attribute.attributeKey && dataType !== 'KEY_ONLY' ? (
          <div className="flex flex-row justify-between items-end gap-2 text-base h-10 w-1/2">
            {dataType === 'STRING' && (
              <div className="flex flex-col w-full">
                <label
                  htmlFor="defaultValue"
                  className="text-xs text-gray-500 mb-1"
                >
                  Default Value
                </label>
                <input
                  id="defaultValue"
                  type="text"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Enter default value"
                  value={attribute.defaultValue}
                  onChange={(e) =>
                    setAttribute((prev: Attribute) => ({
                      ...prev,
                      defaultValue: e.target.value,
                    }))
                  }
                  onKeyDown={preventDialogClose}
                />
              </div>
            )}
            {dataType === 'NUMBER' && (
              <div className="flex flex-col w-full">
                <label
                  htmlFor="defaultValue"
                  className="text-xs text-gray-500 mb-1"
                >
                  Default Value
                </label>
                <input
                  type="number"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Default Value"
                  value={Number(attribute.defaultValue)}
                  step="any"
                  onChange={(e) =>
                    setAttribute((prev: Attribute) => ({
                      ...prev,
                      defaultValue: e.target.value,
                    }))
                  }
                  onKeyDown={preventDialogClose}
                />
              </div>
            )}
            {dataType === 'BOOLEAN' && (
              <div className="mt-2 flex items-center gap-2">
                <h3 className="text-sm text-gray-500 mr-5">Default Value: </h3>

                <input
                  type="checkbox"
                  className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                  checked={attribute.defaultValue === 'true'}
                  onChange={(e) =>
                    setAttribute((prev: Attribute) => ({
                      ...prev,
                      defaultValue: e.target.checked ? 'true' : 'false',
                    }))
                  }
                />
                <label className="text-sm">
                  {attribute.defaultValue === 'true' ? 'TRUE' : 'FALSE'}
                </label>
              </div>
            )}

            <ButtonTertiary
              type="button"
              className="h-10 whitespace-nowrap"
              onClick={addDefaultValue}
            >
              + ADD
            </ButtonTertiary>
          </div>
        ) : (
          <div className="w-1/2 h-0"></div>
        )}
      </div>

      {/* Default values display */}
      {attribute?.defaultValues && attribute.defaultValues.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm text-neutral-500 font-bold">
              Default Values:
            </p>
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
            {attribute?.defaultValues.map((value, i) => (
              <div
                key={`default_value_${i}`}
                className="py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900"
              >
                <span className="text-ellipsis overflow-hidden">{value}</span>
                <button
                  title="Remove Value"
                  type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500 "
                  onClick={(e) => deleteDefaultValue(e, value)}
                >
                  <Close />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source type and metadata field selection */}
      <div className="flex w-full gap-4">
        <div className="w-1/2 h-[60px] flex flex-col">
          <label className="text-xs font-bold">SOURCE TYPE</label>
          <RadioListbox
            values={['CONTENT', 'METADATA', 'CONTENT_KEY_VALUE', 'MANUAL']}
            titles={['Content', 'Metadata', 'Content Key Value', 'Manual']}
            selectedValue={attribute.sourceType}
            setSelectedValue={(sourceType) =>
              setAttribute((prev: Attribute) => ({
                ...prev,
                sourceType: sourceType as MappingAttributeSourceType,
                ...(sourceType === 'MANUAL'
                  ? { labelMatchingType: 'EXACT', labelTexts: [] }
                  : {}),
              }))
            }
            placeholderText="Select Source Type"
          />
        </div>
        <div className="w-1/2 flex flex-col">
          {attribute.sourceType === 'METADATA' && (
            <>
              <label className="text-xs font-bold">METADATA FIELD</label>
              <RadioListbox
                values={['USERNAME', 'PATH', 'CONTENT_TYPE']}
                titles={['Username', 'Path', 'Content Type']}
                selectedValue={attribute.metadataField}
                setSelectedValue={(metadataField) =>
                  setAttribute((prev: Attribute) => ({
                    ...prev,
                    metadataField:
                      metadataField as MappingAttributeMetadataField,
                  }))
                }
                placeholderText="Select Metadata Field"
              />
            </>
          )}
        </div>
      </div>

      {/* **Conditional Rendering for LABEL MATCHING TYPE and LABEL TEXT** */}
      {!isManual && (
        <>
          <div className="flex w-full gap-4 items-end">
            <div className="w-1/2">
              <label className="text-xs font-bold">LABEL MATCHING TYPE</label>
              <div className="h-10">
                <RadioListbox
                  values={['FUZZY', 'EXACT', 'BEGINS_WITH', 'CONTAINS']}
                  titles={['Fuzzy', 'Exact', 'Begins With', 'Contains']}
                  selectedValue={attribute.labelMatchingType}
                  setSelectedValue={(labelMatchingType) =>
                    setAttribute((prev: Attribute) => ({
                      ...prev,
                      labelMatchingType:
                        labelMatchingType as MappingAttributeLabelMatchingType,
                    }))
                  }
                  placeholderText="Select Label Matching Type"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between items-center gap-2 text-base w-1/2">
              <input
                type="text"
                className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                placeholder="Label Text"
                value={attribute.labelText}
                onChange={(e) =>
                  setAttribute((prev: Attribute) => ({
                    ...prev,
                    labelText: e.target.value,
                  }))
                }
                onKeyDown={preventDialogClose}
              />
              <ButtonTertiary
                type="button"
                className="h-10 whitespace-nowrap"
                onClick={addLabelText}
              >
                + ADD
              </ButtonTertiary>
            </div>
          </div>

          {/* Label texts display */}
          {attribute.labelTexts && attribute.labelTexts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm text-neutral-500 font-bold">
                  Label Texts:
                </p>
              </div>
              <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                {attribute.labelTexts.map((text, i) => (
                  <div
                    key={`label_text_${i}`}
                    className="py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900"
                  >
                    <span className="text-ellipsis overflow-hidden">
                      {text}
                    </span>
                    <button
                      title="Remove Value"
                      type="button"
                      className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500"
                      onClick={() => deleteLabelText(i)}
                    >
                      <Close />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Validation regex input */}
      <div className="">
        <label className="text-xs font-bold">VALIDATION REGEX</label>
        <input
          type="text"
          className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
          placeholder="Validation Regex"
          value={attribute.validationRegex}
          onChange={(e) =>
            setAttribute((prev: Attribute) => ({
              ...prev,
              validationRegex: e.target.value,
            }))
          }
          onKeyDown={preventDialogClose}
        />
      </div>

      {/* **Optional User Feedback for MANUAL Source Type** */}
      {isManual && (
        <p className="text-xs text-gray-500 mt-1">
          When Source Type is "MANUAL", Label Matching Type is set to "EXACT"
          and Label Texts are disabled.
        </p>
      )}
    </>
  );
}

export default AttributeForm;
