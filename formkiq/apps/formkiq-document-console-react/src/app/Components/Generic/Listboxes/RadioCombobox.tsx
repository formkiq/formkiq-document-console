import {Combobox} from "@headlessui/react";
import {CheckedRadio, ChevronDown, UncheckedRadio} from "../../Icons/icons";
import {useState} from "react";


type RadioListboxPropsType = {
  values: { key: string, title: string }[]
  selectedValue: string
  setSelectedValue: (value: any) => void
  placeholderText?: string
};

function RadioCombobox({
                        values,
                        selectedValue,
                        setSelectedValue,
                        placeholderText
                      }: RadioListboxPropsType) {

  const [query, setQuery] = useState('')

  const filteredValues =
    query === ''
      ? values
      : values.filter((item) => {
        return item.title.toLowerCase().includes(query.toLowerCase());
      })

  return (
    <div className='relative h-full'>
      <Combobox value={selectedValue} onChange={setSelectedValue}>
        <Combobox.Input onChange={(event) => setQuery(event.target.value)} placeholder={placeholderText}
                        className="h-full max-h-8 bg-neutral-100 px-4 w-32 text-start font-medium flex flex-row justify-between items-center text-xs  rounded-md relative"

        />        <Combobox.Button className="w-3 text-neutral-500 absolute right-2 top-3" style={{minWidth: '12px'}}>{<ChevronDown/>}</Combobox.Button>


        <Combobox.Options
          className="absolute top-9 h-48 overflow-y-scroll bg-white shadow-md border border-neutral-100 font-medium z-50">
          {filteredValues.map((value, index) => (
            <Combobox.Option key={value.key} value={value.key}
                             className="h-12 hover:bg-neutral-200 px-6 flex items-center text-xs">
              <div className="relative w-full h-full flex items-center">
                <input type="radio" name="status" value={value.key} checked={selectedValue === value.key} readOnly
                       className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"/>
                <label className="flex items-center justify-between gap-2 w-full"><span
                  className="block truncate">{filteredValues[index].title}</span>
                  <div className="w-4">{selectedValue === value.key ? <CheckedRadio/> : <UncheckedRadio/>}</div>
                </label>
              </div>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox></div>
  );
}

export default RadioCombobox;
