import { Close, Save } from '../../Icons/icons';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import { useEffect } from 'react';
import RadioListbox from '../../Generic/Listboxes/RadioListbox';
import {
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../helpers/types/mappings';

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
  deleteAttributeFromMapping: (index: number) => void;
  attributes: any[];
  allAttributes: any[];
  addLabelText: () => void;
};

function AddAttributesTab({
  attributeKeys,
  attribute,
  setAttribute,
  preventDialogClose,
  addDefaultValue,
  addAttributesToMapping,
  deleteAttributeFromMapping,
  attributes,
  allAttributes,
  addLabelText,
}: AddAttributesTabProps) {
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

  return (
    <>
      <div className="flex flex-row items-center gap-4 text-base h-10">
        <RadioCombobox
          values={attributeKeys}
          selectedValue={attribute.attributeKey}
          setSelectedValue={(attributeKey) =>
            setAttribute((prev: any) => ({ ...prev, attributeKey }))
          }
          placeholderText="Key"
        />
        {attribute.attributeKey && (
          <div className="text-xs bg-neutral-100 rounded-md font-bold h-10 p-3 text-center whitespace-nowrap">
            {dataType}
          </div>
        )}
      </div>

      {attribute.attributeKey && dataType !== 'KEY_ONLY' && (
        <>
          <div className="flex flex-row justify-between items-center gap-4 text-base">
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

            <button
              type="button"
              className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
              onClick={addDefaultValue}
            >
              + ADD
            </button>
          </div>

          {attribute.defaultValues.length > 0 && (
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm text-neutral-900 font-medium">
                  Default Values{' '}
                </p>
              </div>
              <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                {attribute.defaultValues.map((value, i) => (
                  <div
                    key={`default_value_${i}`}
                    className="cursor-pointer py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900"
                  >
                    <span className="text-ellipsis overflow-hidden">
                      {value}
                    </span>
                    <button
                      title="Remove Value"
                      type="button"
                      className="w-4 h-4 min-w-4 text-neutral-900"
                      onClick={(e) => deleteDefaultValue(e, value)}
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

      <div className="h-10">
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

      <div className="flex flex-row justify-between items-center gap-4 text-base">
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
        <button
          type="button"
          className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
          onClick={addLabelText}
        >
          + ADD
        </button>
      </div>

      {attribute.labelTexts.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm text-neutral-900 font-medium">Label Texts </p>
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
            {attribute.labelTexts.map((text, i) => (
              <div
                key={`label_text_${i}`}
                className="cursor-pointer py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900"
              >
                <span className="text-ellipsis overflow-hidden">{text}</span>
                <button
                  title="Remove Value"
                  type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900"
                  onClick={() => deleteLabelText(i)}
                >
                  <Close />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-10">
        <RadioListbox
          values={['USERNAME', 'PATH', 'CONTENT_TYPE']}
          titles={['Username', 'Path', 'Content Type']}
          selectedValue={attribute.metadataField}
          setSelectedValue={(metadataField) =>
            setAttribute((prev: any) => ({
              ...prev,
              metadataField: metadataField as MappingAttributeMetadataField,
            }))
          }
          placeholderText="Select Metadata Field"
        />
      </div>

      <div className="h-10">
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

      {attribute.attributeKey && (
        <button
          type="button"
          className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap flex items-center justify-center w-36"
          onClick={addAttributesToMapping}
        >
          Add Attribute
        </button>
      )}

      {attributes && attributes.length > 0 && (
        <>
          <h4 className="text-[10px] font-bold">ADDED ATTRIBUTES:</h4>
          <div className="overflow-y-auto max-h-64">
            <table className="border border-neutral-300 w-full max-w-full table-fixed text-left text-xs">
              <thead className="sticky top-0 bg-neutral-100 border border-neutral-300 ">
                <tr className="border border-neutral-300 px-4 text-neutral-900">
                  <th className="w-4 px-4"> #</th>
                  <th> Key</th>
                  <th> Default Values</th>
                  <th> Source Type</th>
                  <th> Label Matching Type</th>
                  <th> Label Texts</th>
                  <th> Metadata Field</th>
                  <th> Validation Regex</th>
                  <th className="w-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((value, i) => (
                  <tr
                    key={`tag_${i}`}
                    className="border border-neutral-300 px-4 h-12 text-neutral-900"
                  >
                    <td className="text-slate-500 px-4">
                      <span className="text-gray-900 font-medium">{i + 1}</span>
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      <span title={value.attributeKey}>
                        {value.attributeKey}
                      </span>
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.defaultValues && value.defaultValues.join(', ')}
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.sourceType}
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.labelMatchingType}
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.labelTexts && value.labelTexts.join(', ')}
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.metadataField}
                    </td>
                    <td className="text-ellipsis overflow-hidden">
                      {value.validationRegex}
                    </td>
                    <td className="w-[30px]">
                      <button
                        type="button"
                        className="w-4 h-4"
                        onClick={() => deleteAttributeFromMapping(i)}
                      >
                        <Close />
                      </button>
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

export default AddAttributesTab;
