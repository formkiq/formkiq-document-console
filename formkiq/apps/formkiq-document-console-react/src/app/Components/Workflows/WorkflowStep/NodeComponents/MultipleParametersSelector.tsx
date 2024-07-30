import {Listbox} from "@headlessui/react";
import {ChevronRight} from "../../../Icons/icons";
import DisplayValue from "./DisplayValue";
import {useEffect} from "react";

const MultipleParametersSelector = ({
                                      options,
                                      description,
                                      onChange,
                                      selectedValues,
                                      isEditing
                                    }: any
) => {
    // handle select parameters
  const handleSelectStepParameter = (names: string[]) => {
    if (!onChange) return;
    onChange(names.join(", "))
  };


  const parameterValue = () => {
    if (selectedValues&&selectedValues!=='') {
      return selectedValues;
    } else {
      return 'Select ...';
    }
  };

  // if only one option, select it by default
  useEffect(() => {
    if (Object.keys(options).length === 1 && isEditing) {
      handleSelectStepParameter([Object.keys(options)[0]]);
    }
  }, [])

  return (
    <>{isEditing ? <>
      <div className="text-sm text-gray-800 mt-4 mb-2">
        {description}:
      </div>
      <Listbox
        value={selectedValues?selectedValues.split(", "):[]}
        onChange={(value: string[]) =>
          handleSelectStepParameter(value)
        }
        multiple
      >
        <Listbox.Button
          className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag nowheel">
                <span className="block truncate">
                  {parameterValue()}
                </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="rotate-90 w-4">
                    <ChevronRight/>
                  </div>
                </span>
        </Listbox.Button>
        <Listbox.Options
          className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
          {Object.keys(options
          ).map((optionKey) => (
            <Listbox.Option
              key={optionKey}
              value={optionKey}
              className={({active}) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                }`
              }
            >
              {({ active, selected }) => (
                <div className="relative w-full h-full flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    value={optionKey}
                    checked={selected}
                    readOnly
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <label className="flex items-center justify-between gap-2 w-full">
                    <span className="block truncate">{options[optionKey]}</span>
                    <div className="w-4">
                      <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        className="rounded-none w-4 h-4 bg-transparent border-2 border-neutral-900 focus:ring-grey-500 focus:ring-2 text-neutral-900"
                      />
                    </div>
                  </label>
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </> : <DisplayValue description={description}
                        value={selectedValues ? selectedValues : "-"}/>
    }
    </>
  );
};

export default MultipleParametersSelector;
