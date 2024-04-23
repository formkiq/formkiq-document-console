import {Step, WorkflowStepActionType } from "../../../../helpers/types/workflows";
import { ChangeEvent, useEffect } from "react";

const CheckBoxes = ({
                      newStep,
                      setNewStep,
                      parametersMap
                    }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  parametersMap:any;
}) => {
  let checkBoxes: { [key: string]: string } | Record<string, never> = {};

  if (newStep !== null && newStep.name) {
    checkBoxes =
      parametersMap[newStep?.name as WorkflowStepActionType].checkboxParameters;
  }
  const checkBoxesNames = Object.keys(checkBoxes);

  const handleCheckBoxInput = (
    event: ChangeEvent<HTMLInputElement>,
    parameterName: string
  ) => {
    if (!newStep) return;
    const step: Step = {
      ...newStep,
      parameters: {
        ...newStep.parameters,
        [parameterName]: event.target.checked,
      },
    };
    setNewStep(step);
  };

  const parameterValue = (checkBoxesKey: string) => {
    if (
      newStep !== null &&
      newStep.name &&
      newStep.parameters &&
      newStep.parameters[checkBoxesKey as keyof typeof newStep.parameters]
    ) {
      return newStep.parameters[
        checkBoxesKey as keyof typeof newStep.parameters
        ] as boolean;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkBoxesNames.forEach((checkBoxKey) => {
      if (!newStep) return;
      const step: Step = {
        ...newStep,
        parameters: {
          ...newStep.parameters,
          [checkBoxKey]: false,
        },
      };
      setNewStep(step);
    });
  }, []);

  return (
    <>
      {checkBoxesNames.length > 0 &&
        newStep !== null &&
        newStep.name &&
        checkBoxes &&
        checkBoxesNames.map((checkBoxKey) => (
          <div key={checkBoxKey}>
            <input
              type="checkbox"
              id={checkBoxKey}
              className="nodrag nowheel mt-4 mb-2"
              checked={parameterValue(checkBoxKey)}
              onChange={(event) => handleCheckBoxInput(event, checkBoxKey)}
            />
            <label htmlFor={checkBoxKey} className="ml-2 text-sm text-gray-800">
              {checkBoxes[checkBoxKey as WorkflowStepActionType]}
            </label>
          </div>
        ))}
    </>
  );
};

export default CheckBoxes;
