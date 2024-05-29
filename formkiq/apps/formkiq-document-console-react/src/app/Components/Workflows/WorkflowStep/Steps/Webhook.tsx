import {useMemo} from "react";
import {Position} from "reactflow";
import {Plus, Rule} from "../../../Icons/icons";
import {DefaultSourceHandle} from "../../Handles/handles";
import NodeTitle from "../NodeComponents/NodeTitle";
import TextInput from "../NodeComponents/TextInput";
import {NodeNameSelector} from "../NodeComponents/NodeNameSelector";

const stepInfo = {
  title: 'Webhook',
  textInputParameters: {
    url: {title:'Webhook URL'},
  },
  numberInputParameters: {},
  selectParameters: {},
  checkboxParameters: {},
  decisions: ['APPROVE'],
}

function Webhook({newStep, setNewStep, isEditing, data, edges, id, addCreatorNode, onChange}: any) {
  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false
  let connectionsNumber = MAX_CONNECTIONS
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);


  return (
    <>
      {isEditing && <NodeNameSelector newStep={newStep} setNewStep={setNewStep} info={stepInfo}/>}
      {!isEditing && <NodeTitle icon={<Rule />} title="Webhook"/>}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}

      <TextInput
        description="Webhook URL"
        onChange={(value: any) => onChange(value, 'url')}
        selectedValue={isEditing ? (newStep?.parameters?.url) : data.parameters?.url}
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

export default Webhook;
