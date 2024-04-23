import {Step, WorkflowStepActionType} from "../../../../helpers/types/workflows";
import {ChangeEvent} from "react";

const TextInputs = ({
                      newStep,
                      setNewStep,
                      parametersMap,
                    }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  parametersMap: any;
}) => {
  let textInputs: { [key: string]: { title: string, editDescription?: string, defaultValue?: string} } | Record<string, never> = {};
  if (newStep !== null && newStep.name) {
    textInputs =
      parametersMap[newStep?.name as WorkflowStepActionType]
        .textInputParameters;
  }
  const textInputNames = Object.keys(textInputs);

  const handleTextInput = (
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

  const parameterValue = (textInputKey: string) => {
    if (
      newStep !== null &&
      newStep.name &&
      newStep.parameters &&
      newStep.parameters[textInputKey as keyof typeof newStep.parameters]
    ) {
      return newStep.parameters[
        textInputKey as keyof typeof newStep.parameters
        ] as WorkflowStepActionType;
    } else if (parametersMap[newStep?.name as WorkflowStepActionType].textInputParameters[textInputKey].defaultValue) {
      return parametersMap[newStep?.name as WorkflowStepActionType].textInputParameters[textInputKey].defaultValue;
    } else {
      return '';
    }
  };

  return (
    <>
      {textInputNames.length > 0 &&
        newStep !== null &&
        newStep.name &&
        textInputs &&
        textInputNames.map((textInputKey) => (
          <div key={textInputKey}>
            <div className="text-sm text-neutral-900 mt-4">
              {textInputs[textInputKey as WorkflowStepActionType].title}:
            </div>

            {textInputs[textInputKey as WorkflowStepActionType]?.editDescription &&
              <div className="text-xs text-neutral-700 mb-2">
                {textInputs[textInputKey as WorkflowStepActionType].editDescription}</div>}

            <input
              type="text"
              className="border border-neutral-300 rounded-md p-2 w-full nodrag nowheel"
              value={parameterValue(textInputKey)}
              onInput={(event: ChangeEvent<HTMLInputElement>) =>
                handleTextInput(event, textInputKey)
              }
            />
          </div>
        ))}
    </>
  );
};

export default TextInputs;
