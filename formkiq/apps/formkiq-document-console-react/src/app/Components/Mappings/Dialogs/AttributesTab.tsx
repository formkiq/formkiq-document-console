import { Close, Pencil} from '../../Icons/icons';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import { useEffect, useState } from 'react';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import {
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../helpers/types/mappings';
import ButtonPrimary from '../../Generic/Buttons/ButtonPrimary';
import ButtonTertiary from '../../Generic/Buttons/ButtonTertiary';

type AddAttributesTabProps = {
  attributeKeys: { key: string; title: string }[];
  attribute: {
    attributeKey: string;
    defaultValue: string;
    defaultValues: string[];
    sourceType: MappingAttributeSourceType | string;
    labelText: string;
    labelTexts: string[];
    labelMatchingType: MappingAttributeLabelMatchingType | string;
    metadataField: MappingAttributeMetadataField | string;
    validationRegex: string;
  };
  setAttribute: (attribute: any) => void;
  preventDialogClose: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addDefaultValue: () => void;
  addAttributesToMapping: () => void;
  updateAttributeInMapping: (index: number) => 'failed' | 'success';
  resetAttribute: () => void;
  deleteAttributeFromMapping: (index: number) => void;
  attributes: any[];
  allAttributes: any[];
  addLabelText: () => void;
};

function AttributesTab({
  attributeKeys,
  attribute,
  setAttribute,
  preventDialogClose,
  addDefaultValue,
  addAttributesToMapping,
  updateAttributeInMapping,
  resetAttribute,
  deleteAttributeFromMapping,
  attributes,
  allAttributes,
  addLabelText,
}: AddAttributesTabProps) {
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(-1);
  const deleteDefaultValue = (event: React.MouseEvent, value: string) => {
    event.stopPropagation();
    setAttribute((prev: any) => ({
      ...prev,
      defaultValues: prev.defaultValues.filter((v: string) => v !== value),
    }));
  };

  const deleteLabelText = (index: number) => {
    setAttribute((prev: any) => ({
      ...prev,
      labelTexts: prev.labelTexts.filter((_: string, i: number) => i !== index),
    }));
  };

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
    setAttribute((prev: any) => ({ ...prev, defaultValue }));
  }, [attribute.attributeKey, attribute.defaultValue, allAttributes]);

  const selectedAttribute = allAttributes.find(
    (a) => a.key === attribute.attributeKey
  );
  const dataType = selectedAttribute?.dataType;
  const onAttributeKeyChange = (attributeKey: string) => {
    setAttribute((prev: any) => ({
      ...prev,
      attributeKey,
      defaultValue: '',
      defaultValues: [],
    }));
  };

  const editAttribute = (index: number) => {
    setEditingAttributeIndex(index);
    setAttribute(attributes[index]);
  };
  const onSaveEditedAttribute = () => {
    const res = updateAttributeInMapping(editingAttributeIndex);
    if (res === 'success') {
      setEditingAttributeIndex(-1);
    }
  };

  return (
    <>
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
          <>
            <div className="flex flex-row justify-between items-end gap-2 text-base h-10 w-1/2">
              {dataType === 'STRING' && (
                <input
                  type="text"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Default Value"
                  value={attribute.defaultValue}
                  onChange={(e) =>
                    setAttribute((prev: any) => ({
                      ...prev,
                      defaultValue: e.target.value,
                    }))
                  }
                  onKeyDown={preventDialogClose}
                />
              )}
              {dataType === 'NUMBER' && (
                <input
                  type="number"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Default Value"
                  value={Number(attribute.defaultValue)}
                  step="any"
                  onChange={(e) =>
                    setAttribute((prev: any) => ({
                      ...prev,
                      defaultValue: e.target.value,
                    }))
                  }
                  onKeyDown={preventDialogClose}
                />
              )}
              {dataType === 'BOOLEAN' && (
                <div className="mt-2 flex items-center gap-2">
                  <h3 className="text-sm font-bold mr-5">Default Value: </h3>

                  <input
                    type="checkbox"
                    className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                    checked={attribute.defaultValue === 'true'}
                    onChange={(e) =>
                      setAttribute((prev: any) => ({
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
          </>
        ) : (
          <div className="w-1/2 h-0"></div>
        )}
      </div>

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

      <div className="flex w-full gap-4">
        <div className="w-1/2 h-[60px] flex flex-col">
          <label className="text-xs font-bold">SOURCE TYPE</label>
          <RadioListbox
            values={['CONTENT', 'METADATA', 'CONTENT_KEY_VALUE']}
            titles={['Content', 'Metadata', 'Content Key Value']}
            selectedValue={attribute.sourceType}
            setSelectedValue={(sourceType) =>
              setAttribute((prev: any) => ({
                ...prev,
                sourceType: sourceType as MappingAttributeSourceType,
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
                  setAttribute((prev: any) => ({
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

      <div className="flex w-full gap-4 items-end">
        <div className="w-1/2">
          <label className="text-xs font-bold">LABEL MATCHING TYPE</label>
          <div className="h-10">
            <RadioListbox
              values={['FUZZY', 'EXACT', 'BEGINS_WITH', 'CONTAINS']}
              titles={['Fuzzy', 'Exact', 'Begins With', 'Contains']}
              selectedValue={attribute.labelMatchingType}
              setSelectedValue={(labelMatchingType) =>
                setAttribute((prev: any) => ({
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
              setAttribute((prev: any) => ({
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

      {attribute.labelTexts.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm text-neutral-500 font-bold">Label Texts:</p>
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
            {attribute.labelTexts.map((text, i) => (
              <div
                key={`label_text_${i}`}
                className="py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900"
              >
                <span className="text-ellipsis overflow-hidden">{text}</span>
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

      <div className="">
        <label className="text-xs font-bold">VALIDATION REGEX</label>
        <input
          type="text"
          className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
          placeholder="Validation Regex"
          value={attribute.validationRegex}
          onChange={(e) =>
            setAttribute((prev: any) => ({
              ...prev,
              validationRegex: e.target.value,
            }))
          }
        />
      </div>

      {attribute.attributeKey &&
        (editingAttributeIndex === -1 ? (
          <ButtonPrimary
            type="button"
            className="h-10 self-end"
            onClick={addAttributesToMapping}
          >
            Add Attribute
          </ButtonPrimary>
        ) : (
          <div className="flex gap-2">
            <ButtonTertiary
              type="button"
              className="h-10 self-end"
              onClick={() => {
                setEditingAttributeIndex(-1);
                resetAttribute();
              }}
            >
              Cancel Editing
            </ButtonTertiary>
            <ButtonPrimary
              type="button"
              className="h-10 self-end"
              onClick={onSaveEditedAttribute}
            >
              Update Attribute
            </ButtonPrimary>
          </div>
        ))}

      {attributes && attributes.length > 0 && (
        <>
          <h4 className="text-sm font-bold">ADDED ATTRIBUTES:</h4>
          <div className="overflow-y-auto max-h-44">
            <table className="border-b border-x border-separate border-spacing-0 border-neutral-300 w-full max-w-full table-fixed text-left text-xs">
              <thead className="sticky top-0 bg-neutral-100 border border-neutral-300 ">
                <tr className="border border-neutral-300 px-4 text-neutral-900">
                  <th className="w-4 px-4 border-b border-t border-neutral-300">
                    #
                  </th>
                  <th className="border-b border-t border-neutral-300">Key</th>
                  <th className="border-b border-t border-neutral-300">
                    Default Values
                  </th>
                  <th className="border-b border-t border-neutral-300">
                    Source Type
                  </th>
                  <th className="border-b border-t border-neutral-300">
                    Label Matching Type
                  </th>
                  <th className="border-b border-t border-neutral-300">
                    Label Texts
                  </th>
                  <th className="border-b border-t border-neutral-300">
                    Metadata Field
                  </th>
                  <th className="border-b border-t border-neutral-300">
                    Validation Regex
                  </th>
                  <th
                    className="px-4 border-b border-t border-neutral-300"
                    style={{
                      width: editingAttributeIndex === -1 ? '56px' : 'auto',
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((value, i) => (
                  <tr
                    key={`tag_${i}`}
                    className="border border-neutral-300 px-4 h-12 text-neutral-900"
                  >
                    <td className="text-neutral-500 px-4 border-t border-neutral-300">
                      <span className="text-neutral-900 font-medium">
                        {i + 1}
                      </span>
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      <span title={value.attributeKey}>
                        {value.attributeKey}
                      </span>
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.defaultValues
                        ? value.defaultValues.join(', ')
                        : value.defaultValue}
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.sourceType}
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.labelMatchingType}
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.labelTexts && value.labelTexts.join(', ')}
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.metadataField}
                    </td>
                    <td className="text-ellipsis overflow-hidden border-t border-neutral-300">
                      {value.validationRegex}
                    </td>
                    <td className="border-t border-neutral-300 text-center">
                      {editingAttributeIndex === i ? (
                        <div className="p-1 bg-primary-100 text-primary-900 rounded-md text-xs font-bold whitespace-nowrap">
                          <p>EDITING NOW</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500"
                            onClick={() => editAttribute(i)}
                          >
                            <Pencil />
                          </button>
                          <button
                            type="button"
                            className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500"
                            onClick={() => deleteAttributeFromMapping(i)}
                          >
                            <Close />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default AttributesTab;
