import { useMemo } from 'react';
import { Position } from 'reactflow';
import { Plus, EventBridgeIcon} from '../../../Icons/icons';
import { DefaultSourceHandle } from '../../Handles/handles';
import { NodeNameSelector } from '../NodeComponents/NodeNameSelector';
import NodeTitle from '../NodeComponents/NodeTitle';
import TextInput from '../NodeComponents/TextInput';

function EventBridge({
  newStep,
  setNewStep,
  isEditing,
  data,
  edges,
  id,
  addCreatorNode,
  onChange,
  readOnly,
}: any) {
  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false;
  let connectionsNumber = MAX_CONNECTIONS;
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    if (readOnly) return false;
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);

  return (
    <>
      {isEditing && (
        <NodeNameSelector newStep={newStep} setNewStep={setNewStep} />
      )}
      {!isEditing && <NodeTitle icon={<EventBridgeIcon />} title="Amazon EventBridge" />}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}

      <TextInput
        description="Event Bus Name"
        editDescription="The name or ARN of the event bus to receive the event"
        onChange={(value: any) => onChange(value, 'eventBusName')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.eventBusName
            : data.parameters?.eventBusName
        }
        isEditing={isEditing}
      />

      {!isEditing && (
        <DefaultSourceHandle
          type="source"
          position={Position.Right}
          id="approve"
          maxConnections={1}
          nodeId={id}
          readOnly={readOnly}
        ></DefaultSourceHandle>
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
}

export default EventBridge;
