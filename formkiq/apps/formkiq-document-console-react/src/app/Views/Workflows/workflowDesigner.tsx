import * as dagre from 'dagre';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';
import ButtonPrimary from '../../Components/Generic/Buttons/ButtonPrimary';
import ButtonSecondary from '../../Components/Generic/Buttons/ButtonSecondary';
import { Edit, Trash } from '../../Components/Icons/icons';
import {
  CreatorNode,
  DefaultNode,
} from '../../Components/Workflows/WorkflowStep/workflowNodes';
import { useAuthenticatedState } from '../../Store/reducers/auth';
import { openDialog as openNotificationDialog } from '../../Store/reducers/globalNotificationControls';
import { openDialog as openConfirmationDialog } from '../../Store/reducers/globalConfirmControls';
import {
  addEdge,
  addNode,
  fetchWorkflow,
  onEdgesChange,
  onNodesChange,
  setNodes,
  setWorkflow,
  updateWorkflowSteps,
} from '../../Store/reducers/workflows';
import type { RootState } from '../../Store/store';
import { useAppDispatch } from '../../Store/store';
import {
  getCurrentSiteInfo,
  getUserSites,
} from '../../helpers/services/toolService';
import { NodeType } from '../../helpers/types/workflows';
import { DocumentsService } from '../../helpers/services/documentsService';
// import {DocumentsService} from "../../helpers/services/documentsService";

const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getNodeId = () => `node_${uuid()}`;
const getEdgeId = () => `edge_${uuid()}`;

export function WorkflowDesigner() {
  const nodes: NodeType[] = useSelector(
    (state: RootState) => state.workflowsState.nodes
  );
  const edges: Edge[] = useSelector(
    (state: RootState) => state.workflowsState.edges
  );
  const workflow = useSelector(
    (state: RootState) => state.workflowsState.workflow
  );
  const dispatch = useAppDispatch();
  const { user } = useAuthenticatedState();
  const { hasUserSite, hasDefaultSite, hasWorkspaces, workspaceSites } =
    getUserSites(user);
  const pathname = decodeURI(useLocation().pathname);
  const { siteId } = getCurrentSiteInfo(
    pathname,
    user,
    hasUserSite,
    hasDefaultSite,
    hasWorkspaces,
    workspaceSites
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowId = searchParams.get('workflowId');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [editWorkflowInfo, setEditWorkflowInfo] = useState(false);
  const [workflowInfo, setWorkflowInfo] = useState({
    name: workflow.name,
    description: workflow.description,
  });

  const getLayoutedElements = (nodes: NodeType[], edges: any, options: any) => {
    g.setGraph({
      rankdir: options.direction,
      nodesep: options.nodesep,
      edgesep: options.edgesep,
      ranksep: options.ranksep,
    });

    edges.forEach((edge: any) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node: NodeType) =>
      g.setNode(node.id, { ...node, width: 208 })
    );
    dagre.layout(g);

    return {
      nodes: nodes.map((node) => {
        const { x, y } = g.node(node.id);
        return { ...node, position: { x, y } };
      }),
      edges,
    };
  };

  const direction = 'LR';

  // Change nodes position after workflow loading complete
  useEffect(() => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, {
      direction,
      nodesep: 300,
      edgesep: 50,
      ranksep: 100,
    });
    dispatch(setNodes(layoutedNodes));
    setWorkflowInfo({ name: workflow.name, description: workflow.description });
  }, [loadingComplete]);

  useEffect(() => {
    dispatch(fetchWorkflow({ siteId, workflowId })).then(() => {
      setLoadingComplete(true);
    });
  }, []);

  const [sourceId, setSourceId] = useState<string | null>(null);
  const [sourceHandleId, setSourceHandleId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: any) => {
      const newEdge: Edge = {
        ...params,
        id: getEdgeId(),
        markerEnd: { type: MarkerType.Arrow },
      };
      dispatch(addEdge(newEdge));
    },
    [edges]
  );
  const nodeTypes = useMemo(
    () => ({
      defaultNode: DefaultNode,
      creatorNode: CreatorNode,
    }),
    []
  );

  const handleAddNode = useCallback(
    (source: string | null = null, handle: string | null = null) => {
      setSourceId(source);
      setSourceHandleId(handle);
      const sourceNode: NodeType | undefined = nodes.find(
        (node) => node.id === source
      );
      const position = {
        x: (sourceNode?.position.x || 0) + 300,
        y: sourceNode?.position.y || 0,
      };
      const id = getNodeId();
      const creatorNode: NodeType = {
        id,
        position: position,
        data: {
          label: '',
          sourceId: source,
          sourceHandleId: handle,
        },
        type: 'creatorNode',
      };

      const connection = {
        id: getEdgeId(),
        source: source || '',
        target: id,
        markerEnd: { type: MarkerType.Arrow },
        sourceHandle: handle,
      };

      dispatch(addNode(creatorNode));
      dispatch(addEdge(connection));
    },
    [nodes, edges]
  );

  // Add Node On Edge Drop
  const onConnectStart = useCallback((_: any, { nodeId, handleId }: any) => {
    setSourceId(nodeId);
    setSourceHandleId(handleId);
  }, []);

  const onConnectEnd = useCallback(
    (event: any) => {
      if (!sourceId || !sourceHandleId) return;
      const targetIsPane = event.target.classList.contains('react-flow__pane');
      if (targetIsPane) {
        handleAddNode(sourceId, sourceHandleId);
      }
    },
    [sourceId, sourceHandleId]
  );

  useEffect(() => {
    //console.log(edges, 'edges');
  }, [edges]);

  useEffect(() => {
    //console.log(nodes, 'nodes');
  }, [nodes]);

  const saveWorkflow = () => {
    dispatch(updateWorkflowSteps({ siteId, workflowId }));
  };
  const addStep = () => {
    const newStep: NodeType = {
      id: getNodeId(),
      position: { x: 300, y: 0 },
      data: {
        label: '',
      },
      type: 'creatorNode',
    };
    dispatch(addNode(newStep));
  };

  // Adding email configuration for "NOTIFICATION" step.
  // const addConfiguration = () => {
  //   const conf = {"notificationEmail":"mfriesen@gmail.com"}
  //   const configuration = JSON.stringify(conf);
  //   const siteId = "default";
  //   DocumentsService.updateConfiguration( configuration,siteId)
  // }
  // console.log(workflow, 'workflow')

  const changeWorkflowInfo = () => {
    if (workflowInfo.name === '' || workflowInfo.description === '') {
      dispatch(
        openNotificationDialog({ dialogTitle: 'This field cannot be empty' })
      );
      return;
    }
    dispatch(
      setWorkflow({
        ...workflow,
        name: workflowInfo.name,
        description: workflowInfo.description,
      })
    );
    saveWorkflow();
    setEditWorkflowInfo(false);
  };

  const onDeleteWorkflow = () => {
    if (workflow.inUse) return;

    function deleteWorkflow() {
      if (!workflowId) return;
      DocumentsService.deleteWorkflow(workflowId, siteId).then(() => {
        navigate(pathname.split('/').slice(0, -1).join('/'));
      });
    }

    dispatch(
      openConfirmationDialog({
        dialogTitle: 'Are you sure you want to delete this workflow?',
        callback: deleteWorkflow,
      })
    );
  };

  return (
    <>
      <Helmet>
        <title>Workflow Designer</title>
      </Helmet>

      <div className="w-full h-24 py-2 px-4 flex flex-row items-center justify-between text-neutral-900 border-b gap-4">
        <div className="flex flex-col">
          {editWorkflowInfo ? (
            <div className="flex flex-row">
              <input
                type="text"
                className="w-80 mt-2 border border-neutral-300 p-1"
                value={workflowInfo.name}
                onChange={(e) =>
                  setWorkflowInfo({
                    ...workflowInfo,
                    name: e.target.value,
                  })
                }
                placeholder="Workflow Name"
              />
            </div>
          ) : (
            <div className="text-2xl font-medium">
              {workflow.name}
              {!workflow.inUse && (
                <button
                  className="w-5 h-5 ml-2 hover:text-primary-500"
                  onClick={() => setEditWorkflowInfo(true)}
                >
                  <Edit />
                </button>
              )}
            </div>
          )}
          {editWorkflowInfo ? (
            <input
              type="text"
              className="w-80 mt-2 border border-neutral-300 p-1"
              value={workflowInfo.description}
              onChange={(e) =>
                setWorkflowInfo({
                  ...workflowInfo,
                  description: e.target.value,
                })
              }
              placeholder="Workflow Description"
            />
          ) : (
            <div className="text-sm">{workflow.description}</div>
          )}
        </div>
        {editWorkflowInfo && (
          <ButtonPrimary
            onClick={changeWorkflowInfo}
            style={{ height: '32px' }}
            className="self-end"
          >
            Save
          </ButtonPrimary>
        )}
        {!workflow.inUse && (
          <button
            className="h-6 w-6 hover:text-primary-500 "
            onClick={onDeleteWorkflow}
          >
            <Trash />
          </button>
        )}
      </div>
      <div
        className="w-full h-[calc(100vh-9.68rem)] overflow-x-auto"
        style={{ maxHeight: 'calc(100vh - 9.68rem)' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => dispatch(onNodesChange(changes))}
          onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.5, maxZoom: 1, minZoom: 0.1 }}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          elementsSelectable={!workflow.inUse}
          nodesDraggable={!workflow.inUse}
          nodesConnectable={!workflow.inUse}
          edgesUpdatable={!workflow.inUse}
          edgesFocusable={!workflow.inUse}
          nodesFocusable={!workflow.inUse}
          draggable={!workflow.inUse}
        >
          <Background variant={BackgroundVariant.Dots} />
          {!workflow.inUse && (
            <Panel position="top-right">
              <ButtonSecondary onClick={addStep} className="m-2">
                + Add New Step
              </ButtonSecondary>
              <ButtonPrimary onClick={saveWorkflow} className="m-2">
                Save Workflow Steps
              </ButtonPrimary>
              {/*<button onClick={addConfiguration} className='bg-gray-300 mx-2 py-1 px-2'>Add Configuration</button>*/}
            </Panel>
          )}
        </ReactFlow>
      </div>
    </>
  );
}

export default WorkflowDesigner;
