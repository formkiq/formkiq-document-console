import { Listbox } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import {
  Step,
  WorkflowStepActionType,
} from '../../../../helpers/types/workflows';
import { ConfigState } from '../../../../Store/reducers/config';
import { ChevronRight } from '../../../Icons/icons';

export const NodeNameSelector = ({
  newStep,
  setNewStep,
}: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
}) => {
  const { formkiqVersion } = useSelector(ConfigState);
  const parametersMap: Record<string, string> = {
    EVENTBRIDGE: 'Amazon EventBridge',
  };
  if (formkiqVersion.modules.indexOf('antivirus') > -1) {
    parametersMap['ANTIVIRUS'] = 'Anti-Malware Scan';
  }
  if (
    formkiqVersion.modules.indexOf('typesense') > -1 ||
    formkiqVersion.modules.indexOf('opensearch') > -1
  ) {
    parametersMap['FULLTEXT'] = 'Fulltext Search';
  }
  parametersMap['IDP'] = 'Intelligent Document Processing';
  parametersMap['DOCUMENTTAGGING'] = 'Intelligent Document Tagging with OpenAI';
  parametersMap['OCR'] = 'Optical Character Recognition (OCR)';
  parametersMap['PUBLISH'] = 'Publish';
  parametersMap['QUEUE'] = 'Review / Approval Queue';
  parametersMap['NOTIFICATION'] =
    'Send Notification (requires "FROM" address in SES)';
  parametersMap['WEBHOOK'] = 'Webhook';

  const getNodeId = () => `node_${uuid()}`;
  // Set name
  const selectStepName = (name: WorkflowStepActionType | '') => {
    let step: Step | null = null;
    const type = 'defaultNode';
    if (newStep === null) {
      step = {
        id: getNodeId(),
        name: name,
        type: type,
      };
    } else {
      step = {
        id: newStep.id,
        position: newStep.position,
        name: name,
        type: type,
      };
    }
    setNewStep(step);
  };

  const stepsNames: { [key: string]: string }[] = Object.keys(
    parametersMap
  ).map((key) => ({
    [key as WorkflowStepActionType]:
      parametersMap[key as WorkflowStepActionType],
  }));

  let stepName = 'Select Step...';
  if (newStep !== null && newStep.name) {
    stepName = parametersMap[newStep.name as WorkflowStepActionType];
  }

  return (
    <Listbox value="" onChange={selectStepName}>
      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag">
        <span className="block truncate">{stepName}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <div className="rotate-90 w-4">
            <ChevronRight />
          </div>
        </span>
      </Listbox.Button>
      <Listbox.Options className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
        {stepsNames.map((step) => (
          <Listbox.Option
            key={Object.keys(step)[0]}
            value={Object.keys(step)[0]}
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
              }`
            }
          >
            {step[Object.keys(step)[0]]}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
