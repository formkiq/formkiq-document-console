import { useDrag } from 'react-dnd';

type Props = {
  id: string;
  name: string;
  type: string;
};

const WorkflowStep = ({ id, name, type }: Props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'STEP',
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};

export default WorkflowStep;
