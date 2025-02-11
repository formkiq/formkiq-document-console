import {ChangeEvent} from "react";
import DisplayValue from "./DisplayValue";

const Checkbox = ({
                    description,
                    editDescription,
                    onChange,
                    selectedValue,
                    isEditing,
                  }: any
) => {

  const handleToggleCheckbox = (value: boolean) => {
    if (!onChange) return;
    onChange(value)
  };

  const parameterValue = () => {
    if (typeof selectedValue === "boolean") {
      return selectedValue;
    } else if (typeof selectedValue === "string") {
      return selectedValue.toLowerCase() === "true";
    } else {
      return false;
    }
  };

  const displayedValue = parameterValue() ? "Yes" : "No";
  return (
    <>{isEditing ? <>
        <input
          type="checkbox"
          id={description}
          className="nodrag nowheel mt-4 mb-2"
          checked={parameterValue()}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleToggleCheckbox(event.target.checked)
          }
        />
        <label htmlFor={description} className="ml-2 text-sm text-gray-800">
          {description}
        </label>
        {editDescription && <div className="text-xs text-neutral-700 mb-2">{editDescription}</div>}
      </> :
      <DisplayValue description={description} value={displayedValue}/>}
    </>
  );
};

export default Checkbox;
