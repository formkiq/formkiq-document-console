import {useMemo} from "react";
import {Position} from "reactflow";
import {IntelligentClassification, Plus} from "../../../Icons/icons";
import {DefaultSourceHandle} from "../../Handles/handles";
import NodeTitle from "../NodeComponents/NodeTitle";
import ParametersSelector from "../NodeComponents/ParametersSelector";
import TextInput from "../NodeComponents/TextInput";
import {NodeNameSelector} from "../NodeComponents/NodeNameSelector";

const stepInfo = {
  title: 'Intelligent Document Classification',
  textInputParameters: {
    tags: {title: 'Comma-delimited list of keywords'},
  },
  numberInputParameters: {},
  selectParameters: {
    engine: {
      description: 'Tagging Engine to use',
      options: {
        chatgpt: 'ChatGPT',
        test: "asfa"
      },
    },
  },
  checkboxParameters: {},
  decisions: ['APPROVE'],
}

function DocumentTagging({newStep, setNewStep, isEditing, data, edges, id, addCreatorNode, onChange, readOnly}: any) {
  const engineSelectorOptions = {
    chatgpt: 'ChatGPT',
  }
  const MAX_CONNECTIONS = 1;
  let isHandleConnectable = false
  let connectionsNumber = MAX_CONNECTIONS
  if (edges) {
    connectionsNumber = edges.filter((e: any) => e.source === id).length;
  }
  isHandleConnectable = useMemo(() => {
    if(readOnly) return false;
    return connectionsNumber < MAX_CONNECTIONS;
  }, [connectionsNumber, MAX_CONNECTIONS]);


  return (
    <>
      {isEditing && <NodeNameSelector newStep={newStep} setNewStep={setNewStep} info={stepInfo}/>}
      {!isEditing && <NodeTitle icon={<IntelligentClassification/>} title="Intelligent Document Classification"/>}
      {!isEditing && <div className="h-px bg-gray-400 my-1.5 w-full"></div>}
      <ParametersSelector options={engineSelectorOptions}
                          description='Tagging Engine to use'
                          onChange={(value: any) => onChange(value, 'engine')}
                          selectedValue={isEditing ? (newStep?.parameters?.engine) : data.parameters?.engine}
                          isEditing={isEditing}/>
      <TextInput
        description="Comma-delimited list of keywords"
        onChange={(value: any) => onChange(value, 'tags')}
        selectedValue={isEditing ? (newStep?.parameters?.tags) : data.parameters?.tags}
        isEditing={isEditing}/>

      {!isEditing && <DefaultSourceHandle
        type="source"
        position={Position.Right}
        id="approve"
        maxConnections={1}
        nodeId={id}
        readOnly={readOnly}
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

export default DocumentTagging;
