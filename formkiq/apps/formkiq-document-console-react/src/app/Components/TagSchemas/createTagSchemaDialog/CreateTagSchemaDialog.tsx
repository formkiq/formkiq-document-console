import {Dialog} from '@headlessui/react'
import {useRef, useState} from "react";
import {useAppDispatch} from "../../../Store/store";
import {fetchTagSchemas} from "../../../Store/reducers/tagSchemas";
import {Close, Save} from "../../Icons/icons";
import {TagSchemaTags} from "../../../helpers/types/tagSchemas";
import {DocumentsService} from "../../../helpers/services/documentsService";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";
import AddTagsTab from "./addTagsTab";

type CreateCaseModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
}

function CreateTagSchemaDialog({isOpen, setIsOpen, siteId}: CreateCaseModalPropsType) {

  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<'generalInfo' | 'compositeKeys' | 'required' | 'optional'>('generalInfo')

  type TagSchemaType = {
    name: string;
    tags: TagSchemaTags;
  }

  const initialTagSchemaValue: TagSchemaType = {
    name: '',
    tags: {
      compositeKeys: [],
      required: [],
      optional: [],
      allowAdditionalTags: false
    }
  }
  const [tagSchema, setTagSchema] = useState(initialTagSchemaValue)

  const [compositeKey, setCompositeKey] = useState<string>("")
  const [compositeKeys, setCompositeKeys] = useState<string[]>([])

  const [requiredKey, setRequiredKey] = useState<string>("")
  const [requiredDefaultValues, setRequiredDefaultValues] = useState<string[]>([])
  const [requiredAllowedValue, setRequiredAllowedValue] = useState<string>("")
  const [requiredAllowedValues, setRequiredAllowedValues] = useState<string[]>([])

  const [optionalKey, setOptionalKey] = useState<string>("")
  const [optionalDefaultValues, setOptionalDefaultValues] = useState<string[]>([])
  const [optionalAllowedValue, setOptionalAllowedValue] = useState<string>("")
  const [optionalAllowedValues, setOptionalAllowedValues] = useState<string[]>([])

  const caseNameRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    DocumentsService.addTagSchema(tagSchema, siteId).then((response) => {
      if (response.tagSchemaId) {
        dispatch(fetchTagSchemas({siteId, limit: 20, page: 1}));
        setIsOpen(false);
        setTagSchema(initialTagSchemaValue);
      } else {
        dispatch(openNotificationDialog({dialogTitle: response.errors[0].error}))
      }
    })
  }

  const closeModal = () => {
    setIsOpen(false);
    setTagSchema(initialTagSchemaValue)
  }

  const preventDialogClose = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  // methods for composite keys
  const addCompositeKey = () => {
    if (compositeKey.length === 0) {
      return
    }
    setCompositeKeys([...compositeKeys, compositeKey])
    setCompositeKey("")
  }

  const addCompositeKeyToSchema = () => {
    setTagSchema({
      ...tagSchema,
      tags: {...tagSchema.tags, compositeKeys: [...tagSchema.tags.compositeKeys, {key: compositeKeys}]}
    })
    setCompositeKeys([])
    setCompositeKey("")
  }

  const deleteCompositeKeyFromSchema = (index: number) => {
    const newCompositeKeys = [...tagSchema.tags.compositeKeys]
    newCompositeKeys.splice(index, 1)
    setTagSchema({
      ...tagSchema,
      tags: {...tagSchema.tags, compositeKeys: newCompositeKeys}
    })
  }

  // methods for required values
  const addRequiredAllowedValue = () => {
    if (requiredAllowedValue.length === 0) {
      return;
    }

    if (requiredAllowedValues.includes(requiredAllowedValue)) {
      dispatch(openNotificationDialog({dialogTitle: "Value already exists"}))
      return;
    }

    setRequiredAllowedValues([...requiredAllowedValues, requiredAllowedValue])
    setRequiredAllowedValue("")
  }

  const addRequiredToSchema = () => {
    if (requiredKey.length === 0) {
      return
    }
    setTagSchema({
      ...tagSchema,
      tags: {
        ...tagSchema.tags,
        required: [...tagSchema.tags.required, {
          key: requiredKey,
          defaultValues: requiredDefaultValues,
          allowedValues: requiredAllowedValues
        }]
      }
    })
    setRequiredKey("")
    setRequiredDefaultValues([])
    setRequiredAllowedValues([])
    setRequiredAllowedValue("")
  }

  const deleteRequiredFromSchema = (index: number) => {
    const newRequired = [...tagSchema.tags.required]
    newRequired.splice(index, 1)
    setTagSchema({
      ...tagSchema,
      tags: {...tagSchema.tags, required: newRequired}
    })
  }

  // Methods for optional values

  const addOptionalAllowedValue = () => {
    if (optionalAllowedValue.length === 0) {
      return
    }
    setOptionalAllowedValues([...optionalAllowedValues, optionalAllowedValue])
    setOptionalAllowedValue("")
  }
  const addOptionalToSchema = () => {
    if (optionalKey.length === 0) {
      return
    }
    setTagSchema({
      ...tagSchema,
      tags: {
        ...tagSchema.tags,
        optional: [...tagSchema.tags.optional, {
          key: optionalKey,
          defaultValues: optionalDefaultValues,
          allowedValues: optionalAllowedValues
        }]
      }
    })
    setOptionalKey("")
    setOptionalDefaultValues([])
    setOptionalAllowedValues([])
    setOptionalAllowedValue("")
  }

  const deleteOptionalFromSchema = (index: number) => {
    const newOptional = [...tagSchema.tags.optional]
    newOptional.splice(index, 1)
    setTagSchema({
      ...tagSchema,
      tags: {...tagSchema.tags, optional: newOptional}
    })
  }

  return (<>{isOpen &&
      <Dialog open={isOpen} onClose={() => null} className="relative z-20 text-neutral-900" static
              initialFocus={caseNameRef}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white p-6 rounded-md">
            <Dialog.Title className="text-2xl font-bold mb-4">
              Create New TagSchema
            </Dialog.Title>
            <form className="flex flex-col gap-4 mt-6" onSubmit={onSubmit}>

              <div className="flex flex-row justify-start gap-2 text-sm font-bold">
                <button type="button" className="h-8 px-4"
                        style={{
                          borderBottom: selectedTab === 'generalInfo' ? '1px solid #171C26' : '1px solid transparent',
                          color: selectedTab === 'generalInfo' ? '#171C26' : '#68758D'
                        }}
                        onClick={() => setSelectedTab('generalInfo')}>
                  GENERAL
                </button>
                <button type="button" className="h-8 px-4"
                        style={{
                          borderBottom: selectedTab === 'compositeKeys' ? '1px solid #171C26' : '1px solid transparent',
                          color: selectedTab === 'compositeKeys' ? '#171C26' : '#68758D'
                        }}
                        onClick={() => setSelectedTab('compositeKeys')}>
                  COMPOSITE KEYS
                </button>
                <button type="button" className="h-8 px-4"
                        style={{
                          borderBottom: selectedTab === 'required' ? '1px solid #171C26' : '1px solid transparent',
                          color: selectedTab === 'required' ? '#171C26' : '#68758D'
                        }}
                        onClick={() => setSelectedTab('required')}>
                  REQUIRED
                </button>
                <button type="button" className="h-8 px-4"
                        style={{
                          borderBottom: selectedTab === 'optional' ? '1px solid #171C26' : '1px solid transparent',
                          color: selectedTab === 'optional' ? '#171C26' : '#68758D'
                        }}
                        onClick={() => setSelectedTab('optional')}>
                  OPTIONAL
                </button>
              </div>

              {selectedTab === 'generalInfo' && <>
                <input type="text" className="h-12 px-4 border border-neutral-300 text-sm rounded-md"
                       placeholder="Add schema name"
                       required value={tagSchema.name}
                       onChange={(e) => setTagSchema({...tagSchema, name: e.target.value})}
                       ref={caseNameRef}
                       onKeyDown={(e) => preventDialogClose(e)}
                />
                <div className="flex items-center">
                  <input id="allowAdditionalTags" type="checkbox" checked={tagSchema.tags.allowAdditionalTags}
                         onChange={() => setTagSchema({
                           ...tagSchema,
                           tags: {...tagSchema.tags, allowAdditionalTags: !tagSchema.tags.allowAdditionalTags}
                         })}
                         name="allowAdditionalTags"
                         className="rounded-md w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-neutral-500 focus:ring-2 text-neutral-900"/>
                  <label htmlFor="allowAdditionalTags" className="ml-2 text-sm font-medium text-neutral-900">Allow
                    Additional Tags</label>
                </div>
              </>}

              {selectedTab === 'compositeKeys' && <>
                <div className="flex flex-row justify-between items-center gap-4 text-base">
                  <input type="text"
                         className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                         placeholder="Composite Key"
                         value={compositeKey}
                         onChange={(e) => setCompositeKey(e.target.value)}
                         onKeyDown={(e) => preventDialogClose(e)}/>

                  <button type="button"
                          className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
                          onClick={addCompositeKey}>+ ADD
                  </button>
                </div>

                {compositeKeys.length > 0 && <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-start flex-wrap gap-2 ">
                    {compositeKeys.map((key: string) => (<div
                      className="bg-neutral-300 py-1.5 px-3 text-xs font-bold uppercase text-neutral-900 rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2">
                      <span className="text-ellipsis overflow-hidden">{key}</span>
                      <button title="Remove Composite Key" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                              onClick={() => setCompositeKeys(compositeKeys.filter((k: string) => k !== key))}><Close/>
                      </button>
                    </div>))}
                  </div>
                  <button type='button'
                          className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap flex items-center justify-center w-36"
                          onClick={addCompositeKeyToSchema}>
                    SAVE KEY <div className="w-5 h-5 ml-2"><Save/></div>
                  </button>
                </div>}

                {tagSchema.tags.compositeKeys && tagSchema.tags.compositeKeys.length > 0 && <>
                  <h4 className="text-[10px] font-bold">ADDED COMPOSITE KEYS</h4>
                  <div className="overflow-auto max-h-64">
                    <table className="border border-neutral-300 w-full max-w-full table-fixed">
                      <tbody>
                      {tagSchema.tags.compositeKeys.map((item: { key: string[] }, i: number) => (
                        <tr key={"compositeKey_" + i} className="border border-slate-300 px-4 h-12">
                          <td className="text-xs text-slate-500 px-4 w-4"><span
                            className="text-gray-900 font-medium">{i + 1}</span></td>
                          <td className="text-xs text-slate-500 px-4 text-ellipsis overflow-hidden">Values: <span
                            className="text-gray-900 font-medium ">{tagSchema.tags.compositeKeys[i].key.join(", ")}</span>
                          </td>
                          <td className="w-[30px]">
                            <button type="button" className="w-4 h-4 text-gray-900"
                                    onClick={() => deleteCompositeKeyFromSchema(i)}
                            ><Close/></button>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </>
                }
              </>}

              {selectedTab === 'required' && <AddTagsTab tagsKey={requiredKey}
                                                         setTagsKey={setRequiredKey}
                                                         preventDialogClose={preventDialogClose}
                                                         defaultValues={requiredDefaultValues}
                                                         setDefaultValues={setRequiredDefaultValues}
                                                         allowedValue={requiredAllowedValue}
                                                         setAllowedValue={setRequiredAllowedValue}
                                                         addAllowedValue={addRequiredAllowedValue}
                                                         allowedValues={requiredAllowedValues}
                                                         setAllowedValues={setRequiredAllowedValues}
                                                         addTagsToSchema={addRequiredToSchema}
                                                         deleteTagsFromSchema={deleteRequiredFromSchema}
                                                         tags={tagSchema.tags.required}
              />}
              {selectedTab === 'optional' && <AddTagsTab tagsKey={optionalKey}
                                                         setTagsKey={setOptionalKey}
                                                         preventDialogClose={preventDialogClose}
                                                         defaultValues={optionalDefaultValues}
                                                         setDefaultValues={setOptionalDefaultValues}
                                                         allowedValue={optionalAllowedValue}
                                                         setAllowedValue={setOptionalAllowedValue}
                                                         addAllowedValue={addOptionalAllowedValue}
                                                         allowedValues={optionalAllowedValues}
                                                         setAllowedValues={setOptionalAllowedValues}
                                                         addTagsToSchema={addOptionalToSchema}
                                                         deleteTagsFromSchema={deleteOptionalFromSchema}
                                                         tags={tagSchema.tags.optional}/>

              }
              <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
                <button type="button" onClick={closeModal}
                        className="h-10 border border-neutral-900 px-4 rounded-md"> CANCEL
                </button>
                <button type="submit"
                        className="h-10 bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 hover:from-primary-500 hover:via-secondary-500 hover:to-primary-600 text-white px-4 rounded-md">+
                  CREATE
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>}</>
  );
}

export default CreateTagSchemaDialog;
