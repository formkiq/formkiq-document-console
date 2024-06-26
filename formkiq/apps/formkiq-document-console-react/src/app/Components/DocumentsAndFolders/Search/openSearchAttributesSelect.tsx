import {Attribute} from "../../../helpers/types/attributes";
import RadioCombobox from "../../Generic/Listboxes/RadioCombobox";
import RadioListbox from "../../Generic/Listboxes/RadioListbox";
import {Close, Plus} from "../../Icons/icons";
import ButtonSecondary from "../../Generic/Buttons/ButtonSecondary";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import ButtonPrimary from "../../Generic/Buttons/ButtonPrimary";
import {useEffect, useState} from "react";
import {fetchDocuments} from "../../../Store/reducers/documentsList";
import {useAppDispatch} from "../../../Store/store";
import {useSelector} from "react-redux";
import {DataCacheState} from "../../../Store/reducers/data";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";

export default function OpenSearchAttributesSelect({
                                                     siteId,
                                                     formkiqVersion,

                                                   }: any) {
  const opensearchAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'Equal to Any'},
  ];
  const dispatch = useAppDispatch()
  // const {formkiqVersion} = useSelector(ConfigState);
  const {allAttributes} = useSelector(DataCacheState);
  const [attributeKeys, setAttributeKeys] = useState<{ key: string, title: string }[]>([])
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>("")
  // const [attributeCriteria, setAttributeCriteria] = useState<{ key: string; title: string }[]>(opensearchAttributeCriteria);
  const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<string | null>(null);
  const [attributeValue, setAttributeValue] = useState<string | number | boolean>("");
  const [attributeValues, setAttributeValues] = useState<any[]>([]);
  const [selectedAttributesQuery, setSelectedAttributesQuery] = useState<any[]>([]);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({key: item.key, title: item.key}))
    setAttributeKeys(keys);
  }, [allAttributes]);


  function onAttributeSelect(key: string) {
    setSelectedAttributeKey(key);
    const attribute = allAttributes.find(item => item.key === key)
    if (!attribute) return;
    setSelectedAttribute(attribute);
    setSelectedAttributeCriteria('eq');
    if (attribute.dataType === 'STRING') {
      setAttributeValue('')
    } else if (attribute.dataType === 'NUMBER') {
      setAttributeValue(0)
    } else if (attribute.dataType === 'BOOLEAN') {
      setAttributeValue(false)
    }
    setAttributeValues([]);
  }

  const resetValues = () => {
    setSelectedAttribute(null);
    setSelectedAttributeKey("");
    setSelectedAttributeCriteria(null);
    setAttributeValue("");
    setAttributeValues([]);
  };

  const onSearch = () => {
    if (!selectedAttribute) return;
    if (!selectedAttributeCriteria) return;

    if (selectedAttributesQuery.length > 0) {
      dispatch(fetchDocuments({
        siteId, formkiqVersion, page: 1, searchAttributes: selectedAttributesQuery
      }))
    }
    resetValues()
  }

  function addAttributeValueToList() {
    if (!attributeValue) return;
    // check if value already exists in list
    if (attributeValues.includes(attributeValue)) {
      dispatch(openNotificationDialog({
        dialogTitle: 'Value already exists in list',
      }));
      return;
    }
    setAttributeValues([...attributeValues, attributeValue]);
    setAttributeValue("");
  }

  function removeAttributeValueFromList(value: any) {
    setAttributeValues(attributeValues.filter(item => item !== value));
  }

  function addAttributeToQuery() {
    if (!selectedAttribute || !selectedAttributeCriteria) return;
    // if (formkiqVersion.modules.includes('opensearch')) { // TODO: uncomment
    let valueType = 'stringValue'
    if (selectedAttribute.dataType === 'NUMBER') valueType = 'numberValue'
    if (selectedAttribute.dataType === 'BOOLEAN') valueType = 'booleanValue'
    const searchAttribute: any = {
      key: selectedAttribute.key,
    }
    if (selectedAttributeCriteria === 'eq') {
      searchAttribute['eq'] = {
        [valueType]: attributeValue
      }
    } else if (selectedAttributeCriteria === 'eqOr') {
      if (attributeValues.length === 0) {
        dispatch(openNotificationDialog({
          dialogTitle: 'Please add at least one value',
        }));
        return;
      }
      searchAttribute['eqOr'] = attributeValues.map(item => ({
        [valueType]: item
      }))
    }
    setSelectedAttributesQuery([...selectedAttributesQuery, searchAttribute]);
    // }
    resetValues()


  }


  return <div
    className="w-full h-full"
  >
    <div className="h-full border-gray-400 border overflow-y-auto p-2">
      <div className="h-8 gap-2 flex items-center">
        <div className="h-8 flex items-center gap-2">

          <RadioCombobox values={attributeKeys}
                         selectedValue={selectedAttributeKey}
                         setSelectedValue={onAttributeSelect}
                         placeholderText="Select Attribute"/>
          {selectedAttribute && (
            <div
              className="text-xs bg-neutral-100 rounded-md font-bold h-8 p-2 text-center whitespace-nowrap">
              {selectedAttribute.dataType}
            </div>
          )}
        </div>
        {selectedAttribute &&
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          (selectedAttribute.dataType === "NUMBER" ||
            selectedAttribute.dataType === "STRING" ||
            selectedAttribute.dataType === "BOOLEAN") && (
            <div className="h-8">
              <RadioListbox
                values={opensearchAttributeCriteria.map((item) => item.key)}
                titles={opensearchAttributeCriteria.map((item) => item.title)}
                selectedValue={selectedAttributeCriteria as string}
                setSelectedValue={setSelectedAttributeCriteria}
              />
            </div>
          )}


        {
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          selectedAttribute && selectedAttribute.dataType === "STRING" &&
          selectedAttributeCriteria === "eq" &&
          <input type="text" className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                 required value={attributeValue as string}
                 onChange={(e: any) => setAttributeValue(e.target.value)}/>
        }
        {
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          selectedAttribute && selectedAttribute.dataType === "STRING" &&
          selectedAttributeCriteria === "eqOr" &&
          <div className="flex items-center gap-2">
            <input type="text" className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                   required={attributeValues.length === 0} // check if added at least one attribute
                   value={attributeValue as string} onChange={(e: any) => setAttributeValue(e.target.value)}/>
            <button type="button" onClick={addAttributeValueToList} title="Add"
                    className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500">
              <Plus/>
            </button>
          </div>
        }
        {
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          selectedAttribute && selectedAttribute.dataType === "NUMBER" &&
          selectedAttributeCriteria === "eq" &&
          <div className="flex items-center gap-2">
            <input type="number" className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                   required value={attributeValue as number}
                   onChange={(e: any) => setAttributeValue(e.target.value)}/>
          </div>
        }
        {
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          selectedAttribute && selectedAttribute.dataType === "NUMBER" &&
          selectedAttributeCriteria === "eqOR" &&
          <div className="flex items-center gap-2">
            <input type="number" className="h-8 px-4 border border-neutral-300 text-sm rounded-md"
                   required={attributeValues.length === 0} // check if added at least one attribute
                   value={attributeValue as number}
                   onChange={(e: any) => setAttributeValue(e.target.value)}/>
            <button type="button" onClick={addAttributeValueToList} title="Add"
                    className="text-neutral-500 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1 border border-neutral-500">
              <Plus/>
            </button>
          </div>
        }
        {
          // formkiqVersion.modules.includes('opensearch') && // TODO: uncomment
          selectedAttribute && selectedAttribute.dataType === "BOOLEAN" &&
          selectedAttributeCriteria === "eq" &&
          <div className="flex items-center gap-2">
            {/*radioListbox with true and false and multiple selection */}
          </div>
        }


        <ButtonSecondary type="button" onClick={addAttributeToQuery} title="Add">Add</ButtonSecondary>
      </div>
      <div className="flex flex-row justify-start flex-wrap gap-2 items-end mt-2">
        {attributeValues.map((val: string, i: number) => (<div key={"value_" + i}
                                                               title={val}
                                                               className="cursor-pointer py-1 px-3 text-xs font-bold uppercase rounded-md text-ellipsis overflow-hidden whitespace-nowrap flex items-center gap-2 border border-neutral-500 text-neutral-900 bg-white">
          <span className="truncate overflow-hidden max-w-64 max-w-[256px]">{val}</span>
          <button title="Remove Value" type="button"
                  className="w-4 h-4 min-w-4 text-neutral-900"
                  onClick={() => removeAttributeValueFromList(val)}>
            <Close/>
          </button>
        </div>))}
      </div>

      {selectedAttributesQuery.length > 0 && (
        <table className="border border-neutral-300 table-fixed text-sm text-left">
          <thead>
          <tr>
            <th className="w-52">Key</th>
            <th className="w-96">Value</th>
            <th className="w-8"></th>
          </tr>
          </thead>
          <tbody>
          {selectedAttributesQuery.map((item: any, i: number) => (
            <tr key={i} className="border-t border-neutral-300">
              <td>{item.key}</td>
              <td>
                {item.eq && item.eq.stringValue}
                {item.eqOr && item.eqOr.map((val: any) => val.stringValue).join(", ")}
              </td>
              <td>
                <button type="button" className="p-1 text-neutral-500 h-6 w-6 hover:text-red-500"
                        onClick={() => {
                          setSelectedAttributesQuery(selectedAttributesQuery.filter((_: any, j: number) => j !== i));
                        }} title="Remove">
                  <Close/>
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}

    </div>
    <div className="flex justify-end gap-2 mt-2">
      <ButtonGhost type="button" onClick={resetValues}>Reset</ButtonGhost>
      <ButtonPrimary type="button" onClick={onSearch}>Search</ButtonPrimary>
    </div>
  </div>;
}
