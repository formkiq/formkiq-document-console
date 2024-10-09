import { Webhook as WebhookIcon } from '../../../Icons/icons';
import TextInput from '../NodeComponents/TextInput';
import { NodeWrapper } from '../NodeComponents/NodeWrapper';

function WebhookContent({ isEditing, data, newStep, onChange }: any) {
  return (
    <>
      <TextInput
        description="Webhook URL"
        onChange={(value: any) => onChange(value, 'url')}
        selectedValue={
          isEditing ? newStep?.parameters?.url : data.parameters?.url
        }
        isEditing={isEditing}
      />
    </>
  );
}

function Webhook(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<WebhookIcon />}
      title="Webhook"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <WebhookContent {...props} />
    </NodeWrapper>
  );
}

export default Webhook;
