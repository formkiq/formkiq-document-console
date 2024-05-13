import {useMemo} from "react";
import {Position} from "reactflow";
import {Plus, Antivirus as AntivirusIcon} from "../../../Icons/icons";
import {OneConditionSourceHandle} from "../../Handles/handles";
import NodeTitle from "../NodeComponents/NodeTitle";
import {NodeNameSelector} from "../NodeComponents/NodeNameSelector";

const stepInfo = {
  title: 'Anti-Malware Scan',
  textInputParameters: {},
  numberInputParameters: {},
  selectParameters: {},
  checkboxParameters: {},
  decisions: ['APPROVE', 'REJECT'],
}

function Antivirus({newStep, setNewStep, isEditing, edges, id, addCreatorNode}: any) {

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
      {!isEditing &&
        <NodeTitle icon={<AntivirusIcon/>} title="Anti-Malware Scan"/>}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}


      {!isEditing && <>
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
      </>}
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

export default Antivirus;
