import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Edge, Handle, HandleProps } from 'reactflow';
import { RootState } from '../../../Store/store';

export const DefaultSourceHandle = (
  props: HandleProps & { nodeId: string; maxConnections: number }
) => {
  const edges: Edge[] = useSelector(
    (state: RootState) => state.workflowsState.edges
  );

  const { nodeId, maxConnections, ...handleProps } = props;
  const isHandleConnectable = useMemo(() => {
    const connectedEdges = edges.filter(
      (e) => e.source === nodeId && e.sourceHandle === handleProps.id
    );
    return connectedEdges.length < maxConnections;
  }, [edges, maxConnections, nodeId, handleProps.id]);

  return (
    <Handle
      {...handleProps}
      isConnectable={isHandleConnectable}
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#fcfcfc',
        right: '-10px',
        border: '1px solid #6b7280',
      }}
    ></Handle>
  );
};

export const DefaultTargetHandle = (props: HandleProps) => {
  return (
    <Handle
      {...props}
      style={{
        width: '20px',
        height: '20px',
        backgroundColor: '#fcfcfc',
        left: '-10px',
        border: '1px solid #6b7280',
      }}
    ></Handle>
  );
};

export const OneConditionSourceHandle = (
  props: HandleProps & { nodeId: string; maxConnections: number; top: string }
) => {
  const edges: Edge[] = useSelector(
    (state: RootState) => state.workflowsState.edges
  );
  const { nodeId, maxConnections, top, ...handleProps } = props;
  const isHandleConnectable = useMemo(() => {
    const connectedEdges = edges.filter(
      (e) => e.source === nodeId && e.sourceHandle === handleProps.id
    );
    return connectedEdges.length < maxConnections;
  }, [edges, maxConnections, nodeId, handleProps.id]);
  const color = handleProps.id === 'approve' ? '#86efac' : '#fca5a5';
  return (
    <Handle
      {...handleProps}
      isConnectable={isHandleConnectable}
      style={{
        top: top,
        width: '20px',
        height: '20px',
        backgroundColor: color,
        right: '-10px',
        border: '1px solid #6b7280',
      }}
    />
  );
};

export const NumberConditionSourceHandle = (
  props: HandleProps & { nodeId: string; maxConnections: number; top: string }
) => {
  const edges: Edge[] = useSelector(
    (state: RootState) => state.workflowsState.edges
  );
  const { nodeId, maxConnections, top, ...handleProps } = props;
  const isHandleConnectable = useMemo(() => {
    const connectedEdges = edges.filter(
      (e) => e.source === nodeId && e.sourceHandle === handleProps.id
    );
    return connectedEdges.length < maxConnections;
  }, [edges, maxConnections, nodeId, handleProps.id]);

  return (
    <>
      <Handle
        {...handleProps}
        isConnectable={isHandleConnectable}
        style={{
          top: top,
          width: '20px',
          height: '20px',
          backgroundColor: '#fcfcfc',
          right: '-10px',
          border: '1px solid #6b7280',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          marginTop: '-13px',
          top: top,
          right: '-4px',
        }}
      >
        {props.id}
      </div>
    </>
  );
};
