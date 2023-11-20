import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet-async';
import WorkflowStep from '../../Components/Workflows/WorkflowStep/workflowStep';

export function WorkflowDesigner() {
  const steps = [
    { id: '1', name: 'Start', type: 'start' },
    // More entities...
  ];

  return (
    <>
      <Helmet>
        <title>Workflow Designer</title>
      </Helmet>
      <DndProvider backend={HTML5Backend}>
        <div>
          {steps.map((step) => (
            <WorkflowStep key={step.id} {...step} />
          ))}
        </div>
      </DndProvider>
    </>
  );
}

export default WorkflowDesigner;
