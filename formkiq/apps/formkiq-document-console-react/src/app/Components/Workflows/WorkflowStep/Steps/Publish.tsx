import { Publish as PublishIcon } from '../../../Icons/icons';
import { NodeContentProps, NodeWrapper } from '../NodeComponents/NodeWrapper';

function PublishContent({
  isEditing,
  data,
  newStep,
  onChange,
}: NodeContentProps) {
  return null;
}

function Publish(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<PublishIcon />}
      title="Publish"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <PublishContent {...props} />
    </NodeWrapper>
  );
}

export default Publish;
