import { EnvelopeClose } from '../../../Icons/icons';
import ParametersSelector from '../NodeComponents/ParametersSelector';
import TextInput from '../NodeComponents/TextInput';
import { NodeWrapper } from '../NodeComponents/NodeWrapper';

export function NotificationContent({
  isEditing,
  data,
  newStep,
  onChange,
}: any) {
  const notificationTypeSelectorOptions = {
    email: 'Email',
  };

  return (
    <>
      <ParametersSelector
        options={notificationTypeSelectorOptions}
        description="Type of Notification"
        onChange={(value: any) => onChange(value, 'notificationType')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationType
            : data.parameters?.notificationType
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification Email"
        onChange={(value: any) => onChange(value, 'notificationEmail')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationEmail
            : data.parameters?.notificationEmail
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification Carbon Copy"
        onChange={(value: any) => onChange(value, 'notificationToCc')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationToCc
            : data.parameters?.notificationToCc
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification Blind Carbon Copy"
        onChange={(value: any) => onChange(value, 'notificationToBcc')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationToBcc
            : data.parameters?.notificationToBcc
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification Subject"
        onChange={(value: any) => onChange(value, 'notificationSubject')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationSubject
            : data.parameters?.notificationSubject
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification Text"
        onChange={(value: any) => onChange(value, 'notificationText')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationText
            : data.parameters?.notificationText
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Notification HTML"
        onChange={(value: any) => onChange(value, 'notificationHtml')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.notificationHtml
            : data.parameters?.notificationHtml
        }
        isEditing={isEditing}
      />
    </>
  );
}

function Notification(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<EnvelopeClose />}
      title='Send Notification (requires "FROM" address in SES)'
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <NotificationContent {...props} />
    </NodeWrapper>
  );
}

export default Notification;
