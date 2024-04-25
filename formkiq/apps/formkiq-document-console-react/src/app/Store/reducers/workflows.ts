import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  Edge,
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import {openDialog as openNotificationDialog} from '../../Store/reducers/globalNotificationControls';
import {DocumentsService} from '../../helpers/services/documentsService';
import {
  DecisionType,
  NodeType,
  Workflow,
  WorkflowStep, WorkflowStepActionType,
} from '../../helpers/types/workflows';
import {RootState} from '../store';

export interface WorkflowsState {
  nodes: NodeType[];
  edges: Edge[];
  workflow: Workflow;
}

const defaultState: WorkflowsState = {
  nodes: [],
  edges: [],
  workflow: {
    name: '',
    description: '',
    status: 'INACTIVE',
    steps: [],
  },
};

function workflowToNodes(workflow: Workflow) {
  const nodes: NodeType[] = [];
  const edges: Edge[] = [];

  for (const step of workflow.steps) {

    let label: WorkflowStepActionType | "" = "";
    if (step.queue) {
      label = "QUEUE";
    }
    if (step.action) {
      label = step.action.type;
    }
    nodes.push({
      id: step.stepId,
      data: {
        label: label,
        parameters: step.action?.parameters,
        queue: step.queue,
      },
      position: {x: 0, y: 0},
      type: 'defaultNode',
    });

    if (!step.decisions) {
      continue;
    }

    for (const decision of step.decisions) {
      edges.push({
        id: decision.type + step.stepId,
        source: step.stepId,
        target: decision.nextStepId,
        sourceHandle: decision.type === 'APPROVE' ? 'approve' : 'reject',
        targetHandle: 'a',
        markerEnd: {type: MarkerType.Arrow},
      });
    }
  }
  console.log(nodes, 'nodes workflowToNodes')
  return {nodes, edges};
}

const nodesToWorkflow = (
  nodes: NodeType[],
  edges: Edge[],
  workflow: Workflow
) => {
  const stepsMap: Record<string, WorkflowStep> = {};
  const newWorkflow: Workflow = {
    ...workflow,
    steps: Object.keys(stepsMap).map((key) => stepsMap[key] as WorkflowStep),
  };

  if (nodes.length === 0) {
    return newWorkflow;
  }

  for (const node of nodes) {
    console.log(node, 'node')
    if (node.data.label === '') {
      continue;
    }
    const step: WorkflowStep = {
      stepId: node.id,
      action: {
        type: node.data.label,
        parameters: node.data.parameters,
      },
      decisions: [],
    };
    // NOTE: queueId is top-level, not within parameters
    if (node.data.queue) {
      step.queue = node.data.queue;
      delete step.action;
    }
    stepsMap[step.stepId] = step;
  }

  for (const edge of edges) {
    const source = stepsMap[edge.source];
    const target = stepsMap[edge.target];
    if (!source || !target) {
      continue;
    }
    const type: DecisionType =
      edge.sourceHandle === 'approve' ? 'APPROVE' : 'REJECT';
    if (!source.decisions) {
      source.decisions = [];
    }
    source.decisions.push({
      type,
      nextStepId: edge.target,
    });
  }

  newWorkflow.steps = Object.keys(stepsMap).map(
    (key) => stepsMap[key] as WorkflowStep
  );
  console.log(newWorkflow, 'newWorkflow')
  return newWorkflow;
};

export const fetchWorkflow = createAsyncThunk(
  'workflows/fetchWorkflow',
  async (data: any, thunkAPI) => {
    const {siteId, workflowId} = data;
    await DocumentsService.getWorkflow(workflowId, siteId).then(
      (response: Workflow) => {
        thunkAPI.dispatch(setWorkflow(response));
        const {nodes, edges} = workflowToNodes(response);
        thunkAPI.dispatch(setNodes(nodes));
        thunkAPI.dispatch(setEdges(edges));
      }
    );
  }
);

export const updateWorkflowSteps = createAsyncThunk(
  'workflows/updateWorkflow',
  async (data: any, thunkAPI) => {
    const {siteId, workflowId} = data;
    const {workflowsState} = thunkAPI.getState() as RootState;
    const {nodes, edges, workflow} = workflowsState;
    const newWorkflow: Workflow = nodesToWorkflow(nodes, edges, workflow);
    await DocumentsService.putWorkflow(workflowId, newWorkflow, siteId).then(
      (response) => {
        if (response.status === 200) {
          thunkAPI.dispatch(
            openNotificationDialog({dialogTitle: "Workflow was saved successfully"})
          );
        } else {
          const errors = response.errors.map((error: any) => error.error).join('\n');
          thunkAPI.dispatch(
            openNotificationDialog({dialogTitle: errors})
          );
        }
        thunkAPI.dispatch(setWorkflow(newWorkflow));
      }
    );
  }
);
export const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: defaultState,
  reducers: {
    addNode: (state, action) => {
      const node = action.payload;
      state.nodes.push(node);
    },
    removeNode: (state, action) => {
      const id = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== id);
      // remove all connected edges
      const connectedEdges = state.edges.filter(
        (edge) => edge.source === id || edge.target === id
      );
      state.edges = state.edges.filter(
        (edge) => !connectedEdges.includes(edge)
      );
    },
    addEdge: (state, action) => {
      const edge: Edge = action.payload;
      state.edges.push(edge);
    },
    removeEdge: (state, action) => {
      const id = action.payload;
      state.edges = state.edges.filter((edge) => edge.id !== id);
    },
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    editNode: (state, action) => {
      const id = action.payload.id;
      const changes = action.payload.changes;
      const newNode = {
        ...state.nodes.find((node) => node.id === id),
        ...changes,
      };
      state.nodes = state.nodes.map((node) =>
        node.id === id ? newNode : node
      );

      // remove connected to the source edges when node transforms to 'creatorNode'
      if (newNode.type === 'creatorNode') {
        const connectedEdges = state.edges.filter((edge) => edge.source === id);
        state.edges = state.edges.filter(
          (edge) => !connectedEdges.includes(edge)
        );
      }
    },
    setWorkflow: (state, action) => {
      state.workflow = action.payload;
    },
  },
});

export const {
  addNode,
  removeNode,
  addEdge,
  removeEdge,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
  editNode,
  setWorkflow,
} = workflowsSlice.actions;

export const WorkflowsState = (state: RootState) => state.workflowsState;

export default workflowsSlice.reducer;
