import {DocumentAttribute} from "../../../helpers/types/attributes";
import {Check, Close, Pencil, Plus, Trash} from "../../Icons/icons";
import {useState} from "react";
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
  const [editingItems, setEditingItems] = useState<any[]>([]);

  function handleEditAttribute(attribute: DocumentAttribute) {
    setEditAttributeKey(attribute.key);
    if (attribute?.stringValue) {
      setNewValue("");
      setEditValue([attribute.stringValue]);
      setEditingItems([{
        oldValue: attribute.stringValue,
        newValue: attribute.stringValue
      }])
    } else if (attribute?.stringValues) {
      setEditValue(attribute.stringValues);
    } else if (attribute.numberValue !== undefined) {
      setNewValue("");
      setEditValue([attribute.numberValue])
      setEditingItems([{
        oldValue: attribute.numberValue,
        newValue: attribute.numberValue
      }])
    } else if (attribute?.numberValues) {
      setEditValue(attribute.numberValues);
    } else if (attribute.booleanValue !== undefined) {
      setEditValue([]);
      setNewValue(attribute.booleanValue);
    }
  }

  function deleteValue(value: string | number) {
    setEditValue(editValue.filter((item: string | number) => item !== value))
  }

  function reset() {
    setEditAttributeKey(null)
    setEditValue([])
    setNewValue('')
    setIsAddingValue(false)
    setEditingItems([])
  }

  function saveEditAttribute(attribute: DocumentAttribute) {
    const newAttributeValue: { attribute: DocumentAttribute } = {
      attribute: {
        key: attribute.key,
      }
    }

    const onSavingStringAttribute = () => { // Function to handle saving string attributes. Returns false if there's no attributes.
      const updatedValues: string[] = []
      editValue.forEach((item) => {
        const editingItem = editingItems.find((editingItem) => editingItem.oldValue === item)
        if (editingItem) {
          if (editingItem.newValue !== undefined && editingItem.newValue !== "") {
            updatedValues.push(editingItem.newValue)
          }
        } else {
          updatedValues.push(item)
        }
      })

      if (newValue && newValue !== "" && updatedValues.length > 0) {
        newAttributeValue.attribute.stringValues = [...updatedValues, newValue.toString()]
      } else if (newValue && newValue !== "" && updatedValues.length === 0) {
        newAttributeValue.attribute.stringValue = newValue.toString()
      } else if ((!newValue || newValue === "") && updatedValues.length > 0) {
        if (updatedValues.length === 1) {
          newAttributeValue.attribute.stringValue = updatedValues[0]
        } else if (updatedValues.length > 1) {
          newAttributeValue.attribute.stringValues = updatedValues
        }
      } else {
        dispatch(openNotificationDialog({
          dialogTitle: "Error updating attribute. At least one value is required for the attribute."
        }))
        return false;
      }
      return true;
    }
    
    const onSavingNumberAttribute = () => { // Function to handle saving number attributes. Returns false if there's no attributes.
      const updatedValues: number[] = []
      editValue.forEach((item) => {
        const editingItem = editingItems.find((editingItem) => editingItem.oldValue === item)
        if (editingItem) {
          if (editingItem.newValue !== undefined && editingItem.newValue !== "") {
            updatedValues.push(editingItem.newValue)
          }
        } else {
          updatedValues.push(item)
        }
      })

      if (newValue !== undefined && newValue !== "" && updatedValues.length > 0) {
        newAttributeValue.attribute.numberValues = [...updatedValues, Number(newValue)]
      } else if (newValue !== undefined && newValue !== "" && updatedValues.length === 0) {
        newAttributeValue.attribute.numberValue = Number(newValue)
      } else if ((newValue === undefined || newValue === "") && updatedValues.length > 0) {
        if (updatedValues.length === 1) {
          newAttributeValue.attribute.numberValue = updatedValues[0]
        } else if (updatedValues.length > 1) {
          newAttributeValue.attribute.numberValues = updatedValues
        }
      } else {
        dispatch(openNotificationDialog({
          dialogTitle: "Error updating attribute. At least one value is required for the attribute."
        }))
        return false;
      }
      return true;
    }
    if (attribute?.numberValue || attribute?.numberValues) {
      if (!onSavingNumberAttribute()) return
    }
    if (attribute?.stringValue || attribute?.stringValues) {
      if (!onSavingStringAttribute()) return
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

  const ConfirmButton = ({itemType = 'new', updatedItem = null}: {
    itemType: 'new' | 'edit',
    updatedItem?: any
  }) => {
    function handleAddValue() {
      if (newValue === '') return;
      if (editValue.includes(newValue)) {
        dispatch(openNotificationDialog({
          dialogTitle: "Error adding new value. Value already exists."
        }))
        return;
      }
      setEditValue([...editValue, newValue]);
      setNewValue('');
      setIsAddingValue(false);
    }

    function handleUpdateValue() {
      if (!updatedItem) return;
      // check if newValue is not empty
      if (updatedItem.newValue === '') {
        dispatch(openNotificationDialog({
          dialogTitle: "Error updating value. Value cannot be empty."
        }))
        return;
      }
      if (editValue.includes(updatedItem.newValue)) {
        // check if it is not the same item
        if (updatedItem.newValue !== updatedItem.oldValue) {
          dispatch(openNotificationDialog({
            dialogTitle: "Error updating value. Value already exists."
          }))
          return;
        }
      }
      // replace the old value with the new value
      const newEditValue = [...editValue]
      const index = newEditValue.indexOf(updatedItem.oldValue);
      newEditValue.splice(index, 1, updatedItem.newValue);
      setEditValue(newEditValue);
      // remove item from editingItems
      setEditingItems(editingItems.filter(item => item.oldValue !== updatedItem.oldValue));
    }

    return (
      <button title="Confirm" type="button"
              className="text-green-500 border-green-500 w-6 h-6 flex items-center justify-center rounded-full p-0.5 border"
              onClick={itemType === 'new' ? handleAddValue : handleUpdateValue}>
        <Check/>
      </button>
    )
  }

  const CancelAddNewValueButton = ({itemType = 'new', updatedItem = null}: {
    itemType: 'new' | 'edit',
    updatedItem?: any
  }) => {
    const cancelAddValue = () => {
      setNewValue('')
      setIsAddingValue(false)
    }
    const cancelEditValue = () => {
      setEditingItems(editingItems.filter(item => item.oldValue !== updatedItem.oldValue));
    }
    return (
      <button title="Cancel" type="button"
              className="text-red-500 border-red-500 w-6 h-6 flex items-center justify-center rounded-full p-1 border"
              onClick={itemType === 'new' ? cancelAddValue : cancelEditValue}>
        <Close/>
      </button>
    )
  }

  const onValueEdit = (value: string | number) => {
    const newItem = {
      oldValue: value,
      newValue: value
    }
    setEditingItems((prev) => [...prev, newItem])
  }

  const onEditingExistingValue = (newValue: string | number, oldValue: string | number) => {
    const newEditingItems = [...editingItems].map(item => {
      if (item.oldValue === oldValue) {
        return {...item, newValue};
      }
      return item;
    });
    setEditingItems(newEditingItems);
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
                        editValue.map((value: string, index: number) => {
                          const editedItem = editingItems.find((item: { oldValue: string, newValue: string }) => item.oldValue === value)
                          return (<div key={"stringValue" + index}>
                            {editedItem ? (
                              <div
                                className="flex flex-row items-center justify-start flex-wrap gap-2 rounded-md bg-neutral-100 px-2 py-1.5">
                                <input type="text" className='h-7 px-4 border-none text-sm rounded-md'
                                       required placeholder="Value"
                                       onChange={(e) => onEditingExistingValue(e.target.value, value)}
                                       value={editedItem.newValue as string}/>
                                <ConfirmButton itemType="edit" updatedItem={editedItem}/>
                                <CancelAddNewValueButton itemType="edit" updatedItem={editedItem}/>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                                <span className="truncate">{value}</span>
                                <button title="Remove Value" type="button"
                                        className="w-4 h-4 min-w-4 text-neutral-900"
                                        onClick={() => onValueEdit(value)}>
                                  <Pencil/>
                                </button>
                                <button title="Remove Value" type="button"
                                        className="w-4 h-4 min-w-4 text-neutral-900"
                                        onClick={() => deleteValue(value)}>
                                  <Close/>
                                </button>
                              </div>
                            )}
                          </div>)
                        })
                      }

                      {(attribute?.stringValues || attribute?.stringValue) &&
                        <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                          {isAddingValue ?
                            <>
                              <input type="text" className='h-7 px-4 border border-neutral-300 text-sm rounded-md'
                                     required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                     value={newValue as string}/>
                              <ConfirmButton itemType='new'/>
                              <CancelAddNewValueButton itemType='new'/>
                            </> : <>
                              <AddNewValueButton/>
                            </>}
                        </div>}

                      {(attribute?.numberValue !== undefined || attribute?.numberValues) &&
                        editValue.map((value: number, index: number) => {
                          const editedItem = editingItems.find((item: { oldValue: number, newValue: number }) => item.oldValue === value)
                          return (<div key={"numberValue" + index}>
                            {editedItem ? (
                              <div
                                className="flex flex-row items-center justify-start flex-wrap gap-2 rounded-md bg-neutral-100 px-2 py-1.5">
                                <input type="number" className='h-7 px-4 border-none text-sm rounded-md'
                                       required placeholder="Value"
                                       onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                                       onChange={(e) => onEditingExistingValue(e.target.value, value)}
                                       value={editedItem.newValue as number} step="any"/>
                                <ConfirmButton itemType="edit" updatedItem={editedItem}/>
                                <CancelAddNewValueButton itemType="edit" updatedItem={editedItem}/>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer py-1.5 px-3 text-xs font-bold rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                                <span className="truncate">{value}</span>
                                <button title="Remove Value" type="button"
                                        className="w-4 h-4 min-w-4 text-neutral-900"
                                        onClick={() => onValueEdit(value)}>
                                  <Pencil/>
                                </button>
                                <button title="Remove Value" type="button"
                                        className="w-4 h-4 min-w-4 text-neutral-900"
                                        onClick={() => deleteValue(value)}>
                                  <Close/>
                                </button>
                              </div>
                            )}
                          </div>)
                        })
                      }

                      {(attribute?.numberValue !== undefined || attribute?.numberValues) &&
                        <div className="flex flex-row items-center justify-start flex-wrap gap-2">
                          {isAddingValue ?
                            <>
                              <input type="number" className='h-7 px-4 border border-neutral-300 text-sm rounded-md'
                                     required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                     onKeyDown={(e) => ["e", "E", "+"].includes(e.key) && e.preventDefault()}
                                     value={newValue as number} step="any"/>
                              <ConfirmButton itemType='new'/>
                              <CancelAddNewValueButton itemType='new'/>
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
