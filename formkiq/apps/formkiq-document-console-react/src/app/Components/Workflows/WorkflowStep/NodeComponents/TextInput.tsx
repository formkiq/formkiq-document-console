import {Step, WorkflowStepActionType} from "../../../../helpers/types/workflows";
import {ChangeEvent} from "react";
import DisplayValue from "./DisplayValue";

const TextInput = ({
                      defaultValue,
                      description,
                      editDescription,
                      onChange,
                      selectedValue,
                      isEditing
                    }: any
) => {

  const handleTextInput = (name: string) => {
    onChange(name)
  };

  const parameterValue = () => {
    if (selectedValue) {
      return selectedValue
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return '';
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
          type="text"
          className="border border-neutral-300 rounded-md p-2 w-full nodrag nowheel"
          value={parameterValue()}
          onInput={(event: ChangeEvent<HTMLInputElement>) =>
            handleTextInput(event.target.value)
          }
        />
      </> :
      <DisplayValue description={description} value={selectedValue}/>}
    </>
  );
};

export default TextInput;
