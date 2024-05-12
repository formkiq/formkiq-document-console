import {useMemo} from "react";
import {Position} from "reactflow";
import {EnvelopeClose, IntelligentClassification, Plus} from "../../../Icons/icons";
import {DefaultSourceHandle} from "../../Handles/handles";
import NodeTitle from "../NodeComponents/NodeTitle";
import ParametersSelector from "../NodeComponents/ParametersSelector";
import TextInput from "../NodeComponents/TextInput";

const data1 = {
  title: 'Send Notification (requires "FROM" address in SES)',
  textInputParameters: {
    notificationEmail: {title: 'Notification Email'},
    notificationToCc: {title: 'Notification Carbon Copy'},
    notificationToBcc: {title: 'Notification Blind Carbon Copy'},
    notificationSubject: {title: 'Notification Subject'},
    notificationText: {title: 'Notification Text'},
    notificationHtml: {title: 'Notification HTML'},
  },
  numberInputParameters: {},
  selectParameters: {
    notificationType: {
      description: 'Type of Notification',
      options: {
        email: 'Email',
      },
    },
  },
  checkboxParameters: {},
  decisions: ['APPROVE'],
}

function Notification({newStep, setNewStep, isEditing, data, edges, id, addCreatorNode}: any) {
  const notificationTypeSelectorOptions = {
    email: 'Email',
  }

  const onChange = (value: any, key: any) => {
    setNewStep({
      ...newStep,
      parameters: {
        ...newStep.parameters,
        [key]: value,
      },
    });
  };

  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false
  if (edges) {
    const connectionsNumber = edges.filter((e: any) => e.source === id).length;
    isHandleConnectable = useMemo(() => {
      return connectionsNumber < MAX_CONNECTIONS;
    }, [connectionsNumber, MAX_CONNECTIONS]);
  }

  return (
    <>
      {!isEditing &&
        <NodeTitle icon={<EnvelopeClose />} title='Send Notification (requires "FROM" address in SES)'/>}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}

      <ParametersSelector options={notificationTypeSelectorOptions}
                          description='Type of Notification'
                          onChange={(value: any) => onChange(value, 'notificationType')}
                          selectedValue={isEditing ? (newStep?.parameters?.notificationType) : data.parameters?.notificationType}
                          isEditing={isEditing}/>
      <TextInput
        description="Notification Email"
        onChange={(value: any) => onChange(value, 'notificationEmail')}
        selectedValue={isEditing ? (newStep?.parameters?.notificationEmail) : data.parameters?.notificationEmail}
        isEditing={isEditing}/>
      <TextInput
        description="Notification Carbon Copy"
        onChange={(value: any) => onChange(value, 'notificationToCc')}
        selectedValue={isEditing ? (newStep?.parameters?.notificationToCc) : data.parameters?.notificationToCc}
        isEditing={isEditing}/>
        <TextInput
          description="Notification Blind Carbon Copy"
          onChange={(value: any) => onChange(value, 'notificationToBcc')}
          selectedValue={isEditing ? (newStep?.parameters?.notificationToBcc) : data.parameters?.notificationToBcc}
          isEditing={isEditing}/>
        <TextInput
          description="Notification Subject"
          onChange={(value: any) => onChange(value, 'notificationSubject')}
          selectedValue={isEditing ? (newStep?.parameters?.notificationSubject) : data.parameters?.notificationSubject}
          isEditing={isEditing}/>
        <TextInput
          description="Notification Text"
          onChange={(value: any) => onChange(value, 'notificationText')}
          selectedValue={isEditing ? (newStep?.parameters?.notificationText) : data.parameters?.notificationText}
          isEditing={isEditing}/>
        <TextInput
          description="Notification HTML"
          onChange={(value: any) => onChange(value, 'notificationHtml')}
          selectedValue={isEditing ? (newStep?.parameters?.notificationHtml) : data.parameters?.notificationHtml}
          isEditing={isEditing}/>


      {!isEditing && <DefaultSourceHandle
        type="source"
        position={Position.Right}
        id="approve"
        maxConnections={1}
        nodeId={id}
      ></DefaultSourceHandle>}
      {isHandleConnectable && (
        <div
          className="w-6 mt-6 rounded-full bg-green-400 text-white hover:border-green-700 p-1  cursor-pointer absolute right-[-36px] border-2 border-white hover:text-green-700 nodrag"
          style={{top: 'calc(50% - 12px)'}}
          onClick={addCreatorNode}
        >
          <Plus/>
        </div>
      )}
    </>
  );
}

export default Notification;
