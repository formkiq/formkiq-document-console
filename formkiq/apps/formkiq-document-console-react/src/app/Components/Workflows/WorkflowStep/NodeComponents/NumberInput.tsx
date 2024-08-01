import {ChangeEvent, useEffect} from 'react';
import DisplayValue from './DisplayValue';

const NumberInput = ({
                       defaultValue,
                       description,
                       editDescription,
                       onChange,
                       selectedValue,
                       isEditing,
                       min,
                       max,
                     }: any) => {
  const handleNumberInput = (name: string) => {
    if (!onChange) return;
    onChange(name);
  };

  const handleNumberFocus = (target: EventTarget | null) => {
    if (target instanceof HTMLInputElement) {
      target.select();
    }
  };

  const parameterValue = () => {
    if (selectedValue !== undefined) {
      return selectedValue;
    } else if (defaultValue) {
      return defaultValue;
    } else {
      return 0;
    }
  };

  // if default value set, update the step
  useEffect(() => {
    if (defaultValue && isEditing && selectedValue===undefined) {
      handleNumberInput(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      {isEditing ? (
        <>
          <div className="text-sm text-neutral-900 mt-4">{description}:</div>

          {editDescription && (
            <div className="text-xs text-neutral-700 mb-2">
              {editDescription}
            </div>
          )}

          <input
            type="number"
            className="border border-neutral-300 rounded-md p-2 w-full nodrag nowheel"
            value={parameterValue()}
            onFocus={(event: React.FocusEvent<HTMLInputElement>) =>
              handleNumberFocus(event.target)
            }
            onInput={(event: ChangeEvent<HTMLInputElement>) =>
              handleNumberInput(event.target.value)
            }
            min={min}
            max={max}
          />
        </>
      ) : (
        <DisplayValue description={description} value={selectedValue}/>
      )}
    </>
  );
};

export default NumberInput;
