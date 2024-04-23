import {Step, WorkflowStepActionType} from "../../../../helpers/types/workflows";
import {ChangeEvent} from "react";

const NumberInputs = ({
                      newStep,
                      setNewStep,
                      parametersMap,
                    }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  parametersMap: any;
}) => {
  let numberInputs: { [key: string]: { title: string, editDescription?: string } } | Record<string, never> = {};
  if (newStep !== null && newStep.name) {
    numberInputs =
      parametersMap[newStep?.name as WorkflowStepActionType]
        .numberInputParameters;
  }
  const numberInputNames = Object.keys(numberInputs);

  const handleNumberInput = (
    event: ChangeEvent<HTMLInputElement>,
    parameterName: string
  ) => {
    if (!newStep) return;
    const step: Step = {
      ...newStep,
      parameters: {
        ...newStep.parameters,
        [parameterName]: event.target.value,
      },
    };
    setNewStep(step);
  };

  const parameterValue = (numberInputKey: string) => {
    if (
      newStep !== null &&
      newStep.name &&
      newStep.parameters &&
      newStep.parameters[numberInputKey as keyof typeof newStep.parameters]
    ) {
      return newStep.parameters[
        numberInputKey as keyof typeof newStep.parameters
        ] as WorkflowStepActionType;
    } else if (parametersMap[newStep?.name as WorkflowStepActionType].numberInputParameters[numberInputKey].defaultValue) {
      return parametersMap[newStep?.name as WorkflowStepActionType].numberInputParameters[numberInputKey].defaultValue;
    } else {
      return '';
    }
  };

  return (
    <>
      {numberInputNames.length > 0 &&
        newStep !== null &&
        newStep.name &&
        numberInputs &&
        numberInputNames.map((numberInputKey) => (
          <div key={numberInputKey}>
            <div className="text-sm text-neutral-900 mt-4">
              {numberInputs[numberInputKey as WorkflowStepActionType].title}:
            </div>

            {numberInputs[numberInputKey as WorkflowStepActionType]?.editDescription &&
              <div className="text-xs text-neutral-700 mb-2">
                {numberInputs[numberInputKey as WorkflowStepActionType].editDescription}</div>}

            <input
              type="number"
              className="border border-neutral-300 rounded-md p-2 w-full nodrag nowheel"
              value={parameterValue(numberInputKey)}
              onInput={(event: ChangeEvent<HTMLInputElement>) =>
                handleNumberInput(event, numberInputKey)
              }
              min={parametersMap[newStep?.name as WorkflowStepActionType].numberInputParameters[numberInputKey].min}
              max={parametersMap[newStep?.name as WorkflowStepActionType].numberInputParameters[numberInputKey].max}
            />
          </div>
        ))}
    </>
  );
};

export default NumberInputs;
