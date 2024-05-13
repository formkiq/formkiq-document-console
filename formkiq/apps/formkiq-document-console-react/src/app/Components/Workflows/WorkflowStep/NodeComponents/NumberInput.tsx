import {ChangeEvent} from "react";
import DisplayValue from "./DisplayValue";

const NumberInput = ({
                       defaultValue,
                       description,
                       editDescription,
                       onChange,
                       selectedValue,
                       isEditing,
                       min,
                       max
                     }: any
) => {

  const handleNumberInput = (name: string) => {
    onChange(name)
  };

  const parameterValue = () => {
    if (selectedValue) {
      return selectedValue
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return 0;
    }
  };

  return (
    <>{isEditing ? <>
        <div className="text-sm text-neutral-900 mt-4">
          {description}:
        </div>

        {editDescription &&
          <div className="text-xs text-neutral-700 mb-2">
            {editDescription}</div>}

        <input
          type="number"
          className="border border-neutral-300 rounded-md p-2 w-full nodrag nowheel"
          value={parameterValue()}
          onInput={(event: ChangeEvent<HTMLInputElement>) =>
            handleNumberInput(event.target.value)
          }
          min={min}
          max={max}
        />
      </> :
      <DisplayValue description={description} value={selectedValue}/>}
    </>
  );
};

export default NumberInput;
