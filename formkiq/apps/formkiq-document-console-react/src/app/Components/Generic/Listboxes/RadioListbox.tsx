import { Listbox } from '@headlessui/react';
import { CheckedRadio, ChevronDown, UncheckedRadio } from '../../Icons/icons';

type RadioListboxPropsType = {
  values: string[];
  titles: string[];
  selectedValue: string;
  setSelectedValue: (value: any) => void;
  icon?: () => JSX.Element;
  iconsColor?: string[];
  placeholderText?: string;
};

function RadioListbox({
  values,
  titles,
  selectedValue,
  setSelectedValue,
  icon,
  iconsColor,
  placeholderText,
}: RadioListboxPropsType) {
  return (
    <div className="relative h-full">
      <Listbox value={selectedValue} onChange={setSelectedValue}>
        <Listbox.Button className="h-full max-h-10 bg-neutral-100 px-4 w-full text-start font-medium flex flex-row justify-between items-center text-xs  rounded-md">
          <div className="flex items-center justify-start gap-2 truncate">
            {icon && (
              <div
                className="w-3 h-3 text-neutral-300"
                style={{
                  minWidth: '12px',
                  color: iconsColor
                    ? iconsColor[values.indexOf(selectedValue)]
                    : '#cbd5e1',
                }}
              >
                {icon()}
              </div>
            )}
            <span className="block truncate">
              {values.indexOf(selectedValue) === -1 && placeholderText
                ? placeholderText
                : titles[values.indexOf(selectedValue)]}
            </span>
          </div>
          <div
            className="ml-2 w-3 text-neutral-500"
            style={{ minWidth: '12px' }}
          >
            {<ChevronDown />}
          </div>
        </Listbox.Button>
        <Listbox.Options className="absolute top-9 right-0 h-48 overflow-y-scroll bg-white shadow-md border border-neutral-100 font-medium z-50">
          {values.map((key, index) => (
            <Listbox.Option
              key={key}
              value={key}
              className="h-12 hover:bg-neutral-200 px-6 flex items-center text-xs"
            >
              <div className="relative w-full h-full flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={key}
                  checked={selectedValue === key}
                  readOnly
                  className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                />
                <label className="flex items-center justify-between gap-2 w-full">
                  <span className="block truncate">{titles[index]}</span>
                  <div className="w-4">
                    {selectedValue === key ? (
                      <CheckedRadio />
                    ) : (
                      <UncheckedRadio />
                    )}
                  </div>
                </label>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

export default RadioListbox;
