import { useEffect, useState } from 'react';
import { DocumentsService } from '../../../../helpers/services/documentsService';
import { Queue as QueueIcon } from '../../../Icons/icons';
import ApprovalGroupsSelector from '../NodeComponents/ApprovalGroupsSelector';
import QueueSelector from '../NodeComponents/QueueSelector';
import { NodeContentProps, NodeWrapper } from '../NodeComponents/NodeWrapper';

function QueueContent({
  isEditing,
  data,
  newStep,
  onChange,
  siteId,
  setNewStep,
}: NodeContentProps) {
  const [queue, setQueue] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.queue || !siteId) return;
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
      <QueueSelector
        newStep={newStep}
        setNewStep={setNewStep ? setNewStep : () => {}}
        siteId={siteId ? siteId : ''}
        isEditing={isEditing}
        queue={isEditing ? newStep?.queue : queue}
      />

      <ApprovalGroupsSelector
        newStep={newStep}
        setNewStep={setNewStep ? setNewStep : () => {}}
        siteId={siteId ? siteId : ''}
        isEditing={isEditing}
        approvalGroups={approvalGroups}
      />
    </>
  );
}

function Queue(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<QueueIcon />}
      title="Review / Approval Queue"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={2}
    >
      <QueueContent {...props} />
    </NodeWrapper>
  );
}

export default Queue;
