import {Listbox} from '@headlessui/react';
import {CheckedRadio, ChevronDown, UncheckedRadio} from '../../Icons/icons';

type CheckboxListboxPropsType = {
  values: string[];
  selectedValues: string[];
  handleSelectValues: (value: string[]) => void;
  placeholderText?: string;
};

function CheckboxListbox({
                           values,
                           selectedValues,
                           handleSelectValues,
                           placeholderText,
                         }: CheckboxListboxPropsType) {
  return (
    <div className="relative h-full">
      <Listbox
        value={selectedValues}
        onChange={(value: string[]) => handleSelectValues(value)}
        multiple
      >
        <Listbox.Button
          className="h-full max-h-8 bg-neutral-100 px-4 w-full text-start font-medium flex flex-row justify-between items-center text-xs  rounded-md">
          <span className="block truncate">
            {selectedValues.length > 0
              ? selectedValues.join(', ')
              : (placeholderText ? placeholderText : 'Select ...')}
          </span>
          <div className="w-3 text-neutral-500" style={{minWidth: '12px'}}>
            {<ChevronDown/>}
          </div>
        </Listbox.Button>
        <Listbox.Options
          className="absolute top-9 left-0 h-48 overflow-y-scroll bg-white shadow-md border border-neutral-100 font-medium z-50"
        >
          {values.map((value) => (
            <Listbox.Option
              key={value}
              value={value}
              className="h-12 hover:bg-neutral-200 px-6 flex items-center text-xs"
            >
              {({active, selected}) => (
                <div className="relative w-full h-full flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value={value}
                    checked={selected}
                    readOnly
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <label className="flex items-center justify-between gap-2 w-full">
                    <span className="block truncate">{value}</span>
                    <div className="w-4">
                      <input type="checkbox" checked={selected} readOnly
                                         className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"/>
                    </div>
                  </label>
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

export default CheckboxListbox;
