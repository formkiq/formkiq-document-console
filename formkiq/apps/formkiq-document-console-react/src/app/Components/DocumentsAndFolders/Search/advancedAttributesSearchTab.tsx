import {IDocument} from "../../../helpers/types/document";
import {Close, Plus, Spinner} from "../../Icons/icons";
import {Link} from "react-router-dom";
import {getFileIcon} from "../../../helpers/services/toolService";
import ButtonPrimary from "../../Generic/Buttons/ButtonPrimary";
import ButtonGhost from "../../Generic/Buttons/ButtonGhost";
import RadioCombobox from "../../Generic/Listboxes/RadioCombobox";
import {useEffect, useState} from "react";
import {Attribute} from "../../../helpers/types/attributes";
import {useSelector} from "react-redux";
import {DataCacheState} from "../../../Store/reducers/data";
import {useForm} from "react-hook-form";
import {ConfigState} from "../../../Store/reducers/config";
import RadioListbox from "../../Generic/Listboxes/RadioListbox";


function AdvancedAttributesSearchTab(props: any) {
  const fulltextAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'Equal to Any'},
  ];

  const stringAttributeCriteria = [
    {key: 'eq', title: 'Equal to'},
    {key: 'eqOr', title: 'Equal to Any'},
    {key: 'beginsWith', title: 'Begins with'},
    {key: 'range', title: 'Range'},
  ];

  const numberAttributeCriteria = [
    {key: 'range', title: 'Range'},
  ];

  const {formkiqVersion} = useSelector(ConfigState);
  const {
    register,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm();
  const {allAttributes} = useSelector(DataCacheState);
  const [attributeKeys, setAttributeKeys] = useState<{ key: string, title: string }[]>([])
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null)
  const [selectedAttributeKey, setSelectedAttributeKey] = useState<string>("")
  const [attributeCriteria, setAttributeCriteria] = useState<{ key: string; title: string }[]>(fulltextAttributeCriteria);
  const [selectedAttributeCriteria, setSelectedAttributeCriteria] = useState<string | null>(null);

  useEffect(() => {
    if (!allAttributes || allAttributes.length === 0) return;
    const keys = allAttributes.map((item) => ({key: item.key, title: item.key}))
    setAttributeKeys(keys);
  }, [allAttributes]);

  useEffect(() => {
    if (!selectedAttributeKey) return;
    const attribute = allAttributes.find(item => item.key === selectedAttributeKey)
    if (!attribute) return;
    setSelectedAttribute(attribute);
  }, [selectedAttributeKey]);

  const resetValues = () => {
    setSelectedAttribute(null);
    setSelectedAttributeKey("");
    reset()
  };

  const onSearch = async (data: any) => {
    console.log(data)
    resetValues()
  }

  useEffect(() => {
    if (!selectedAttribute) return;
    if (!formkiqVersion.modules.includes('fulltext')) { // TODO: Remove "!"
      setAttributeCriteria(fulltextAttributeCriteria);
    } else {
      if (selectedAttribute.dataType === 'STRING') {
        setAttributeCriteria(stringAttributeCriteria);
      } else if (selectedAttribute.dataType === 'NUMBER') {
        setAttributeCriteria(numberAttributeCriteria);
      }
    }
  }, [selectedAttribute]);

  return (
    <div className="w-full h-56 p-4 flex flex-col justify-between relative">
      <div
        className="absolute flex w-full h-40 justify-center items-center font-bold text-5xl text-gray-100 mb-2 -z-10">
        Advanced Search
      </div>
      <form
        onSubmit={handleSubmit(onSearch)}
        className="w-full h-full"
      >
        <div className="h-full border-gray-400 border overflow-y-auto p-2">
          <div className="h-8 gap-2 flex items-center">
            <div className="h-8 flex items-center gap-2">

              <RadioCombobox values={attributeKeys}
                             selectedValue={selectedAttributeKey}
                             setSelectedValue={setSelectedAttributeKey}
                             placeholderText="Select Attribute"/>
              {selectedAttribute && (
                <div
                  className="text-xs bg-neutral-100 rounded-md font-bold h-8 p-2 text-center whitespace-nowrap">
                  {selectedAttribute.dataType}
                </div>
              )}
            </div>
            {selectedAttribute &&
              // formkiqVersion.modules.includes('fulltext') && // TODO: uncomment
              (selectedAttribute.dataType === 'NUMBER' ||
                selectedAttribute.dataType === 'STRING' ||
                selectedAttribute.dataType === 'BOOLEAN') && (
                <div className="h-8">
                  <RadioListbox
                    values={attributeCriteria.map(
                      (item) => item.key
                    )}
                    titles={attributeCriteria.map(
                      (item) => item.title
                    )}
                    selectedValue={
                      selectedAttributeCriteria as string
                    }
                    setSelectedValue={
                      setSelectedAttributeCriteria
                    }
                  />
                </div>
              )}


            {
              // formkiqVersion.modules.includes('fulltext') &&
              selectedAttribute && selectedAttribute.dataType === "STRING" &&
              selectedAttributeCriteria === "eq" &&
              <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                     {...register('stringValue', {required: true})}/>
            }
            {
              // formkiqVersion.modules.includes('fulltext') &&
                  selectedAttribute && selectedAttribute.dataType === "STRING" &&
                  selectedAttributeCriteria === "eqOr" &&
              <div className="flex items-center gap-2">
                <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'
                       {...register('stringValue', {required: true})}/>
                <button type="button" className="text-neutral-400 bg-neutral-100 w-6 h-6 flex items-center justify-center rounded-full p-1"><Plus/></button>
              </div>
              }

            {/*<div className="mr-2 h-8">*/}
            {/*  {selectedAttribute && selectedAttribute.dataType === "STRING" &&*/}
            {/*    <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'*/}
            {/*           {...register('stringValue', {required: true})}*/}
            {/*           placeholder="Value"/>}*/}
            {/*  {selectedAttribute && selectedAttribute.dataType === "NUMBER" &&*/}
            {/*    <input type="number" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'*/}
            {/*           {...register('numberValue', {required: true})}*/}
            {/*           placeholder="Value"/>}*/}
            {/*  {selectedAttribute && selectedAttribute.dataType === "BOOLEAN" &&*/}
            {/*    <input type="checkbox"*/}
            {/*           className='appearance-none text-primary-600 bg-neutral-100 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2 h-4 w-4 border border-neutral-300 text-sm rounded-md '*/}
            {/*           {...register('booleanValue')}/>}*/}
            {/*  {selectedAttribute && selectedAttribute.dataType === "COMPOSITE_STRING" &&*/}
            {/*    <input type="text" className='h-8 px-4 border border-neutral-300 text-sm rounded-md'*/}
            {/*           {...register('compositeStringValue', {required: true})}*/}
            {/*           placeholder="Coma-separated values"/>}*/}
            {/*</div>*/}
          </div>
        </div>
      </form>
    </div>);
}

export default AdvancedAttributesSearchTab;
