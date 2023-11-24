import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet-async';
import WorkflowStep from '../../Components/Workflows/WorkflowStep/workflowStep';

interface Step {
  id: string;
  name: string;
}

export function WorkflowDesigner() {
  const [steps, setSteps] = useState<Step[]>([
    { id: 'step1', name: 'Step 1' },
    { id: 'step2', name: 'Step 2' },
    // ... more steps
  ]);

  const moveStep = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragStep = steps[dragIndex];
      const newSteps = [...steps];
      newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, dragStep);
      setSteps(newSteps);
    },
    [steps]
  );

  return (
    <>
      <Helmet>
        <title>Workflow Designer</title>
      </Helmet>
      <DndProvider backend={HTML5Backend}>
        <div>
          {steps.map((step: Step, index: number) => (
            <WorkflowStep
              key={step.id}
              id={step.id}
              index={index}
              name={step.name}
              moveStep={moveStep}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
}

export default WorkflowDesigner;
