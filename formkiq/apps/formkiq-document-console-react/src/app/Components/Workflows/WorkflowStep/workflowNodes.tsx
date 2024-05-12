import { Listbox } from '@headlessui/react';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Edge, Handle, NodeProps, Position } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useAuthenticatedState } from '../../../Store/reducers/auth';
import {
  addEdge,
  addNode,
  editNode,
  removeNode,
} from '../../../Store/reducers/workflows';
import type { RootState } from '../../../Store/store';
import { useAppDispatch } from '../../../Store/store';
import { DocumentsService } from '../../../helpers/services/documentsService';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../../helpers/services/toolService';
import {
  NodeType,
  Step,
  WorkflowNodeProps,
  WorkflowStepActionParameters,
  WorkflowStepActionType,
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
// import ParametersSelectors from "./NodeComponents/ParametersSelectors";
// import TextInputs from "./NodeComponents/TextInputs";
// import CheckBoxes from "./NodeComponents/Checkboxes";
import QueueSelector from "./NodeComponents/QueueSelector";
import ApprovalGroupsSelector from "./NodeComponents/ApprovalGroupsSelector";
// import NumberInputs from './NodeComponents/NumberInputs';
import DocumentTagging from './Steps/DocumentTagging';
import Notification from './Steps/Notification';
import Webhook from './Steps/Webhook';
import Ocr  from './Steps/Ocr'

const iconMap = {
  ANTIVIRUS: <Antivirus/>,
  OCR: <Documents/>,
  QUEUE: <Wildcard/>,
  DOCUMENTTAGGING: <IntelligentClassification/>,
  NOTIFICATION: <EnvelopeClose/>,
  FULLTEXT: <Search/>,
  WEBHOOK: <Rule/>,
};

const getIcon = (name: keyof typeof iconMap) => iconMap[name];

const getNodeId = () => `node_${uuid()}`;
const getEdgeId = () => `node_${uuid()}`;

const parametersMap: Record<WorkflowStepActionType, parametersInnerType> = {
  DOCUMENTTAGGING: {
    title: 'Intelligent Document Classification',
    textInputParameters: {
      tags: {title: 'Comma-delimited list of keywords'},
    },
    numberInputParameters: {},
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
      notificationEmail: {title: 'Notification Email'},
      notificationToCc: {title:'Notification Carbon Copy'},
      notificationToBcc: {title:'Notification Blind Carbon Copy'},
      notificationSubject: {title:'Notification Subject'},
      notificationText: {title:'Notification Text'},
      notificationHtml: {title:'Notification HTML'},
    },
    numberInputParameters: {},
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
      url: {title: 'Webhook URL'},
    },
    numberInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  OCR: {
    title: 'Optical Character Recognition (OCR)',
    textInputParameters: {},
    numberInputParameters: {
      ocrNumberOfPages: {
        title: 'Number of Pages to Process (from start)',
        editDescription: '(from start) - use "-1" for no limit',
        defaultValue: -1,
        min: -1,
      },
    },
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
      addPdfDetectedCharactersAsText: {
        title: 'PDF Documents convert images to text',
      },
    },
    decisions: ['APPROVE'],
  },
  FULLTEXT: {
    title: 'Fulltext Search',
    textInputParameters: {},
    numberInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE'],
  },
  ANTIVIRUS: {
    title: 'Anti-Malware Scan',
    textInputParameters: {},
    numberInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE', 'REJECT'],
  },
  QUEUE: {
    title: 'Review / Approval Queue (DO NOT USE)',
    textInputParameters: {},
    numberInputParameters: {},
    selectParameters: {},
    checkboxParameters: {},
    decisions: ['APPROVE', 'REJECT'],
    queue: true,
    approvalGroups: true,
  },
};

export const DefaultNode = (props: NodeProps<WorkflowNodeProps>) => {
  const {user} = useAuthenticatedState();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const data = props.data;
  const icon = getIcon(data.label as keyof typeof iconMap) || <ArrowRight/>;
  const dispatch = useAppDispatch();
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
        position: {x: x + 300, y: y},
        data: {label: ''},
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
    dispatch(editNode({id: props.id, changes: {type: 'creatorNode'}}));
  };

  const nodeName = data.label as keyof typeof parametersMap;
  const parametersInfo = parametersMap[nodeName];
  const MAX_CONNECTIONS = parametersInfo.decisions.length;
  const connectionsNumber = edges.filter((e) => e.source === props.id).length;
  const isHandleConnectable = useMemo(() => {
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);
  const [queue, setQueue] = useState<string | null>(null);

  useEffect(() => {
    if (!data.queue) return;
    if (data.queue.queueId) {
      DocumentsService.getQueue(siteId, data.queue.queueId).then((res) => {
        if (res.status === 200) setQueue(res.name);
      });
    }
  }, [data.queue]);

  return (
    <>
      <DefaultTargetHandle type="target" id="a" position={Position.Left}/>
      {props.selected && parametersInfo?.title && (
        <div className="absolute top-[-30px] right-0 flex flex-row gap-2 ">
          <div
            className="w-6 h-6 rounded-full border-2 bg-white text-gray-400  p-1 cursor-pointer  border-gray-400 hover:text-gray-600 hover:border-gray-600 hover:bg-gray-100 nodrag"
            onClick={openNodeEditor}
          >
            <Edit/>
          </div>
          <div
            className="w-6 h-6 rounded-full border-2 bg-white text-gray-400  p-1 cursor-pointer border-gray-400 hover:text-gray-600 hover:border-gray-600 hover:bg-gray-100 nodrag"
            onClick={() => dispatch(removeNode(props.id))}
          >
            <Trash/>
          </div>
        </div>
      )}
      <div
        className={`w-52 bg-gray-200 min-h-16 rounded-md p-2 shadow-sm box-content break-words ${
          props.selected && 'border-2 border-gray-500 bo'
        } hover:shadow`}
      >
        <div
          className="p-1 tracking-normal font-bold bg-blue-100 flex border-t border-gray-700 border flex-row items-start">
          <div className="w-6 mr-1 mt-1">{icon}</div>
          {parametersInfo.title}
        </div>
        {data?.parameters && (
          <div className="h-px bg-gray-400 my-1.5 w-full"></div>
        )}
        {data?.label === 'DOCUMENTTAGGING' && (
          <DocumentTagging isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
        {data?.label === 'NOTIFICATION' && (
          <Notification isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
        {data?.label === 'WEBHOOK' && (
          <Webhook isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
        {data?.label === 'OCR' && (
              <Ocr isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
          )}

        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <>
            {Object.keys(data.parameters).map((key: string) => (
              <React.Fragment key={`${key}_${props.id}`}>
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
                      {parametersInfo.textInputParameters[key].title}:{' '}
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

                {/*Number input parameters*/}
                {parametersInfo.numberInputParameters[key] && (
                  <div className="my-2">
                    <div className="text-gray-600 text-sm">
                      {parametersInfo.numberInputParameters[key].title}:{' '}
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
                      {parametersInfo.checkboxParameters[key].title}:{' '}
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
              </React.Fragment>
            ))}
          </>
        )}
        {/*Queue*/}
        {parametersInfo.queue && (
          <>
            <div className="my-2">
              <div className="text-gray-600 text-sm">
                Queue:{' '}
                <span className="text-sm text-gray-800 font-medium ">
                  {queue ? queue : '-'}
                </span>
              </div>
            </div>
            <div className="my-2">
              <div className="text-gray-600 text-sm">
                Approval Groups:{' '}
                <span className="text-sm text-gray-800 font-medium ">
                  {data?.queue?.approvalGroups &&
                  data.queue.approvalGroups.length > 0
                    ? data.queue.approvalGroups.join(', ')
                    : '-'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/*{parametersInfo.decisions.length === 1 && (*/}
      {/*  <DefaultSourceHandle*/}
      {/*    type="source"*/}
      {/*    position={Position.Right}*/}
      {/*    id="approve"*/}
      {/*    maxConnections={1}*/}
      {/*    nodeId={props.id}*/}
      {/*  ></DefaultSourceHandle>*/}
      {/*)}*/}

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

      {/*{isHandleConnectable && (*/}
      {/*  <div*/}
      {/*    className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1  cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"*/}
      {/*    style={{ top: 'calc(50% - 12px)' }}*/}
      {/*    onClick={addCreatorNode}*/}
      {/*  >*/}
      {/*    <Plus />*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
};

export const CreatorNode = (props: NodeProps<WorkflowNodeProps>) => {
  const {user} = useAuthenticatedState();
  const {hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites} =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const {siteId} = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const editedStep: Step = {
    id: props.id,
    name: props.data.label,
  };
  editedStep.type = 'defaultNode';
  editedStep.parameters = props.data?.parameters;
  editedStep.queue = props.data?.queue;

  const [newStep, setNewStep] = useState<Step | null>(editedStep);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const dispatch = useAppDispatch();

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
    if (step.queue) {
      newNode.data.queue = step.queue;
    }
    dispatch(editNode({id: props.id, changes: newNode}));
    setNewStep(null);
  };
  return (
    <>
      <Handle type="target" position={Position.Left} id="a"/>
      <div
        className={`w-72 bg-gray-200 min-h-16 rounded-md p-2  shadow-sm box-content ${
          props.selected && 'border-2 border-gray-500'
        } hover:shadow`}
      >
        <div className="mb-2">Step Editor</div>
        <NodeNameSelector newStep={newStep} setNewStep={setNewStep}/>

        {newStep?.name === 'DOCUMENTTAGGING' && (
          <DocumentTagging newStep={newStep} setNewStep={setNewStep} isEditing={true}/>
        )}
        {newStep?.name === 'NOTIFICATION' && (
          <Notification newStep={newStep} setNewStep={setNewStep} isEditing={true}/>
        )}
        {newStep?.name === 'WEBHOOK' && (
          <Webhook newStep={newStep} setNewStep={setNewStep} isEditing={true}/>
        )}
        {newStep?.name === 'OCR' && (
              <Ocr newStep={newStep} setNewStep={setNewStep} isEditing={true}/>
          )}


        {/*<ParametersSelectors newStep={newStep} setNewStep={setNewStep} parametersMap={parametersMap}/>*/}
        {/*<TextInputs newStep={newStep} setNewStep={setNewStep} parametersMap={parametersMap}/>*/}
        {/*<NumberInputs newStep={newStep} setNewStep={setNewStep} parametersMap={parametersMap}/>*/}
        {/*<CheckBoxes newStep={newStep} setNewStep={setNewStep} parametersMap={parametersMap}/>*/}
        <QueueSelector
          newStep={newStep}
          setNewStep={setNewStep}
          siteId={siteId}
          parametersMap={parametersMap}/>
        <ApprovalGroupsSelector
          newStep={newStep}
          setNewStep={setNewStep}
          siteId={siteId}
          parametersMap={parametersMap}/>

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
      if (stepParameters.textInputParameters[textInputParameter].defaultValue) {
        step.parameters = {
          ...step.parameters,
          [textInputParameter]: stepParameters.textInputParameters[textInputParameter].defaultValue,
        }
      } else {
        step.parameters = {
          ...step.parameters,
          [textInputParameter]: '',
        };
      }
    }
    for (const numberInputParameter in stepParameters.numberInputParameters) {
      if (stepParameters.numberInputParameters[numberInputParameter].defaultValue) {
        step.parameters = {
          ...step.parameters,
          [numberInputParameter]: stepParameters.numberInputParameters[numberInputParameter].defaultValue,
        }
      } else {
        step.parameters = {
          ...step.parameters,
          [numberInputParameter]: 0,
        };
      }
    }

    for (const checkboxParameter in stepParameters.checkboxParameters) {
      if (stepParameters.checkboxParameters[checkboxParameter].defaultValue) {
        step.parameters = {
          ...step.parameters,
          [checkboxParameter]: stepParameters.checkboxParameters[checkboxParameter].defaultValue,
        }
      } else {
        step.parameters = {
          ...step.parameters,
          [checkboxParameter]: false,
        };
      }
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
      <Listbox.Button
        className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 nodrag">
        <span className="block truncate">{stepName}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <div className="rotate-90 w-4">
            <ChevronRight/>
          </div>
        </span>
      </Listbox.Button>
      <Listbox.Options
        className="mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm nodrag nowheel">
        {stepsNames.map((step) => (
          <Listbox.Option
            key={Object.keys(step)[0]}
            value={Object.keys(step)[0]}
            className={({active}) =>
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
