import {Close} from "../../Icons/icons";
import {useEffect, useState} from "react";
import {Attribute} from "../../../helpers/types/attributes";
import {useSelector} from "react-redux";
import {DataCacheState} from "../../../Store/reducers/data";
import {ConfigState} from "../../../Store/reducers/config";
import {useAppDispatch} from "../../../Store/store";
import {openDialog as openNotificationDialog} from "../../../Store/reducers/globalNotificationControls";
import {fetchDocuments} from "../../../Store/reducers/documentsList";
import OpenSearchAttributesSelect from "./openSearchAttributesSelect";

function AdvancedAttributesSearchTab({siteId, formkiqVersion}: { siteId: string,formkiqVersion:any }) {
  // const opensearchAttributeCriteria = [
  //   {key: 'eq', title: 'Equal to'},
  //   {key: 'eqOr', title: 'Equal to Any'},
  // ];

  const stringAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'Equal to Any'},
    {key: 'beginsWith', title: 'Begins with'},
    {key: 'range', title: 'Range'},
  ];

  const numberAttributeCriteria = [
    {key: 'range', title: 'Range'},
  ];
  // const dispatch = useAppDispatch()
  // const {formkiqVersion} = useSelector(ConfigState);
  // const {allAttributes} = useSelector(DataCacheState);
  // const [attributeKeys, setAttributeKeys] = useState<{ key: string, title: string }[]>([])
  // const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)
  // const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>("")
  // const [attributeCriteria, setAttributeCriteria] = useState<{ key: string; title: string }[]>(opensearchAttributeCriteria);
  // const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<string | null>(null);
  // const [attributeValue, setAttributeValue] = useState<string | number | boolean>("");
  // const [attributeValues, setAttributeValues] = useState<any[]>([]);
  // const [selectedAttributesQuery, setSelectedAttributesQuery] = useState<any[]>([]);

  // useEffect(() => {
  //   if (!allAttributes || allAttributes.length === 0) return;
  //   const keys = allAttributes.map((item) => ({key: item.key, title: item.key}))
  //   setAttributeKeys(keys);
  // }, [allAttributes]);

  // useEffect(() => {
  //   if (!selectedAttributeKey) return;
  //   const attribute = allAttributes.find(item => item.key === selectedAttributeKey)
  //   if (!attribute) return;
  //   setSelectedAttribute(attribute);
  // }, [selectedAttributeKey]);

  // const resetValues = () => {
  //   setSelectedAttribute(null);
  //   setSelectedAttributeKey("");
  //   setSelectedAttributeCriteria(null);
  //   setAttributeValue("");
  //   setAttributeValues([]);
  // };

  // const onSearch = (e: any) => {
  //   e.preventDefault()
  //   // add conditions to ensure correct attribute json
  //   if (!selectedAttribute) return;
  //   if (!selectedAttributeCriteria) return;
  //   console.log(1)
  //   // if (formkiqVersion.modules.includes('opensearch')) { // TODO: uncomment
  //   const searchAttributes = []
  //   if (selectedAttributesQuery.length > 0) {
  //     dispatch(fetchDocuments({
  //       siteId, formkiqVersion, page: 1, searchAttributes: selectedAttributesQuery
  //     }))
  //   }
    // else {
    //   const searchAttribute = {
    //     key: selectedAttribute.key,
    //     [selectedAttributeCriteria]: attributeValues.length > 0 ? attributeValues : attributeValue
    //   }
    //   searchAttributes.push(searchAttribute)
    //   dispatch(fetchDocuments({
    //     siteId, formkiqVersion, page: 1, searchAttributes
    //   }))
    // }
    // } else {
    //   // TODO: implement fetch with simple search
    // }
    // search
  //   resetValues()
  // }

  // function onAttributeSelect(key: string) {
  //   setSelectedAttributeKey(key);
  //   const attribute = allAttributes.find(item => item.key === key)
  //   if (!attribute) return;
  //   setSelectedAttribute(attribute);
  //   if (!formkiqVersion.modules.includes('opensearch')) { // TODO: Remove "!"
  //     setSelectedAttributeCriteria('eq');
  //     setAttributeValue('');
  //     setAttributeValues([]);
  //   }
  //   // else { // TODO: check this again
  //   //   if (attribute.dataType === 'STRING' || attribute.dataType === 'BOOLEAN') {
  //   //     setAttributeCriteria(stringAttributeCriteria);
  //   //     setSelectedAttributeCriteria('eq');
  //   //     setAttributeValue('');
  //   //     setAttributeValues([]);
  //   //   } else if (attribute.dataType === 'NUMBER') {
  //   //     setAttributeCriteria(numberAttributeCriteria);
  //   //     setSelectedAttributeCriteria('range');
  //   //     setAttributeValue(0);
  //   //     setAttributeValues([]);
  //   //   }
  //   // }
  // }

  // function addAttributeValueToList() {
  //   if (!attributeValue) return;
  //   // check if value already exists in list
  //   if (attributeValues.includes(attributeValue)) {
  //     dispatch(openNotificationDialog({
  //       dialogTitle: 'Value already exists in list',
  //     }));
  //     return;
  //   }
  //   setAttributeValues([...attributeValues, attributeValue]);
  //   setAttributeValue("");
  // }
  //
  // function removeAttributeValueFromList(value: any) {
  //   setAttributeValues(attributeValues.filter(item => item !== value));
  // }
  //
  // function addAttributeToQuery() {
  //   if (!selectedAttribute || !selectedAttributeCriteria) return;
  //   // if (formkiqVersion.modules.includes('opensearch')) { // TODO: uncomment
  //   let valueType = 'stringValue'
  //   if (selectedAttribute.dataType === 'NUMBER') valueType = 'numberValue'
  //   if (selectedAttribute.dataType === 'BOOLEAN') valueType = 'booleanValue'
  //   const searchAttribute: any = {
  //     key: selectedAttribute.key,
  //   }
  //   if (selectedAttributeCriteria === 'eq') {
  //     searchAttribute['eq'] = {
  //       [valueType]: attributeValue
  //     }
  //   } else if (selectedAttributeCriteria === 'eqOr') {
  //     if (attributeValues.length === 0) {
  //       dispatch(openNotificationDialog({
  //         dialogTitle: 'Please add at least one value',
  //       }));
  //       return;
  //     }
  //     searchAttribute['eqOr'] = attributeValues.map(item => ({
  //       [valueType]: item
  //     }))
  //   }
  //   setSelectedAttributesQuery([...selectedAttributesQuery, searchAttribute]);
  //   // }
  //   resetValues()
  //
  //
  // }


  return (
    <div className="w-full h-56 p-4 flex flex-col justify-between relative">
      <div
        className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2 -z-10">
        Advanced Search
      </div>
      <OpenSearchAttributesSelect siteId={siteId}
                                  formkiqVersion={formkiqVersion}
                                  // values={attributeKeys}
                                  // selectedValue={selectedAttributeKey}
                                  // selectedAttribute={selectedAttribute}
                                  // selectedAttributeCriteria={selectedAttributeCriteria}
                                  // setAttributeValue={setAttributeValue}
                                  // attributeValues={attributeValues}
                                  // addAttributeValueToList={addAttributeValueToList}
                                  // addAttributeToQuery={addAttributeToQuery}
                                  // removeAttributeValueFromList={removeAttributeValueFromList}
                                  // setSelectedAttributesQuery={setSelectedAttributesQuery}
                                  // selectedAttributesQuery={selectedAttributesQuery}
                                  // // resetValues={resetValues}
      />
    </div>);
}

export default AdvancedAttributesSearchTab;
