import {Dialog} from '@headlessui/react';
import {useEffect, useRef, useState} from 'react';
import {openDialog as openNotificationDialog} from '../../../Store/reducers/globalNotificationControls';
import {fetchClassifications} from '../../../Store/reducers/schemas';
import {useAppDispatch} from '../../../Store/store';
import {DocumentsService} from '../../../helpers/services/documentsService';
import {Schema} from '../../../helpers/types/schemas';
import {Close, Save} from '../../Icons/icons';
import AddAttributesTab from './addAttributesTab';
import RadioCombobox from "../../Generic/Listboxes/RadioCombobox";
import {useSelector} from "react-redux";
import {AttributesDataState} from "../../../Store/reducers/attributesData";

type CreateCaseModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
};

function CreateSchemaDialog({
                              isOpen,
                              setIsOpen,
                              siteId,
                            }: CreateCaseModalPropsType) {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<'generalInfo' | 'compositeKeys' | 'required' | 'optional'>('generalInfo');


  const initialSchemaValue: Schema = {
    name: '',
    attributes: {
      compositeKeys: [],
      required: [],
      optional: [],
      allowAdditionalAttributes: false,
    },
  };
  const [schema, setSchema] = useState(initialSchemaValue);
  const {allAttributes} = useSelector(AttributesDataState);

  const [compositeKey, setCompositeKey] = useState<string>('');
  const [compositeKeys, setCompositeKeys] = useState<string[]>([]);

  const [requiredKey, setRequiredKey] = useState<string>('');
  const [requiredDefaultValues, setRequiredDefaultValues] = useState<string[]>(
    []
  );
  const [requiredAllowedValue, setRequiredAllowedValue] = useState<string>('');
  const [requiredAllowedValues, setRequiredAllowedValues] = useState<string[]>(
    []
  );

  const [optionalKey, setOptionalKey] = useState<string>('');

  const [optionalAllowedValue, setOptionalAllowedValue] = useState<string>('');
  const [optionalAllowedValues, setOptionalAllowedValues] = useState<string[]>(
    []
  );

  const [attributeKeys, setAttributeKeys] = useState<{ key: string; title: string }[]>([]);
  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({
      key: item.key,
      title: item.key,
    }));
    setAttributeKeys(keys);
  }, [allAttributes]);

  const schemaNameRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();

    const classification = {...schema}
    // remove empty attributes
    if (classification.attributes.compositeKeys && classification.attributes.compositeKeys.length === 0) {
      delete classification.attributes.compositeKeys;
    }
    if (classification.attributes.required && classification.attributes.required.length === 0) {
      delete classification.attributes.required;
    }
    if (classification.attributes.optional && classification.attributes.optional.length === 0) {
      delete classification.attributes.optional;
    }
    // if defaultValues has single item set defaultValue
    // delete empty default values
    if (classification.attributes.required) {
      classification.attributes.required.forEach((item) => {
        if (item.defaultValues && item.defaultValues.length === 1) {
          item.defaultValue = item.defaultValues[0];
          delete item.defaultValues;
        } else if (item.defaultValue==="") {
          delete item.defaultValue;
        } else if (item.defaultValues&&item.defaultValues.length === 0) {
          delete item.defaultValues;
        }
      });
    }
    // delete empty optional attributes
    if (classification.attributes.optional) {
      classification.attributes.optional.forEach((item) => {
        if (item.allowedValues && item.allowedValues.length === 0) {
          delete item.allowedValues;
        }
      });
    }

    DocumentsService.addSiteClassification(siteId, {classification}).then((response) => {
      if (response.classificationId) {
        dispatch(fetchClassifications({siteId, limit: 20, page: 1}));
        setIsOpen(false);
        setSchema(initialSchemaValue);
      } else {
        dispatch(
          openNotificationDialog({dialogTitle: response.errors[0].error})
        );
      }
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setSchema(initialSchemaValue);
  };

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // methods for composite keys
  const addCompositeKey = () => {
    if (compositeKey.length === 0) {
      return;
    }
    setCompositeKeys([...compositeKeys, compositeKey]);
    setCompositeKey('');
  };

  const addCompositeKeyToSchema = () => {

    const newSchema = {...schema};
    if (newSchema.attributes.compositeKeys) {
      newSchema.attributes.compositeKeys = [...newSchema.attributes.compositeKeys, {attributeKeys: compositeKeys}];
    } else {
      newSchema.attributes.compositeKeys = [{attributeKeys: compositeKeys}];
    }

    setSchema(newSchema);
    setCompositeKeys([]);
    setCompositeKey('');
  };

  const deleteCompositeKeyFromSchema = (index: number) => {
    let newCompositeKeys: any[] = [];
    if (schema.attributes.compositeKeys) {
      newCompositeKeys = [...schema.attributes.compositeKeys];
    }
    newCompositeKeys.splice(index, 1);
    setSchema({
      ...schema,
      attributes: {...schema.attributes, compositeKeys: newCompositeKeys},
    });
  };

  // methods for required values
  const addRequiredAllowedValue = () => {
    if (requiredAllowedValue.length === 0) {
      return;
    }

    if (requiredAllowedValues.includes(requiredAllowedValue)) {
      dispatch(openNotificationDialog({dialogTitle: 'Value already exists'}));
      return;
    }

    setRequiredAllowedValues([...requiredAllowedValues, requiredAllowedValue]);
    setRequiredAllowedValue('');
  };

  const addRequiredToSchema = () => {
    if (requiredKey.length === 0) {
      return;
    }

    const newSchema = {...schema};
    const newRequiredAttributes = {
      attributeKey: requiredKey,
      defaultValue: requiredDefaultValues[0] || '',
      defaultValues: requiredDefaultValues,
      allowedValues: requiredAllowedValues
    }
    if (newSchema.attributes.required) {
      newSchema.attributes.required = [...newSchema.attributes.required, newRequiredAttributes];
    } else {
      newSchema.attributes.required = [newRequiredAttributes];
    }
    setSchema(newSchema)
    setRequiredKey('');
    setRequiredDefaultValues([]);
    setRequiredAllowedValues([]);
    setRequiredAllowedValue('');
  };

  const deleteRequiredFromSchema = (index: number) => {
    let newRequired: any[] = [];
    if (schema.attributes.required) {
      newRequired = [...schema.attributes.required];
    }
    newRequired.splice(index, 1);
    setSchema({
      ...schema,
      attributes: {...schema.attributes, required: newRequired},
    });
  };

  // Methods for optional values

  const addOptionalAllowedValue = () => {
    if (optionalAllowedValue.length === 0) {
      return;
    }
    setOptionalAllowedValues([...optionalAllowedValues, optionalAllowedValue]);
    setOptionalAllowedValue('');
  };
  const addOptionalToSchema = () => {
    if (optionalKey.length === 0) {
      return;
    }
    const newSchema = {...schema};
    if (newSchema.attributes.optional) {
      newSchema.attributes.optional = [...newSchema.attributes.optional, {
        attributeKey: optionalKey,
        allowedValues: optionalAllowedValues
      }]
    } else {
      newSchema.attributes.optional = [{attributeKey: optionalKey, allowedValues: optionalAllowedValues}]
    }
    setSchema(newSchema)
    setOptionalKey('');
    setOptionalAllowedValues([]);
    setOptionalAllowedValue('');
  };

  const deleteOptionalFromSchema = (index: number) => {
    let newOptional: any[] = []
    if (schema.attributes.optional) {
      newOptional = [...schema.attributes.optional];
    }
    newOptional.splice(index, 1);
    setSchema({
      ...schema,
      attributes: {...schema.attributes, optional: newOptional},
    });
  };

  return (
    <>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => null}
          className="relative z-20 text-neutral-900"
          static
          initialFocus={schemaNameRef}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white p-6 rounded-md">
              <Dialog.Title className="text-2xl font-bold mb-4">
                Create New Schema
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
                      color:
                        selectedTab === 'generalInfo' ? '#171C26' : '#68758D',
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
                        selectedTab === 'compositeKeys'
                          ? '1px solid #171C26'
                          : '1px solid transparent',
                      color:
                        selectedTab === 'compositeKeys' ? '#171C26' : '#68758D',
                    }}
                    onClick={() => setSelectedTab('compositeKeys')}
                  >
                    COMPOSITE KEYS
                  </button>
                  <button
                    type="button"
                    className="h-8 px-4"
                    style={{
                      borderBottom:
                        selectedTab === 'required'
                          ? '1px solid #171C26'
                          : '1px solid transparent',
                      color: selectedTab === 'required' ? '#171C26' : '#68758D',
                    }}
                    onClick={() => setSelectedTab('required')}
                  >
                    REQUIRED
                  </button>
                  <button
                    type="button"
                    className="h-8 px-4"
                    style={{
                      borderBottom:
                        selectedTab === 'optional'
                          ? '1px solid #171C26'
                          : '1px solid transparent',
                      color: selectedTab === 'optional' ? '#171C26' : '#68758D',
                    }}
                    onClick={() => setSelectedTab('optional')}
                  >
                    OPTIONAL
                  </button>
                </div>

                {selectedTab === 'generalInfo' && (
                  <>
                    <input
                      type="text"
                      className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                      placeholder="Add schema name"
                      required
                      value={schema.name}
                      onChange={(e) =>
                        setSchema({...schema, name: e.target.value})
                      }
                      ref={schemaNameRef}
                      onKeyDown={(e) => preventDialogClose(e)}
                    />
                    <div className="flex items-center">
                      <input
                        id="allowAdditionalAttributes"
                        type="checkbox"
                        checked={schema.attributes.allowAdditionalAttributes}
                        onChange={() =>
                          setSchema({
                            ...schema,
                            attributes: {
                              ...schema.attributes,
                              allowAdditionalAttributes:
                                !schema.attributes.allowAdditionalAttributes,
                            },
                          })
                        }
                        name="allowAdditionalAttributes"
                        className="rounded-md w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-neutral-500 focus:ring-2 text-neutral-900"
                      />
                      <label
                        htmlFor="allowAdditionalAttributes"
                        className="ml-2 text-sm font-medium text-neutral-900"
                      >
                        Allow Additional Attributes
                      </label>
                    </div>
                  </>
                )}

                {selectedTab === 'compositeKeys' && (
                  <>
                    <div className="flex h-10 flex-row justify-between items-center gap-4 text-base">
                      <RadioCombobox
                        values={attributeKeys}
                        selectedValue={compositeKey}
                        setSelectedValue={setCompositeKey}
                        placeholderText="Composite Key"
                      />

                      <button
                        type="button"
                        className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
                        onClick={addCompositeKey}
                      >
                        + Add to Key
                      </button>
                    </div>

                    {compositeKeys.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-start flex-wrap gap-2 ">
                          {compositeKeys.map((key: string) => (
                            <div key={key}
                                 className="bg-neutral-300 py-1.5 px-3 text-xs font-bold text-neutral-900 rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2">
                              <span className="text-ellipsis overflow-hidden">
                                {key}
                              </span>
                              <button
                                title="Remove Composite Key"
                                type="button"
                                className="w-4 h-4 min-w-4 text-neutral-900"
                                onClick={() =>
                                  setCompositeKeys(
                                    compositeKeys.filter(
                                      (k: string) => k !== key
                                    )
                                  )
                                }
                              >
                                <Close/>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap flex items-center justify-center w-36"
                          onClick={addCompositeKeyToSchema}
                        >
                          SAVE KEY
                          <div className="w-5 h-5 ml-2">
                            <Save/>
                          </div>
                        </button>
                      </div>
                    )}

                    {schema.attributes.compositeKeys &&
                      schema.attributes.compositeKeys.length > 0 && (
                        <>
                          <h4 className="text-[10px] font-bold">
                            ADDED COMPOSITE KEYS
                          </h4>
                          <div className="overflow-auto max-h-64">
                            <table className="border border-neutral-300 w-full max-w-full table-fixed">
                              <tbody>
                              {schema.attributes.compositeKeys.map(
                                (item: { attributeKeys: string[] }, i: number) => (
                                  <tr
                                    key={'compositeKey_' + i}
                                    className="border border-slate-300 px-4 h-12"
                                  >
                                    <td className="text-xs text-slate-500 px-4 w-4">
                                        <span className="text-gray-900 font-medium">
                                          {i + 1}
                                        </span>
                                    </td>
                                    <td className="text-xs text-slate-500 px-4 text-ellipsis overflow-hidden">
                                      Values:{' '}
                                      <span className="text-gray-900 font-medium ">
                                          {schema.attributes.compositeKeys &&
                                            schema.attributes.compositeKeys[i].attributeKeys.join(', ')}
                                        </span>
                                    </td>
                                    <td className="w-[30px]">
                                      <button
                                        type="button"
                                        className="w-4 h-4 text-gray-900"
                                        onClick={() =>
                                          deleteCompositeKeyFromSchema(i)
                                        }
                                      >
                                        <Close/>
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
                )}

                {selectedTab === 'required' && (
                  <AddAttributesTab
                    attributeKeys={attributeKeys}
                    tagsKey={requiredKey}
                    setTagsKey={setRequiredKey}
                    preventDialogClose={preventDialogClose}
                    defaultValues={requiredDefaultValues}
                    setDefaultValues={setRequiredDefaultValues}
                    allowedValue={requiredAllowedValue}
                    setAllowedValue={setRequiredAllowedValue}
                    addAllowedValue={addRequiredAllowedValue}
                    allowedValues={requiredAllowedValues}
                    setAllowedValues={setRequiredAllowedValues}
                    addAttributesToSchema={addRequiredToSchema}
                    deleteTagsFromSchema={deleteRequiredFromSchema}
                    attributes={schema.attributes.required}
                    allAttributes={allAttributes}
                  />
                )}
                {selectedTab === 'optional' && (
                  <AddAttributesTab
                    attributeKeys={attributeKeys}
                    tagsKey={optionalKey}
                    setTagsKey={setOptionalKey}
                    preventDialogClose={preventDialogClose}
                    allowedValue={optionalAllowedValue}
                    setAllowedValue={setOptionalAllowedValue}
                    addAllowedValue={addOptionalAllowedValue}
                    allowedValues={optionalAllowedValues}
                    setAllowedValues={setOptionalAllowedValues}
                    addAttributesToSchema={addOptionalToSchema}
                    deleteTagsFromSchema={deleteOptionalFromSchema}
                    attributes={schema.attributes.optional}
                    allAttributes={allAttributes}
                  />
                )}
                <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-10 border border-neutral-900 px-4 rounded-md"
                  >
                    {' '}
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
      )}
    </>
  );
}

export default CreateSchemaDialog;
