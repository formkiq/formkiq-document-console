import React, { useRef } from 'react';
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from 'react-dnd';

interface WorkflowStepProps {
  id: string;
  index: number;
  name: string;
  moveStep: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  id,
  index,
  name,
  moveStep,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem, void, void>({
    accept: 'STEP',
    hover(item, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveStep(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'STEP',
    item: () => {
      return { id, index };
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={ref} style={{ opacity }}>
      {name}
    </div>
  );
};

export default WorkflowStep;
