import { Close } from '../../Icons/icons';
import RadioCombobox from '../../Generic/Listboxes/RadioCombobox';
import { useEffect } from 'react';
import ButtonSecondary from '../../Generic/Buttons/ButtonSecondary';

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
  addAttributesToSchema: () => void;
  deleteTagsFromSchema: (index: number) => void;
  attributes: any;
  allAttributes: any[];
  attributeType: 'required' | 'optional';
};

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
}: AddTagsTabProps) {
  const toggleAddToDefault = (event: any, key: string) => {
    if (!defaultValues) return;
    if (!setDefaultValues) return;
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
    if (!defaultValues) return;
    if (!setDefaultValues) return;
    setDefaultValues(defaultValues.filter((k: string) => k !== key));
  };

  useEffect(() => {
    if (allowedValue) return;
    // if boolean value, set allowedValue to false
    if (
      allAttributes.find((a: any) => a.key === tagsKey)?.dataType === 'BOOLEAN'
    ) {
      setAllowedValue('false');
    }
    // if number value, set allowedValue to 0
    if (
      allAttributes.find((a: any) => a.key === tagsKey)?.dataType === 'NUMBER'
    ) {
      setAllowedValue('0');
    }
    // if string value, set allowedValue to empty string
    if (
      allAttributes.find((a: any) => a.key === tagsKey)?.dataType === 'STRING'
    ) {
      setAllowedValue('');
    }
  }, [tagsKey, allowedValue]);

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
            {allAttributes.find((a: any) => a.key === tagsKey)?.dataType}
          </div>
        )}
      </div>

      {tagsKey &&
        allAttributes.find((a: any) => a.key === tagsKey)?.dataType !==
          'KEY_ONLY' && (
          <>
            <div className="flex flex-row justify-between items-center gap-4 text-base">
              {allAttributes.find((a: any) => a.key === tagsKey)?.dataType ===
                'STRING' && (
                <input
                  type="text"
                  className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                  placeholder="Allowed Value"
                  value={allowedValue}
                  onChange={(e) => setAllowedValue(e.target.value)}
                  onKeyDown={(e) => preventDialogClose(e)}
                />
              )}
              {allAttributes.find((a: any) => a.key === tagsKey)?.dataType ===
                'NUMBER' && (
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
              {allAttributes.find((a: any) => a.key === tagsKey)?.dataType ===
                'BOOLEAN' && (
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
                    Allowed Values{' '}
                  </p>
                  {defaultValues && (
                    <p className="text-xs text-neutral-500 font-medium">
                      (click to add select default value)
                    </p>
                  )}
                </div>
                <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                  {allowedValues.map((key: string, i) => (
                    <div
                      key={'allowed_' + i}
                      onClick={(e) => {
                        defaultValues ? toggleAddToDefault(e, key) : () => {};
                      }}
                      title={
                        defaultValues
                          ? defaultValues.includes(key)
                            ? 'Remove from Default Values'
                            : 'Add to Default Values'
                          : ''
                      }
                      className={
                        'cursor-pointer py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border' +
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
                    defaultValues.map((key: string, i) => (
                      <div
                        key={'default_' + i}
                        className="border border-neutral-500 text-neutral-900 py-1.5 px-3 text-xs font-bold uppercase text-neutral-900 rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2"
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
        <div className="h-8 flex">
          <ButtonSecondary type="button" onClick={addAttributesToSchema}>
            ADD ATTRIBUTE
          </ButtonSecondary>
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
                  {attributeType === 'required' && <th> Default Values</th>}
                  <th> Allowed Values</th>
                  <th className="w-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {attributes.map(
                  (
                    value: {
                      attributeKey: string;
                      defaultValue?: string;
                      defaultValues?: string[];
                      allowedValues?: string[];
                    },
                    i: number
                  ) => (
                    <tr
                      key={'tag_' + i}
                      className="border border-neutral-300 px-4 h-12 text-neutral-900"
                    >
                      <td className="text-sm text-slate-500 px-4">
                        <span className="text-gray-900 font-medium">
                          {i + 1}
                        </span>
                      </td>
                      <td className="text-sm text-ellipsis overflow-hidden">
                        {value.attributeKey}
                      </td>
                      {attributeType === 'required' && (
                        <td className="text-sm text-ellipsis overflow-hidden">
                          {value.defaultValues &&
                            value.defaultValues.join(', ')}
                          {value.defaultValue}
                        </td>
                      )}
                      <td className="text-sm  text-ellipsis overflow-hidden">
                        {value.allowedValues && value.allowedValues.join(', ')}
                      </td>
                      <td className="w-[30px]">
                        <button
                          type="button"
                          className="w-4 h-4"
                          onClick={() => deleteTagsFromSchema(i)}
                        >
                          <Close />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default AddAttributesTab;
