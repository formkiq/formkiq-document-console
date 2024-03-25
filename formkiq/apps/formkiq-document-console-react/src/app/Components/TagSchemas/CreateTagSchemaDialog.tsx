import {Dialog} from '@headlessui/react'
import {useRef, useState} from "react";
import {useAppDispatch} from "../../Store/store";
import {addTagSchema} from "../../Store/reducers/tagSchemas";
import {Close} from "../Icons/icons";


type CreateCaseModalPropsType = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  siteId: string;
}

function CreateTagSchemaDialog({isOpen, setIsOpen, siteId}: CreateCaseModalPropsType) {

  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState<'generalInfo' | 'compositeKeys' | 'required' | 'optional'>('generalInfo')
  const initialTagSchemaValue = {
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
  const [compositeKeys, setCompositeKeys] = useState<string[]>(["test", "test2", "test3"])

  const caseNameRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const data = {case: tagSchema}
    dispatch(addTagSchema({siteId, caseValue: data}))

    setIsOpen(false);
    setTagSchema(initialTagSchemaValue);

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

  const addCompositeKey = () => {
    // setTagSchema({
    //   ...tagSchema,
    //   tags: {...tagSchema.tags, compositeKeys: [...tagSchema.tags.compositeKeys, {key: compositeKey}]}
    // })
    // setCompositeKey([])
    setCompositeKeys([...compositeKeys, compositeKey])
    setCompositeKey("")
  }


  return (<>{isOpen &&
      <Dialog open={isOpen} onClose={() => null} className="relative z-50 text-neutral-900" static
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
                {/*<textarea rows={3} className=" px-4 border border-slate-300 text-sm" placeholder="Add Description..."*/}
                {/*          value={caseValue.description}*/}
                {/*          onChange={(e) => setCaseValue({...caseValue, description: e.target.value})}/>*/}
              </>}

              {selectedTab === 'compositeKeys' && <>

                {/*<input type="text" className="h-12 px-4 border border-slate-300 text-sm" placeholder="Value (optional)"*/}
                {/*       value={compositeKey.value}*/}
                {/*       onChange={(e) => setCompositeKey({...compositeKey, value: e.target.value})}*/}
                {/*       onKeyDown={(e) => preventDialogClose(e)}/>*/}
                <div className="flex flex-row justify-between items-center gap-4 text-base">
                  {/*<p className="text-xs text-slate-500 font-medium">You can add multiple values by separating each value*/}
                  {/*  with a comma</p>*/}<input type="text" className="h-10 px-4 border border-neutral-300 text-sm rounded-md w-full"
                                                 placeholder="Composite Key (optional)"
                                                 value={compositeKey}
                                                 onChange={(e) => setCompositeKey(e.target.value)}
                                                 onKeyDown={(e) => preventDialogClose(e)}/>

                  <button type="button" className="h-10 rounded-md border border-primary-500 text-neutral-900 hover:text-primary-500 px-4 font-bold whitespace-nowrap"
                          onClick={addCompositeKey}>+ ADD VALUE
                  </button>
                </div>

                {compositeKeys.length > 0 && <>
                  <div className="flex flex-row justify-start flex-wrap gap-2 ">
                      {compositeKeys.map((key: string) => (<div
                          className="bg-neutral-300 py-1.5 px-3 text-xs font-bold uppercase text-neutral-900 rounded-md text-ellipsis overflow-hidden whitespace-nowrap">
                          <span className="">{key}</span>
                      </div>))}
                  </div></>}


                {/*{tagSchema.tags.compositeKeys && Object.keys(tagSchema.tags.compositeKeys).length > 0 && <>*/}
                {/*  <h4 className="text-[10px] font-bold">ADDED</h4>*/}
                {/*  <div className="overflow-auto max-h-64">*/}
                {/*    <table className="border border-slate-300  w-full">*/}
                {/*      <tbody>*/}
                {/*      {Object.keys(tagSchema.tags.compositeKeys).map((key: string) => (*/}
                {/*        <tr key={key} className="border border-slate-300 px-4 h-12">*/}
                {/*          <td className="text-xs text-slate-500 px-4">Key: <span*/}
                {/*            className="text-gray-900 font-medium">{key}</span></td>*/}
                {/*          <td className="text-xs text-slate-500 px-4">Value: <span*/}
                {/*            className="text-gray-900 font-medium">{tagSchema.tags.compositeKeys[key]}</span></td>*/}
                {/*          <td className="w-[30px]">*/}
                {/*            <div className="w-4 h-4 text-gray-900"><Close/></div>*/}
                {/*          </td>*/}
                {/*        </tr>*/}
                {/*      ))}*/}
                {/*      </tbody>*/}
                {/*    </table>*/}
                {/*  </div>*/}
                {/*</>*/}
                {/*}*/}
              </>}


              <div className="flex flex-row justify-end gap-4 text-base font-bold mt-4">
                <button type="button" onClick={closeModal}
                        className="h-10 border border-neutral-900 px-4 rounded-md"> CANCEL
                </button>
                <button type="submit" className="h-10 bg-primary-500 text-white px-4 rounded-md">+ CREATE CASE
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>}</>
  );
}


export default CreateTagSchemaDialog;
