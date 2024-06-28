import {DocumentAttribute} from "../../../helpers/types/attributes";
import {Close, Pencil, Plus, Trash} from "../../Icons/icons";
import {useState} from "react";
import ButtonPrimaryGradient from "../../Generic/Buttons/ButtonPrimaryGradient";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";

function AttributesList({
                          attributes,
                          handleScroll,
                          deleteDocumentAttribute,
                          editAttribute
                        }: {
  attributes: DocumentAttribute[],
  handleScroll: (event: any) => void,
  deleteDocumentAttribute: (key: string) => void,
  editAttribute: (key: string, newValue: any, valuesToDelete: any[]) => void
}) {

  const [editAttributeKey, setEditAttributeKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);
  const [valuesToDelete, setValuesToDelete] = useState<any[]>([]);
  const [newValue, setNewValue] = useState<string | number>('');

  function handleEditAttribute(attribute: DocumentAttribute) {
    setEditAttributeKey(attribute.key);
    if (attribute?.stringValue) {
      setEditValue(attribute.stringValue)
    } else if (attribute?.stringValues) {
      setEditValue(attribute.stringValues)
    } else if (attribute.numberValue !== undefined) {
      setEditValue(attribute.numberValue)
    } else if (attribute?.numberValues) {
      setEditValue(attribute.numberValues)
    } else if (attribute.booleanValue !== undefined) {
      setEditValue(attribute.booleanValue)
    }
    setValuesToDelete([])
  }

  function handleAddValue() {
    console.log(editValue, 'editValue')
    setEditValue([...editValue, newValue])
    setNewValue('')
  }

  function deleteValue(event: any, value: string | number) {
    setValuesToDelete([...valuesToDelete, value])
    setEditValue(editValue.filter((item: string | number) => item !== value))
  }

  function reset() {
    setEditAttributeKey(null)
    setEditValue(null)
    setValuesToDelete([])
  }

  function saveEditAttribute(attribute: DocumentAttribute) {
    const newAttributeValue: { attribute: DocumentAttribute } = {
      attribute: {
        key: attribute.key,
      }
    }
    if (attribute?.stringValue) {
      newAttributeValue.attribute.stringValue = editValue
    }
    if (attribute?.stringValues) {
      newAttributeValue.attribute.stringValues = editValue
    }
    if (attribute?.numberValue !== undefined) {
      newAttributeValue.attribute.numberValue = editValue
    }
    if (attribute?.numberValues) {
      newAttributeValue.attribute.numberValues = editValue
    }
    if (attribute?.booleanValue !== undefined) {
      newAttributeValue.attribute.booleanValue = editValue
    }

    editAttribute(attribute.key, newAttributeValue, valuesToDelete);
    reset()
  }

  return (
    <div>
      {attributes.length > 0 ? (
        <div className="overflow-auto max-h-64" onScroll={handleScroll}>
          <table className="border border-neutral-300 border-collapse table-auto w-full text-sm"
                 id="documentAttributesScrollPane">
            <thead className="sticky top-0 bg-white font-bold py-3 bg-neutral-100">
            <tr>
              <th
                className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Key
              </th>
              <th
                className="p-4 pr-8 text-left text-transparent bg-clip-text bg-gradient-to-l from-primary-500 via-secondary-500 to-primary-600">
                Value
              </th>
              <th></th>
            </tr>
            </thead>

            <tbody className="bg-white nodark:bg-slate-800">

            {attributes.map((attribute, index) => (
              <tr key={index} className="border-t border-neutral-300">
                <td className="p-4 text-start w-52 truncate">{attribute.key}</td>
                <td className="p-4 text-start">

                  {editAttributeKey === attribute.key && (<>
                    {attribute?.stringValue &&
                      <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                             required placeholder="Value" onChange={(e) => setEditValue(e.target.value)}
                             value={editValue}/>}

                    {attribute?.numberValue !== undefined &&
                      <input type="number" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                             required placeholder="Value" onChange={(e) => setEditValue(e.target.value)}
                             value={editValue}/>}

                    <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                      {attribute?.stringValues && editValue.map((value: string, index: number) => (
                        <div key={"stringValue" + index}
                             className="cursor-pointer py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                          <span className="text-ellipsis overflow-hidden">{value}</span>
                          <button title="Remove Value" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                                  onClick={(e) => deleteValue(e, value)}>
                            <Close/>
                          </button>
                        </div>))}

                      {attribute?.stringValues &&
                        <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                          <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                                 required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                 value={newValue}/>
                          <button title="Add Value" type="button"
                                  className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                                  onClick={handleAddValue}>
                            <Plus/>
                          </button>
                        </div>}

                      {attribute?.numberValues &&
                        editValue.map((value: number, index: number) => (
                          <div key={"numberValue" + index}
                               className="cursor-pointer py-1.5 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border">
                            <span className="text-ellipsis overflow-hidden">{value}</span>
                            <button title="Remove Value" type="button" className="w-4 h-4 min-w-4 text-neutral-900"
                                    onClick={(e) => deleteValue(e, value)}>
                              <Close/>
                            </button>
                          </div>))}

                      {attribute?.numberValues &&
                        <div className="flex flex-row justify-start flex-wrap gap-2 items-end">
                          <input type="number" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                                 required placeholder="Value" onChange={(e) => setNewValue(e.target.value)}
                                 value={newValue}/>
                          <button title="Add Value" type="button"
                                  className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500"
                                  onClick={(e) => setEditValue([...editValue, ''])}>
                            <Plus/>
                          </button>
                        </div>}

                      {attribute?.booleanValue !== undefined && <input type="checkbox"
                                                                       className='appearance-none text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 h-4 w-4 border border-neutral-300 text-sm rounded-md '
                                                                       checked={editValue}
                                                                       onChange={(e) => setEditValue(e.target.checked)}/>}
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
                <td className="p-4 text-end">
                  {editAttributeKey === attribute.key ? <> <ButtonPrimaryGradient
                    onClick={() => {
                      saveEditAttribute(attribute)
                    }}>Save</ButtonPrimaryGradient>
                    <ButtonGhost className="ml-2" onClick={reset}>
                      Cancel
                    </ButtonGhost>
                  </> : <>
                    <button className="w-4 h-4 hover:text-primary-500 mr-2" type="button"
                            onClick={() => handleEditAttribute(attribute)}>
                      <Pencil/>
                    </button>
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
