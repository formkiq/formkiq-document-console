import { Close, Pencil } from '../../../Icons/icons';
import { useState } from 'react';
import {
  MappingAttributeLabelMatchingType,
  MappingAttributeMetadataField,
  MappingAttributeSourceType,
} from '../../../../helpers/types/mappings';
import ButtonPrimary from '../../../Generic/Buttons/ButtonPrimary';
import ButtonTertiary from '../../../Generic/Buttons/ButtonTertiary';
import AttributeForm from '../AttributeForm';

type AttributesTabProps = {
  siteId: string;
  attribute: {
    attributeKey: string;
    defaultValue: string;
    defaultValues: string[];
    sourceType?: MappingAttributeSourceType;
    labelText: string;
    labelTexts: string[];
    labelMatchingType?: MappingAttributeLabelMatchingType;
    metadataField?: MappingAttributeMetadataField;
    validationRegex: string;
  };
  setAttribute: (attribute: any) => void;
  addDefaultValue: () => void;
  addAttributesToMapping: () => void;
  updateAttributeInMapping: (index: number) => 'failed' | 'success';
  resetAttribute: () => void;
  deleteAttributeFromMapping: (index: number) => void;
  attributes: any[];
  addLabelText: () => void;
};

function AttributesTab({
  siteId,
  attribute,
  setAttribute,
  addDefaultValue,
  addAttributesToMapping,
  updateAttributeInMapping,
  resetAttribute,
  deleteAttributeFromMapping,
  attributes,
  addLabelText,
}: AttributesTabProps) {
  const [editingAttributeIndex, setEditingAttributeIndex] = useState(-1);

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
      <AttributeForm
        siteId={siteId}
        attribute={attribute}
        setAttribute={setAttribute}
        addDefaultValue={addDefaultValue}
        addLabelText={addLabelText}
      />

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
