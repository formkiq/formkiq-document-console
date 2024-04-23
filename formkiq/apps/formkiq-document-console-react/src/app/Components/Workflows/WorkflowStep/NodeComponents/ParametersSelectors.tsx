import {parametersDoubleInnerType, Step, WorkflowStepActionType} from "../../../../helpers/types/workflows";
import {Listbox} from "@headlessui/react";
import {ChevronRight} from "../../../Icons/icons";

const ParametersSelectors = ({
                               newStep,
                               setNewStep,
                               parametersMap,
                             }: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
  parametersMap: any;
}) => {
  let selectors:
    | { [key: string]: parametersDoubleInnerType }
    | Record<string, never> = {};
  if (newStep !== null && newStep.name) {
    selectors =
      parametersMap[newStep?.name as WorkflowStepActionType].selectParameters;
  }
  const selectorNames = Object.keys(selectors);

  const handleSelectStepParameter = (
    name: WorkflowStepActionType | '',
    parameterName: string
  ) => {
    if (!newStep) return;
    const step: Step = {
      ...newStep,
      parameters: {
        ...newStep.parameters,
        [parameterName]: name,
      },
    };
    setNewStep(step);
  };
  const parameterValue = (selectorKey: string) => {
    if (
      newStep !== null &&
      newStep.name &&
      newStep.parameters &&
      newStep.parameters[selectorKey as keyof typeof newStep.parameters]
    ) {
      return selectors[selectorKey as WorkflowStepActionType].options[
        newStep.parameters[
          selectorKey as keyof typeof newStep.parameters
          ] as WorkflowStepActionType
        ];
    } else {
      return 'Select ...';
    }
  };
  return (
    <>
      {selectorNames.length > 0 &&
        newStep !== null &&
        newStep.name &&
        selectors &&
        selectorNames.map((selectorKey) => (
          <div key={selectorKey}>
            <div className="text-sm text-gray-800 mt-4 mb-2">
              {selectors[selectorKey as WorkflowStepActionType].description}:
            </div>
            <Listbox
              value=""
              onChange={(value: WorkflowStepActionType | '') =>
                handleSelectStepParameter(value, selectorKey)
              }
            >
              <Listbox.Button
                className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag nowheel">
                <span className="block truncate">
                  {parameterValue(selectorKey)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="rotate-90 w-4">
                    <ChevronRight/>
                  </div>
                </span>
              </Listbox.Button>
              <Listbox.Options
                className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
                {Object.keys(
                  selectors[selectorKey as WorkflowStepActionType].options
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
                      selectors[selectorKey as WorkflowStepActionType].options[
                        optionKey
                        ]
                    }
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        ))}
    </>
  );
};

export default ParametersSelectors;
