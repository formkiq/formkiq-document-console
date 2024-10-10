import { Listbox } from '@headlessui/react';
import {
  WorkflowStepActionParameters,
  WorkflowStepActionType,
} from '../../../helpers/types/workflows';
import { ChevronRight } from '../../Icons/icons';
import { useWorkflowActionMap } from '../../../hooks/workflow-action-map.hook';

type Action = {
  type: WorkflowStepActionType | '';
  parameters?: WorkflowStepActionParameters;
  queueId?: string;
};

export const ActionSelector = ({
  newAction,
  setNewAction,
}: {
  newAction: Action | null;
  setNewAction: (step: Action | null) => void;
}) => {
  const actionsMap = useWorkflowActionMap()
  const filteredActionsMap = Object.fromEntries(
    Object.entries(actionsMap).filter(([key]) =>
      !['QUEUE'].includes(key)
    )
  );

  const selectAction = (name: WorkflowStepActionType | '') => {
    let action: Action | null = null;
    action = {
      type: name,
    };
    setNewAction(action);
  };

  const actionsNames: { [key: string]: string }[] = Object.keys(filteredActionsMap).map(
    (key) => ({
      [key as WorkflowStepActionType]:
        actionsMap[key as WorkflowStepActionType],
    })
  );

  let actionType = 'Select Action...';
  if (newAction !== null && newAction.type) {
    actionType = actionsMap[newAction.type as WorkflowStepActionType];
  }

  return (
    <Listbox value="" onChange={selectAction}>
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag">
        <span className="block truncate">{actionType}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <div className="rotate-90 w-4">
            <ChevronRight />
          </div>
        </span>
      </Listbox.Button>
      <Listbox.Options className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
        {actionsNames.map((action) => (
          <Listbox.Option
            key={Object.keys(action)[0]}
            value={Object.keys(action)[0]}
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
              }`
            }
          >
            {action[Object.keys(action)[0]]}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
