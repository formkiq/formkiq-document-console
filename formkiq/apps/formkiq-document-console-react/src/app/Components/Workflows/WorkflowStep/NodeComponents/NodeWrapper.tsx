import { ReactNode, useMemo } from 'react';
import { Position } from 'reactflow';
import {
  DefaultSourceHandle,
  OneConditionSourceHandle,
} from '../../Handles/handles';
import { Plus } from '../../../Icons/icons';
import { NodeNameSelector } from './NodeNameSelector';
import NodeTitle from '../NodeComponents/NodeTitle';

export interface NodeContentProps {
  isEditing: boolean;
  data: any;
  newStep: any;
  onChange: (value: any, key: string) => void;
  siteId?: string;
  setNewStep?: (step: any) => void;
}

interface NodeWrapperProps {
  id: string;
  icon: ReactNode;
  title: string;
  isEditing: boolean;
  readOnly?: boolean;
  newStep?: any;
  setNewStep?: (step: any) => void;
  edges?: any[];
  addCreatorNode?: () => void;
  children: ReactNode;
  maxConnections?: number;
}

export const NodeWrapper = ({
  id,
  icon,
  title,
  isEditing,
  readOnly = false,
  newStep,
  setNewStep,
  edges,
  addCreatorNode,
  children,
  maxConnections = 1,
}: NodeWrapperProps) => {
  let connectionsNumber = maxConnections;
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }

  const isHandleConnectable = useMemo(() => {
    if (readOnly) return false;
    return connectionsNumber < maxConnections;
  }, [connectionsNumber, maxConnections, readOnly]);

  return (
    <>
      {isEditing &&setNewStep && (
        <NodeNameSelector newStep={newStep} setNewStep={setNewStep} />
      )}
      {!isEditing && (
        <>
          <NodeTitle icon={icon} title={title} />
          <div className="h-px bg-gray-400 my-1.5 w-full" />
        </>
      )}

      {children}

      {!isEditing && maxConnections === 1 && (
        <DefaultSourceHandle
          type="source"
          position={Position.Right}
          id="approve"
          maxConnections={maxConnections}
          nodeId={id}
          readOnly={readOnly}
        />
      )}
      {!isEditing && maxConnections === 2 && (
        <>
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={id}
            maxConnections={1}
            top="33%"
            id="approve"
            readOnly={readOnly}
          />
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={id}
            maxConnections={1}
            top="66%"
            id="reject"
            readOnly={readOnly}
          />
        </>
      )}

      {isHandleConnectable && addCreatorNode && (
        <div
          className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1 cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"
          style={{ top: 'calc(50% - 12px)' }}
          onClick={addCreatorNode}
        >
          <Plus />
        </div>
      )}
    </>
  );
};
