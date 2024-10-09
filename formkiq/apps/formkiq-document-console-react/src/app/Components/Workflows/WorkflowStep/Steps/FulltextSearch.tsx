import { Search } from '../../../Icons/icons';
import NumberInput from '../NodeComponents/NumberInput';
import { NodeWrapper } from '../NodeComponents/NodeWrapper';

function FulltextSearchContent({ isEditing, data, newStep, onChange }: any) {
  return (
    <>
      <NumberInput
        description="Maximum number of characters to add to Fulltext destination"
        editDescription='use "-1" for no limit'
        defaultValue={-1}
        min={-1}
        onChange={(value: any) => onChange(value, 'characterMax')}
        selectedValue={
          isEditing
            ? newStep?.parameters?.characterMax
            : data.parameters?.characterMax
        }
        isEditing={isEditing}
      />
    </>
  );
}

function FulltextSearch(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<Search />}
      title="Fulltext Search"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={1}
    >
      <FulltextSearchContent {...props} />
    </NodeWrapper>
  );
}

export default FulltextSearch;
