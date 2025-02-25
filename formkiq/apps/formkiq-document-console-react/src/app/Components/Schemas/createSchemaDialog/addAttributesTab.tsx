import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import ButtonSecondary from '../../Generic/Buttons/ButtonSecondary';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import { Close, Pencil } from '../../Icons/icons';

type AddTagsTabProps = {
  attributeKeys: { key: string; title: string }[];
  tagsKey: string;
  setTagsKey: (key: string) => void;
  preventDialogClose: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  defaultValues?: string[];
  setDefaultValues?: (keys: string[]) => void;
  allowedValue: string;
  setAllowedValue: (key: string) => void;
  addAllowedValue: () => void;
  allowedValues: string[];
  setAllowedValues: (keys: string[]) => void;
  addAttributesToSchema: (config?: {
    minNumberOfValues: number;
    maxNumberOfValues: number;
  }) => void;
  deleteTagsFromSchema: (index: number) => void;
  attributes: any;
  allAttributes: any[];
  attributeType: 'required' | 'optional';
  minNumberOfValues: number;
  setMinNumberOfValues: (value: number) => void;
  maxNumberOfValues: number;
  setMaxNumberOfValues: (value: number) => void;
  editAttribute: (index: number) => void;
};

type ValidationMessage = {
  text: string;
  type: 'error' | 'warning';
} | null;

function AddAttributesTab({
  attributeKeys,
  tagsKey,
  setTagsKey,
  preventDialogClose,
  defaultValues,
  setDefaultValues,
  allowedValue,
  setAllowedValue,
  addAllowedValue,
  allowedValues,
  setAllowedValues,
  addAttributesToSchema,
  deleteTagsFromSchema,
  attributes,
  allAttributes,
  attributeType,
  minNumberOfValues,
  setMinNumberOfValues,
  maxNumberOfValues,
  setMaxNumberOfValues,
  editAttribute,
}: AddTagsTabProps) {
  // Create a lookup map for attributes using their key.
  const attributeMap = useMemo(() => {
    return allAttributes.reduce((acc: Record<string, any>, attr: any) => {
      acc[attr.key] = attr;
      return acc;
    }, {} as Record<string, any>);
  }, [allAttributes]);

  const [validationMsg, setValidationMsg] = useState<ValidationMessage>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleCancel = () => {
    // Clear form fields
    setTagsKey('');
    setMinNumberOfValues(0);
    setMaxNumberOfValues(-1);
    setAllowedValue('');
    setAllowedValues([]);
    if (setDefaultValues) setDefaultValues([]);
    setEditingIndex(null);
  };

  const validateNumberOfValues = useCallback(() => {
    if (minNumberOfValues === 0 && maxNumberOfValues === -1) {
      setValidationMsg(null);
      return true;
    }
    if (minNumberOfValues === 1 && maxNumberOfValues === -1) {
      setValidationMsg({
        text: 'Setting rejected: Use required/optional check when minimum is 1.',
        type: 'error',
      });
      return false;
    }
    if (minNumberOfValues === 0 && maxNumberOfValues === 1) {
      setValidationMsg({
        text: 'Note: With a max of 1, only single values (not arrays) will be allowed.',
        type: 'warning',
      });
      return true;
    }
    if (maxNumberOfValues !== -1 && minNumberOfValues > maxNumberOfValues) {
      setValidationMsg({
        text: 'Invalid: Minimum cannot be greater than Maximum.',
        type: 'error',
      });
      return false;
    }
    setValidationMsg(null);
    return true;
  }, [maxNumberOfValues, minNumberOfValues]);

  useEffect(() => {
    validateNumberOfValues();
  }, [minNumberOfValues, maxNumberOfValues, validateNumberOfValues]);

  const handleAddAttributes = () => {
    if (!validateNumberOfValues()) return;
    if (editingIndex !== null) {
      editAttribute(editingIndex);
      setEditingIndex(null);
    } else {
      addAttributesToSchema({
        minNumberOfValues,
        maxNumberOfValues,
      });
    }
    // Clear form fields
    setTagsKey('');
    setMinNumberOfValues(0);
    setMaxNumberOfValues(-1);
    setAllowedValue('');
    setAllowedValues([]);
    if (setDefaultValues) setDefaultValues([]);
  };

  const handleEditClick = (index: number) => {
    const attribute = attributes[index];
    setTagsKey(attribute.attributeKey);
    setMinNumberOfValues(attribute.minNumberOfValues || 0);
    setMaxNumberOfValues(attribute.maxNumberOfValues ?? -1);
    setAllowedValues(attribute.allowedValues || []);
    if (setDefaultValues) {
      setDefaultValues(attribute.defaultValues || []);
    }
    setEditingIndex(index);
  };

  const toggleAddToDefault = (event: any, key: string) => {
    if (!defaultValues || !setDefaultValues) return;
    event.stopPropagation();
    if (defaultValues.includes(key)) {
      setDefaultValues(defaultValues.filter((k: string) => k !== key));
    } else {
      setDefaultValues(defaultValues.concat(key));
    }
  };

  const deleteAllowedValue = (event: any, key: string) => {
    event.stopPropagation();
    setAllowedValues(allowedValues.filter((k: string) => k !== key));
    if (!defaultValues || !setDefaultValues) return;
    setDefaultValues(defaultValues.filter((k: string) => k !== key));
  };

  useEffect(() => {
    if (allowedValue) return;
    const currentAttr = attributeMap[tagsKey];
    if (!currentAttr) return;
    if (currentAttr.dataType === 'BOOLEAN') {
      setAllowedValue('false');
    }
    if (currentAttr.dataType === 'NUMBER') {
      setAllowedValue('0');
    }
    if (currentAttr.dataType === 'STRING') {
      setAllowedValue('');
    }
  }, [tagsKey, allowedValue, attributeMap, setAllowedValue]);

  return (
    <>
      <div className="flex flex-row items-center gap-4 text-base h-10 max-w-[550px]">
        <RadioCombobox
          values={attributeKeys}
          selectedValue={tagsKey}
          setSelectedValue={setTagsKey}
          placeholderText="Key"
        />
        {tagsKey && (
          <div className="text-xs bg-neutral-100 rounded-md font-bold h-10 p-3 text-center whitespace-nowrap">
            {attributeMap[tagsKey]?.dataType || ''}
          </div>
        )}
      </div>

      {/* Show numeric steppers for data types that support multiple values */}
      {tagsKey &&
        attributeMap[tagsKey]?.dataType !== 'KEY_ONLY' &&
        attributeMap[tagsKey]?.dataType !== 'BOOLEAN' &&
        attributeMap[tagsKey]?.dataType !== 'WATERMARK' && (
          <div className="flex flex-col gap-4 my-4">
            <div>
              <label className="font-bold text-sm block">
                Min Number of Values
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-24"
                  min="0"
                  value={minNumberOfValues}
                  onChange={(e) =>
                    setMinNumberOfValues(parseInt(e.target.value) || 0)
                  }
                />
                {minNumberOfValues === 0 && (
                  <span className="text-xs text-gray-500">No Minimum</span>
                )}
              </div>
            </div>

            <div>
              <label className="font-bold text-sm block">
                Max Number of Values
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-24"
                  min="-1"
                  value={maxNumberOfValues}
                  onChange={(e) =>
                    setMaxNumberOfValues(parseInt(e.target.value))
                  }
                />
                {maxNumberOfValues === -1 && (
                  <span className="text-xs text-gray-500">No Maximum</span>
                )}
              </div>
            </div>
            {validationMsg && (
              <p
                className={`text-xs ${
                  validationMsg.type === 'error' ? 'text-red-500' : 'text-black'
                }`}
              >
                {validationMsg.text}
              </p>
            )}
          </div>
        )}

      {tagsKey &&
        attributeMap[tagsKey]?.dataType !== 'KEY_ONLY' &&
        attributeMap[tagsKey]?.dataType !== 'WATERMARK' && (
          <>
            <div className="font-bold text-sm">
              Allowed Values
              <span className="text-xs block">
                (adding allowed values limits options; to allow any value, leave
                empty)
              </span>
            </div>
            <div className="flex flex-row justify-between items-center gap-4 text-base">
              {attributeMap[tagsKey]?.dataType === 'STRING' && (
                <input
                  type="text"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Allowed Value"
                  value={allowedValue}
                  onChange={(e) => setAllowedValue(e.target.value)}
                  onKeyDown={(e) => preventDialogClose(e)}
                />
              )}
              {attributeMap[tagsKey]?.dataType === 'NUMBER' && (
                <input
                  type="number"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Allowed Value"
                  value={Number(allowedValue)}
                  step="any"
                  onChange={(e) => setAllowedValue(e.target.value.toString())}
                  onKeyDown={(e) => preventDialogClose(e)}
                />
              )}
              {attributeMap[tagsKey]?.dataType === 'BOOLEAN' && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                    checked={allowedValue === 'true'}
                    onChange={(e) =>
                      setAllowedValue(e.target.checked ? 'true' : 'false')
                    }
                  />
                  <label className="text-sm">
                    {allowedValue === 'true' ? 'TRUE' : 'FALSE'}
                  </label>
                </div>
              )}

              <button
                type="button"
                className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
                onClick={addAllowedValue}
              >
                + ADD
              </button>
            </div>

            {allowedValues.length > 0 && (
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-sm text-neutral-900 font-medium">
                    Allowed Values
                  </p>
                  {defaultValues && (
                    <p className="text-xs text-neutral-500 font-medium">
                      (click to toggle default)
                    </p>
                  )}
                </div>
                <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                  {allowedValues.map((key: string, i: number) => (
                    <div
                      key={'allowed_' + i}
                      onClick={(e) => {
                        if (defaultValues) {
                          toggleAddToDefault(e, key);
                        }
                      }}
                      title={
                        defaultValues
                          ? defaultValues.includes(key)
                            ? 'Remove from Default Values'
                            : 'Add to Default Values'
                          : ''
                      }
                      className={
                        'cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border' +
                        (defaultValues && defaultValues.includes(key)
                          ? ' text-primary-500 border-primary-500 bg-neutral-100'
                          : ' border-neutral-500 text-neutral-900')
                      }
                    >
                      <span className="text-ellipsis overflow-hidden">
                        {key}
                      </span>
                      <button
                        title="Remove Value"
                        type="button"
                        className="w-4 h-4 min-w-4 text-neutral-900"
                        onClick={(e) => deleteAllowedValue(e, key)}
                      >
                        <Close />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {defaultValues && setDefaultValues && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-neutral-900 font-medium">
                  Default Values:{' '}
                </p>
                <div className="flex flex-row justify-start flex-wrap gap-2 items-end max-h-[100px] overflow-auto">
                  {defaultValues.length === 0 ? (
                    <p className="text-xs text-neutral-500 font-medium">
                      No default value selected
                    </p>
                  ) : (
                    defaultValues.map((key: string, i: number) => (
                      <div
                        key={'default_' + i}
                        className="border border-neutral-500 text-neutral-900 py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2"
                      >
                        <span className="text-ellipsis overflow-hidden">
                          {key}
                        </span>
                        <button
                          title="Remove Value"
                          type="button"
                          className="w-4 h-4 min-w-4 text-neutral-900"
                          onClick={() =>
                            setDefaultValues(
                              defaultValues.filter((k: string) => k !== key)
                            )
                          }
                        >
                          <Close />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

      {tagsKey.length > 0 && (
        <div className="flex w-full">
          <ButtonSecondary
            className="w-1/2"
            type="button"
            onClick={handleAddAttributes}
          >
            {editingIndex !== null ? 'SAVE CHANGES' : 'ADD ATTRIBUTE'}
          </ButtonSecondary>
          <ButtonGhost className="w-1/2" type="button" onClick={handleCancel}>
            Cancel
          </ButtonGhost>
        </div>
      )}

      {attributes && attributes.length > 0 && (
        <>
          <h4 className="text-[10px] font-bold">ADDED</h4>
          <div className="overflow-y-auto max-h-64">
            <table className="border border-neutral-300 w-full max-w-full table-fixed text-left">
              <thead className="sticky top-0 bg-neutral-100 text-sm border border-neutral-300 ">
                <tr className="border border-neutral-300 px-4 text-neutral-900">
                  <th className="w-4 px-4"> #</th>
                  <th> Key</th>
                  <th> Default Value(s)</th>
                  <th> Min / Max Num Values</th>
                  <th> Allowed Values</th>
                  <th className="w-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((value: any, i: number) => (
                  <tr
                    key={'tag_' + i}
                    className="border border-neutral-300 px-4 h-12 text-neutral-900 relative"
                  >
                    <td className="text-sm text-slate-500 px-4">
                      <span className="text-gray-900 font-medium">{i + 1}</span>
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {value.attributeKey}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {attributeMap[value.attributeKey]?.dataType ===
                        'STRING' ||
                      attributeMap[value.attributeKey]?.dataType === 'NUMBER' ||
                      attributeMap[value.attributeKey]?.dataType ===
                        'BOOLEAN' ? (
                        <>
                          {value.defaultValues &&
                            value.defaultValues.join(', ')}
                          {value.defaultValue}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden">
                      {attributeMap[value.attributeKey]?.dataType ===
                        'STRING' ||
                      attributeMap[value.attributeKey]?.dataType ===
                        'NUMBER' ? (
                        <>
                          MIN: {value.minNumberOfValues} / MAX:{' '}
                          {value.maxNumberOfValues}
                        </>
                      ) : (
                        'n/a'
                      )}
                    </td>
                    <td className="text-sm text-ellipsis overflow-hidden w-40">
                      {value.allowedValues && value.allowedValues.length > 0 ? (
                        value.allowedValues.join(', ')
                      ) : attributeMap[value.attributeKey]?.dataType ===
                          'STRING' ||
                        attributeMap[value.attributeKey]?.dataType ===
                          'NUMBER' ||
                        attributeMap[value.attributeKey]?.dataType ===
                          'BOOLEAN' ? (
                        <>{value.allowedValues.join(', ')}</>
                      ) : (
                        'n/a'
                      )}
                    </td>

                    <td className="flex items-center gap-2 h-12 absolute right-2">
                      {editingIndex === i ? (
                        <div className="p-1 bg-primary-100 text-primary-900 rounded-md text-xs font-bold whitespace-nowrap">
                          <p>EDITING NOW</p>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500"
                            onClick={() => handleEditClick(i)}
                          >
                            <Pencil />
                          </button>
                          <button
                            type="button"
                            className="w-4 h-4 min-w-4 text-neutral-900 hover:text-primary-500"
                            onClick={() => deleteTagsFromSchema(i)}
                          >
                            <Close />
                          </button>
                        </>
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

export default AddAttributesTab;
