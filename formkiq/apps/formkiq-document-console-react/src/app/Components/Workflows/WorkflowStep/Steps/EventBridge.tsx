import { EventBridgeIcon } from '../../../Icons/icons';
import TextInput from '../NodeComponents/TextInput';
import { NodeWrapper } from '../NodeComponents/NodeWrapper';

export function EventBridgeContent({
  isEditing,
  data,
  newStep,
  onChange,
}: any) {
  return (
    <>
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
    </>
  );
}

function EventBridge(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<EventBridgeIcon />}
      title="Amazon EventBridge"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <EventBridgeContent {...props} />
    </NodeWrapper>
  );
}

export default EventBridge;
