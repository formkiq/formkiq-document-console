import { Listbox } from '@headlessui/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edge, Handle, NodeProps, Position } from 'reactflow';
import { v4 as uuid } from 'uuid';
import {
  addEdge,
  addNode,
  editNode,
  removeNode,
} from '../../../Store/reducers/workflows';
import type { RootState } from '../../../Store/store';
import {
  NodeType,
  Step,
  WorkflowNodeProps,
  WorkflowStepActionParameters,
  WorkflowStepActionType,
  parametersDoubleInnerType,
  parametersInnerType,
} from '../../../helpers/types/workflows';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import {
  Antivirus,
  ArrowRight,
  ChevronRight,
  Documents,
  Edit,
  EnvelopeClose,
  IntelligentClassification,
  Plus,
  Rule,
  Search,
  Trash,
  Wildcard,
} from '../../Icons/icons';
import {
  DefaultSourceHandle,
  DefaultTargetHandle,
  OneConditionSourceHandle,
} from '../Handles/handles';

const iconMap = {
  ANTIVIRUS: <Antivirus />,
  OCR: <Documents />,
  QUEUE: <Wildcard />,
  DOCUMENTTAGGING: <IntelligentClassification />,
  NOTIFICATION: <EnvelopeClose />,
  FULLTEXT: <Search />,
  WEBHOOK: <Rule />,
};

const getIcon = (name: keyof typeof iconMap) => iconMap[name];

const getNodeId = () => `node_${uuid()}`;
const getEdgeId = () => `node_${uuid()}`;

const parametersMap: Record<WorkflowStepActionType, parametersInnerType> = {
  DOCUMENTTAGGING: {
    title: 'Intelligent Document Classification',
    textInputParameters: {
      tags: '	Comma-delimited list of keywords',
    },
    selectParameters: {
      engine: {
        description: 'Tagging Engine to use',
        options: {
          chatgpt: 'ChatGPT',
        },
      },
    },
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  NOTIFICATION: {
    title: 'Send Notification (requires "FROM" address in SES)',
    textInputParameters: {
      notificationEmail: 'Notification Email',
      notificationToCc: 'Notification Carbon Copy',
      notificationToBcc: 'Notification Blind Carbon Copy',
      notificationSubject: 'Notification Subject',
      notificationText: 'Notification Text',
      notificationHtml: 'Notification HTML',
    },
    selectParameters: {
      notificationType: {
        description: 'Type of Notification',
        options: {
          email: 'Email',
        },
      },
    },
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  WEBHOOK: {
    title: 'Webhook',
    textInputParameters: {
      url: 'Webhook URL',
    },
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  OCR: {
    title: 'Optical Character Recognition (OCR)',
    textInputParameters: {},
    selectParameters: {
      ocrParseTypes: {
        description: 'OCR Parsing strategy to use',
        options: {
          TEXT: 'Text Recognition',
          FORMS: 'Form Recognition',
          TABLES: 'Table Recognition',
        },
      },
      ocrEngine: {
        description: 'OCR Engine to use',
        options: {
          TESSERACT: 'Tesseract',
          TEXTRACT: 'Textract',
        },
      },
    },
    checkboxParameters: {
      addPdfDetectedCharactersAsText: 'PDF Documents convert images to text',
    },
    decisions: ['APPROVE'],
  },
  FULLTEXT: {
    title: 'Fulltext Search',
    textInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  ANTIVIRUS: {
    title: 'Anti-Malware Scan',
    textInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE', 'REJECT'],
  },
  QUEUE: {
    title: 'Review / Approval Queue (DO NOT USE)',
    textInputParameters: {
      queueId: 'Queue Id',
    },
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE', 'REJECT'],
  },
};

export const DefaultNode = (props: NodeProps<WorkflowNodeProps>) => {
  const data = props.data;
  const icon = getIcon(data.label as keyof typeof iconMap) || <ArrowRight />;
  const dispatch = useDispatch();
  const edges: Edge[] = useSelector(
    (state: RootState) => state.workflowsState.edges
  );

  const getFirstFreeHandleId = () => {
    const freeHandles = ['approve', 'reject'];
    for (const edge of edges) {
      if (
        edge.source === props.id &&
        freeHandles.includes(edge.sourceHandle || '')
      ) {
        freeHandles.splice(freeHandles.indexOf(edge.sourceHandle || ''), 1);
      }
    }
    return freeHandles[0];
  };

  const firstFreeHandleId = getFirstFreeHandleId();

  const addCreatorNode = () => {
    const createCreatorNode = (
      x: number,
      y: number,
      targetId: string,
      sourceHandle = 'approve'
    ) => {
      const id = getNodeId();
      const newNode = {
        id,
        position: { x: x + 300, y: y },
        data: { label: '' },
        type: 'creatorNode',
      };
      const newEdge = {
        id: getEdgeId(),
        source: targetId,
        target: id,
        sourceHandle: sourceHandle,
      };
      dispatch(addNode(newNode));
      dispatch(addEdge(newEdge));
    };
    createCreatorNode(props.xPos, props.yPos, props.id, firstFreeHandleId);
  };

  const openNodeEditor = () => {
    dispatch(editNode({ id: props.id, changes: { type: 'creatorNode' } }));
  };

  const nodeName = data.label as keyof typeof parametersMap;
  const parametersInfo = parametersMap[nodeName];

  const MAX_CONNECTIONS = parametersInfo.decisions.length;
  const connectionsNumber = edges.filter((e) => e.source === props.id).length;
  const isHandleConnectable = useMemo(() => {
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);

  return (
    <>
      <DefaultTargetHandle type="target" id="a" position={Position.Left} />
      {props.selected && (
        <div className="absolute top-[-30px] right-0 flex flex-row gap-2 ">
          <div
            className="w-6 h-6 rounded-full border-2 bg-white text-gray-400  p-1 cursor-pointer  border-gray-400 hover:text-gray-600 hover:border-gray-600 hover:bg-gray-100 nodrag"
            onClick={openNodeEditor}
          >
            <Edit />
          </div>
          <div
            className="w-6 h-6 rounded-full border-2 bg-white text-gray-400  p-1 cursor-pointer border-gray-400 hover:text-gray-600 hover:border-gray-600 hover:bg-gray-100 nodrag"
            onClick={() => dispatch(removeNode(props.id))}
          >
            <Trash />
          </div>
        </div>
      )}
      <div
        className={`w-52 bg-gray-200 min-h-16 rounded-md p-2 shadow-sm box-content break-words ${
          props.selected && 'border-2 border-gray-500 bo'
        } hover:shadow`}
      >
        <div className="p-1 tracking-normal font-bold bg-blue-100 flex border-t border-gray-700 border flex-row items-start">
          <div className="w-6 mr-1 mt-1">{icon}</div>
          {parametersInfo.title}
        </div>
        {data?.parameters && (
          <div className="h-px bg-gray-400 my-1.5 w-full"></div>
        )}

        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div>
            {Object.keys(data.parameters).map((key: string) => (
              <div key={`${key}_${props.id}`}>
                {/*Select parameters*/}
                {parametersInfo.selectParameters[key] &&
                  parametersInfo.selectParameters[key]?.description && (
                    <div className="my-2">
                      <div className="text-gray-600 text-sm">
                        {parametersInfo.selectParameters[key].description}:{' '}
                        <span className="text-sm text-gray-800 font-medium ">
                          {data?.parameters &&
                            parametersInfo.selectParameters[key].options[
                              data.parameters[
                                key as keyof WorkflowStepActionParameters
                              ] as string
                            ]}
                        </span>
                      </div>
                    </div>
                  )}

                {/*Text input parameters*/}
                {parametersInfo.textInputParameters[key] && (
                  <div className="my-2">
                    <div className="text-gray-600 text-sm">
                      {parametersInfo.textInputParameters[key]}:{' '}
                      <span className="text-sm text-gray-800 font-medium ">
                        {data?.parameters &&
                          (data.parameters[
                            key as keyof WorkflowStepActionParameters
                          ] === ''
                            ? '-'
                            : data.parameters[
                                key as keyof WorkflowStepActionParameters
                              ])}
                      </span>
                    </div>
                  </div>
                )}

                {/*Checkbox parameters*/}
                {parametersInfo.checkboxParameters[key] && (
                  <div className="my-2">
                    <div className="text-gray-600 text-sm">
                      {parametersInfo.checkboxParameters[key]}:{' '}
                      <span className="text-sm text-gray-800 font-medium ">
                        {data?.parameters &&
                          (data.parameters[
                            key as keyof WorkflowStepActionParameters
                          ] === 'true' ||
                          data.parameters[
                            key as keyof WorkflowStepActionParameters
                          ] === true
                            ? 'Yes'
                            : 'No')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {parametersInfo.decisions.length === 1 && (
        <DefaultSourceHandle
          type="source"
          position={Position.Right}
          id="approve"
          maxConnections={1}
          nodeId={props.id}
        ></DefaultSourceHandle>
      )}

      {parametersInfo.decisions.length === 2 && (
        <>
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={props.id}
            maxConnections={1}
            top="33%"
            id="approve"
          />
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={props.id}
            maxConnections={1}
            top="66%"
            id="reject"
          />
        </>
      )}

      {isHandleConnectable && (
        <div
          className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1  cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"
          style={{ top: 'calc(50% - 12px)' }}
          onClick={addCreatorNode}
        >
          <Plus />
        </div>
      )}
    </>
  );
};

export const CreatorNode = (props: NodeProps<WorkflowNodeProps>) => {
  const editedStep: Step = {
    id: props.id,
    name: props.data.label,
  };
  editedStep.type = 'defaultNode';
  editedStep.parameters = props.data?.parameters;

  const [newStep, setNewStep] = useState<Step | null>(editedStep);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const dispatch = useDispatch();

  // Show/hide Add button if selection is not complete
  //  TODO: check later!
  useEffect(() => {
    let isDisabled = true;
    if (newStep) {
      if (newStep.name !== '') {
        isDisabled = false;
      }
    }
    setIsAddButtonDisabled(isDisabled);
  }, [newStep]);

  const onAdd = (step: Step) => {
    const position = {
      x: props.xPos,
      y: props.yPos,
    };

    const newNode: NodeType = {
      id: step.id,
      position: position,
      data: {
        label: step.name,
      },
    };
    newNode.type = step.type;
    newNode.data.parameters = step.parameters;
    dispatch(editNode({ id: props.id, changes: newNode }));
    setNewStep(null);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id="a" />
      <div
        className={`w-72 bg-gray-200 min-h-16 rounded-md p-2  shadow-sm box-content ${
          props.selected && 'border-2 border-gray-500'
        } hover:shadow`}
      >
        <div className="mb-2">Step Editor</div>
        <NodeNameSelector newStep={newStep} setNewStep={setNewStep} />
        <ParametersSelectors newStep={newStep} setNewStep={setNewStep} />
        <TextInputs newStep={newStep} setNewStep={setNewStep} />
        <CheckBoxes newStep={newStep} setNewStep={setNewStep} />
        {!isAddButtonDisabled && newStep !== null && (
          <ButtonGhost className="nodrag mt-4" onClick={() => onAdd(newStep)}>
            Save
          </ButtonGhost>
        )}
      </div>
    </>
  );
};

const NodeNameSelector = ({
  newStep,
  setNewStep,
}: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
}) => {
  // First step of creating new node - set name.
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
    const stepParameters = parametersMap[name as WorkflowStepActionType];
    for (const selectParameter in stepParameters.selectParameters) {
      step.parameters = {
        ...step.parameters,
        [selectParameter]: Object.keys(
          stepParameters.selectParameters[selectParameter].options
        )[0],
      };
    }

    for (const textInputParameter in stepParameters.textInputParameters) {
      step.parameters = {
        ...step.parameters,
        [textInputParameter]: '',
      };
    }

    for (const checkboxParameter in stepParameters.checkboxParameters) {
      step.parameters = {
        ...step.parameters,
        [checkboxParameter]: false,
      };
    }

    setNewStep(step);
  };

  const stepsNames: { [key: string]: string }[] = Object.keys(
    parametersMap
  ).map((key) => ({
    [key as WorkflowStepActionType]:
      parametersMap[key as WorkflowStepActionType].title,
  }));

  let stepName = 'Select Step...';
  if (newStep !== null && newStep.name) {
    stepName = parametersMap[newStep.name as WorkflowStepActionType].title;
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

const ParametersSelectors = ({
  newStep,
  setNewStep,
}: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
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
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag nowheel">
                <span className="block truncate">
                  {parameterValue(selectorKey)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <div className="rotate-90 w-4">
                    <ChevronRight />
                  </div>
                </span>
              </Listbox.Button>
              <Listbox.Options className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
                {Object.keys(
                  selectors[selectorKey as WorkflowStepActionType].options
                ).map((optionKey) => (
                  <Listbox.Option
                    key={optionKey}
                    value={optionKey}
                    className={({ active }) =>
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

const TextInputs = ({
  newStep,
  setNewStep,
}: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
}) => {
  let textInputs: { [key: string]: string } | Record<string, never> = {};
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
            <div className="text-sm text-gray-800 mt-4 mb-2">
              {textInputs[textInputKey as WorkflowStepActionType]}:
            </div>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full nodrag nowheel"
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

const CheckBoxes = ({
  newStep,
  setNewStep,
}: {
  newStep: Step | null;
  setNewStep: (step: Step | null) => void;
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
      console.log(
        newStep.parameters[
          checkBoxesKey as keyof typeof newStep.parameters
        ] as boolean,
        'test'
      );
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
