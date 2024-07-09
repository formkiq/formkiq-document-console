import {useEffect, useState,} from 'react';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {Edge, Handle, NodeProps, Position} from 'reactflow';
import {v4 as uuid} from 'uuid';
import {useAuthenticatedState} from '../../../Store/reducers/auth';
import {addEdge, addNode, editNode, removeNode,} from '../../../Store/reducers/workflows';
import type {RootState} from '../../../Store/store';
import {useAppDispatch} from '../../../Store/store';
import {getCurrentSiteInfo, getUserSites,} from '../../../helpers/services/toolService';
import {
  NodeType,
  Step,
  WorkflowNodeProps,
} from '../../../helpers/types/workflows';
import ButtonGhost from '../../Generic/Buttons/ButtonGhost';
import {Edit, Trash,} from '../../Icons/icons';
import {DefaultTargetHandle,} from '../Handles/handles';
import DocumentTagging from './Steps/DocumentTagging';
import Notification from './Steps/Notification';
import Webhook from './Steps/Webhook';
import Ocr from './Steps/Ocr'
import FulltextSearch from "./Steps/FulltextSearch";
import Antivirus from "./Steps/Antivirus";
import Queue from './Steps/Queue';
import {NodeNameSelector} from "./NodeComponents/NodeNameSelector";
import Publish from "./Steps/Publish";


const getNodeId = () => `node_${uuid()}`;
const getEdgeId = () => `edge_${uuid()}`;

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

  return (
    <>
      <DefaultTargetHandle type="target" id="a" position={Position.Left}/>
      {props.selected && (
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
        {data?.label === 'FULLTEXT' && (
          <FulltextSearch isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
        {data?.label === 'ANTIVIRUS' && (
          <Antivirus isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
        {data?.label === 'QUEUE' && (
          <Queue isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}
                 siteId={siteId}/>
        )}
        {data?.label === 'PUBLISH' && (
          <Publish isEditing={false} data={data} edges={edges} id={props.id} addCreatorNode={addCreatorNode}/>
        )}
      </div>
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
  editedStep.queue = props.data?.queue;

  const [newStep, setNewStep] = useState<Step | null>(editedStep);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const dispatch = useAppDispatch();

  // Show/hide Add button if selection is not complete
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

  const onChange = (value: any, key: any) => {
    setNewStep((prev: any) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: value,
      },
    }))
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
        {!newStep?.name && <NodeNameSelector newStep={newStep} setNewStep={setNewStep} info={undefined}/>}

        {newStep?.name === 'DOCUMENTTAGGING' && (
          <DocumentTagging newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'NOTIFICATION' && (
          <Notification newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'WEBHOOK' && (
          <Webhook newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'OCR' && (
          <Ocr newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'FULLTEXT' && (
          <FulltextSearch newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'ANTIVIRUS' && (
          <Antivirus newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}
        {newStep?.name === 'QUEUE' && (
          <Queue newStep={newStep} setNewStep={setNewStep} isEditing={true} site onChange={onChange}/>
        )}
        {newStep?.name === 'PUBLISH' && (
            <Publish newStep={newStep} setNewStep={setNewStep} isEditing={true} onChange={onChange}/>
        )}

        {!isAddButtonDisabled && newStep !== null && (
          <ButtonGhost className="nodrag mt-4" onClick={() => onAdd(newStep)}>
            Save
          </ButtonGhost>
        )}
      </div>
    </>
  );
};

