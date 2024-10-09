import { Antivirus as AntivirusIcon } from '../../../Icons/icons';
import { NodeContentProps, NodeWrapper } from '../NodeComponents/NodeWrapper';

export function AntivirusContent({
  isEditing,
  data,
  newStep,
  onChange,
}: NodeContentProps) {
  return null;
}

function Antivirus(props: any) {
  return (
    <NodeWrapper
      id={props.id}
      icon={<AntivirusIcon />}
      title="Anti-Malware Scan"
      isEditing={props.isEditing}
      readOnly={props.readOnly}
      newStep={props.newStep}
      setNewStep={props.setNewStep}
      edges={props.edges}
      addCreatorNode={props.addCreatorNode}
      maxConnections={2}
    >
      <AntivirusContent {...props} />
    </NodeWrapper>
  );
}

export default Antivirus;
