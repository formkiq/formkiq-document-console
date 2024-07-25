import {DocumentAttribute} from "../../../helpers/types/attributes";
import {Check, Close, Pencil, Plus, Trash} from "../../Icons/icons";
import {useEffect, useState} from "react";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import {useAppDispatch} from "../../../Store/store";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";

function AttributesList({
                          attributes,
                          handleScroll,
                          deleteDocumentAttribute,
                          editAttribute
                        }: {
  attributes: DocumentAttribute[],
  handleScroll: (event: any) => void,
  deleteDocumentAttribute: (key: string) => void,
  editAttribute: (key: string, newValue: any) => void
}) {
  const dispatch = useAppDispatch()
  const [editAttributeKey, setEditAttributeKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any[]>([]);
  const [newValue, setNewValue] = useState<string | number | boolean>('');
  const [isAddingValue, setIsAddingValue] = useState<boolean>(false);

  function handleEditAttribute(attribute: DocumentAttribute) {
    setEditAttributeKey(attribute.key);
    if (attribute?.stringValue) {
      setEditValue([]);
      setNewValue(attribute.stringValue);
      setIsAddingValue(true);
    } else if (attribute?.stringValues) {
      setEditValue(attribute.stringValues);
    } else if (attribute.numberValue !== undefined) {
      setEditValue([]);
      setNewValue(attribute.numberValue);
      setIsAddingValue(true);
    } else if (attribute?.numberValues) {
      setEditValue(attribute.numberValues);
    } else if (attribute.booleanValue !== undefined) {
      setEditValue([]);
      setNewValue(attribute.booleanValue);
    }
  }

  function deleteValue(event: any, value: string | number) {
    setEditValue(editValue.filter((item: string | number) => item !== value))
  }

  function reset() {
    setEditAttributeKey(null)
    setEditValue([])
  }

  function saveEditAttribute(attribute: DocumentAttribute) {
    const newAttributeValue: { attribute: DocumentAttribute } = {
      attribute: {
        key: attribute.key,
      }
    }
    if (attribute?.stringValue) {
        if (editValue.length === 1) {
          newAttributeValue.attribute.stringValue = editValue[0].toString()
        } else if (editValue.length > 1) {
          newAttributeValue.attribute.stringValues = editValue
        } else {
          dispatch(openNotificationDialog({
            dialogTitle: "Error updating attribute. At least one value is required for the attribute."
          }))
          return;
        }
    }
    if (attribute?.stringValues) {
      if (editValue.length > 1) {
        newAttributeValue.attribute.stringValues = editValue
      } else if (editValue.length === 1) {
        newAttributeValue.attribute.stringValue = editValue[0].toString()
      } else {
        dispatch(openNotificationDialog({
          dialogTitle: "Error updating attribute. At least one value is required for the attribute."
        }))
        return;
      }
    }
    if (attribute?.numberValue !== undefined) {
        if (editValue.length === 1) {
          newAttributeValue.attribute.numberValue = editValue[0]
        } else if (editValue.length > 1) {
          newAttributeValue.attribute.numberValues = editValue
        } else {
          dispatch(openNotificationDialog({
            dialogTitle: "Error updating attribute. At least one value is required for the attribute."
          }))
          return;
        }
    }
    if (attribute?.numberValues) {
      if (editValue.length > 1) {
        newAttributeValue.attribute.numberValues = editValue
      } else if (editValue.length === 1) {
        newAttributeValue.attribute.numberValue = editValue[0]
      } else {
        dispatch(openNotificationDialog({
          dialogTitle: "Error updating attribute. At least one value is required for the attribute."
        }))
        return;
      }
    }
    if (attribute?.booleanValue !== undefined) {
      newAttributeValue.attribute.booleanValue = newValue as boolean;
    }
    editAttribute(attribute.key, newAttributeValue);
    reset()
  }

  const AddNewValueButton = () => {
    return (
      <button title="Add Value" type="button"
              className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
              onClick={() => setIsAddingValue(true)}>
        <Plus/>
      </button>
    )
  }

  const ConfirmAddNewValueButton = () => {
    function handleAddValue() {
      if (newValue === '') return;
      if (editValue.includes(newValue)){
          dispatch(openNotificationDialog({
              dialogTitle: "Error adding new value. Value already exists."
          }))
          return;
      };
      setEditValue([...editValue, newValue]);
      setNewValue('');
      setIsAddingValue(false);
    }
    return (
      <button title="Confirm" type="button"
              className="text-green-500 border-green-500 w-6 h-6 flex items-center justify-center rounded-full p-0.5 border"
              onClick={handleAddValue}>
        <Check/>
      </button>
    )
  }

  const CancelAddNewValueButton = () => {
    const cancelAddValue = () => {
      setNewValue('')
      setIsAddingValue(false)
    }
    return (
      <button title="Cancel" type="button" className="text-red-500 border-red-500 w-6 h-6 flex items-center justify-center rounded-full p-1 border"
              onClick={cancelAddValue}>
        <Close/>
      </button>
    )
  }

  return (
    <div>
      {attributes.length > 0 ? (
        <div className="overflow-y-auto max-h-64" onScroll={handleScroll}>
          <table
            className="max-w-full table-fixed border border-neutral-300 border-collapse table-auto w-full max-w-full text-sm"
            id="documentAttributesScrollPane">
            <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
            <tr>
              <th
                className="w-40 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th
                className="max-w-2/3 p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Value
              </th>
              <th
                className="w-52 p-4 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600 text-end">
                Actions
              </th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">

            {attributes.map((attribute, index) => (
              <tr key={index} className="border-t border-neutral-300">
                <td className="p-4 text-start truncate w-40 ">{attribute.key}</td>
                <td className="p-4 text-start max-w-2/3">
                  {editAttributeKey === attribute.key && (<>
                    <div className="flex flex-row justify-start flex-wrap gap-2 items-center">
                      {(attribute?.stringValue || attribute?.stringValues) &&
                        editValue.map((value: string, index: number) => (
                          <div key={"stringValue" + index}
                               className="cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                            <span className="truncate">{value}</span>
                            <button title="Remove Value" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                                    onClick={(e) => deleteValue(e, value)}>
                              <Close/>
                            </button>
                          </div>))}

                      {(attribute?.stringValues || attribute?.stringValue) &&
                        <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                          {isAddingValue ?
                            <>
                              <input type="text" className='h-7 px-4 border border-neutral-300 text-sm rounded-md'
                                     required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                     value={newValue as string}/>
                              <ConfirmAddNewValueButton/>
                              <CancelAddNewValueButton/>
                            </> : <>
                              <AddNewValueButton/>
                            </>}
                        </div>}

                      {(attribute?.numberValue !== undefined || attribute?.numberValues) &&
                        editValue.map((value: number, index: number) => (
                          <div key={"numberValue" + index}
                               className="cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                            <span className="text-ellipsis overflow-hidden">{value}</span>
                            <button title="Remove Value" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                                    onClick={(e) => deleteValue(e, value)}>
                              <Close/>
                            </button>
                          </div>))}

                      {(attribute?.numberValue !== undefined || attribute?.numberValues) &&
                        <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                          {isAddingValue ?
                            <>
                              <input type="number" className='h-7 px-4 border border-neutral-300 text-sm rounded-md'
                                     required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                     onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                                     value={newValue as number} step="any"/>
                              <ConfirmAddNewValueButton/>
                              <CancelAddNewValueButton/>
                            </> : <>
                              <AddNewValueButton/>
                            </>}
                        </div>}

                      {attribute?.booleanValue !== undefined && <input type="checkbox"
                                                                       className='appearance-none text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 h-4 w-4 border border-neutral-300 text-sm rounded-md '
                                                                       checked={newValue as boolean}
                                                                       onChange={(e) => setNewValue(e.target.checked)}/>}
                    </div>
                  </>)}

                  {editAttributeKey !== attribute.key && <>
                    {attribute?.stringValue && attribute.stringValue}
                    {attribute?.stringValues && attribute.stringValues.join(', ')}
                    {attribute?.numberValue !== undefined && attribute.numberValue}
                    {attribute?.numberValues && attribute.numberValues.join(', ')}
                    {attribute?.booleanValue !== undefined &&
                      (attribute.booleanValue ? 'true' : 'false')}
                  </>}
                </td>
                <td className="p-4 text-end w-52">
                  {editAttributeKey === attribute.key ? <> <ButtonPrimaryGradient
                    onClick={() => {
                      saveEditAttribute(attribute)
                    }}>Save</ButtonPrimaryGradient>
                    <ButtonGhost className="ml-2" onClick={reset}>
                      Cancel
                    </ButtonGhost>
                  </> : <>
                    {attribute.valueType !== 'KEY_ONLY' &&
                      <button className="w-4 h-4 hover:text-primary-500 mr-2" type="button"
                              onClick={() => handleEditAttribute(attribute)}>
                        <Pencil/>
                      </button>}
                    <button className="w-4 h-4 hover:text-primary-500 mr-2" type="button"
                            onClick={() => deleteDocumentAttribute(attribute.key)}>
                      <Trash/>
                    </button>
                  </>}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-4">
          <div role="status">
            <div className="overflow-x-auto relative h-44">No document attributes found</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttributesList;
