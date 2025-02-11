import {Listbox} from "@headlessui/react";
import {ChevronRight} from "../../../Icons/icons";
import DisplayValue from "./DisplayValue";
import {useEffect} from "react";

const ParametersSelector = ({
                              options,
                              description,
                              onChange,
                              selectedValue,
                              isEditing
                            }: any
) => {

  const handleSelectStepParameter = (name: string) => {
    if(!onChange) return;
    onChange(name)
  };


  const parameterValue = () => {
    if (selectedValue && options[selectedValue]) {
      return options[selectedValue] as string;
    } else {
      return 'Select ...';
    }
  };

  // if only one option, select it by default
  useEffect(() => {
    if (Object.keys(options).length === 1 && isEditing) {
      handleSelectStepParameter(Object.keys(options)[0]);
    }
  }, [])

  return (
    <>{isEditing ? <>
      <div className="text-sm text-gray-800 mt-4 mb-2">
        {description}:
      </div>
      <Listbox
        value=""
        onChange={(value: string) =>
          handleSelectStepParameter(value)
        }
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
              {
                options[optionKey]
              }
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </> : <DisplayValue description={description} value={options[selectedValue] ? options[selectedValue] : "-"}/>
    }
    </>
  );
};

export default ParametersSelector;
