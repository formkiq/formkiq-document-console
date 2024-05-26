import { useEffect, useMemo, useState } from 'react';
import { Position } from 'reactflow';
import { DocumentsService } from '../../../../helpers/services/documentsService';
import { Plus, Wildcard } from '../../../Icons/icons';
import { OneConditionSourceHandle } from '../../Handles/handles';
import ApprovalGroupsSelector from '../NodeComponents/ApprovalGroupsSelector';
import { NodeNameSelector } from '../NodeComponents/NodeNameSelector';
import NodeTitle from '../NodeComponents/NodeTitle';
import QueueSelector from '../NodeComponents/QueueSelector';

const stepInfo = {
  title: 'Review / Approval Queue',
  textInputParameters: {},
  numberInputParameters: {},
  selectParameters: {},
  checkboxParameters: {},
  decisions: ['APPROVE', 'REJECT'],
  queue: true,
  approvalGroups: true,
};

function Queue({
  newStep,
  setNewStep,
  isEditing,
  edges,
  id,
  addCreatorNode,
  siteId,
  data,
}: any) {
  const onChange = (value: any, key: any) => {
    setNewStep({
      ...newStep,
      parameters: {
        ...newStep.parameters,
        [key]: value,
      },
    });
  };
  const MAX_CONNECTIONS = 2;
  let isHandleConnectable = false;
  let connectionsNumber = MAX_CONNECTIONS;
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);

  const [queue, setQueue] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.queue) return;
    if (data.queue.queueId) {
      DocumentsService.getQueue(siteId, data.queue.queueId).then((res) => {
        if (res.status === 200) setQueue(res.name);
      });
    }
  }, [data?.queue]);

  const [approvalGroups, setApprovalGroups] = useState<any>([]);

  useEffect(() => {
    if (isEditing) {
      if (newStep?.queue?.approvalGroups) {
        setApprovalGroups(newStep?.queue?.approvalGroups);
      }
    } else if (data?.queue?.approvalGroups) {
      setApprovalGroups(data?.queue?.approvalGroups);
    } else {
      setApprovalGroups([]);
    }
  }, [newStep, data]);

  return (
    <>
      {isEditing && (
        <NodeNameSelector
          newStep={newStep}
          setNewStep={setNewStep}
          info={stepInfo}
        />
      )}
      {!isEditing && (
        <NodeTitle icon={<Wildcard />} title="Review / Approval Queue" />
      )}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}

      <QueueSelector
        newStep={newStep}
        setNewStep={setNewStep}
        siteId={siteId}
        isEditing={isEditing}
        queue={isEditing ? newStep?.queue : queue}
      />

      <ApprovalGroupsSelector
        newStep={newStep}
        setNewStep={setNewStep}
        siteId={siteId}
        isEditing={isEditing}
        approvalGroups={approvalGroups}
      />

      {!isEditing && (
        <>
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={id}
            maxConnections={1}
            top="33%"
            id="approve"
          />
          <OneConditionSourceHandle
            type="source"
            position={Position.Right}
            nodeId={id}
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
}

export default Queue;
