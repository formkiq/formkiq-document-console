import { IntelligentClassification } from '../../../Icons/icons';
import ParametersSelector from '../NodeComponents/ParametersSelector';
import TextInput from '../NodeComponents/TextInput';
import { NodeContentProps, NodeWrapper } from '../NodeComponents/NodeWrapper';

export function DocumentTaggingContent({
  isEditing,
  data,
  newStep,
  onChange,
}: NodeContentProps) {
  const engineSelectorOptions = {
    chatgpt: 'ChatGPT',
  };
  return (
    <>
      <ParametersSelector
        options={engineSelectorOptions}
        description="Tagging Engine to use"
        onChange={(value: any) => onChange(value, 'engine')}
        selectedValue={
          isEditing ? newStep?.parameters?.engine : data.parameters?.engine
        }
        isEditing={isEditing}
      />
      <TextInput
        description="Comma-delimited list of keywords"
        onChange={(value: any) => onChange(value, 'tags')}
        selectedValue={
          isEditing ? newStep?.parameters?.tags : data.parameters?.tags
        }
        isEditing={isEditing}
      />
    </>
  );
}

function DocumentTagging(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<IntelligentClassification />}
      title="Intelligent Document Tagging"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <DocumentTaggingContent {...props} />
    </NodeWrapper>
  );
}

export default DocumentTagging;
