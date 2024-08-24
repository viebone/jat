// src/components/KanbanBoard.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';

const stages = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function KanbanBoard({ jobs }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 overflow-x-auto p-4">
        {stages.map((stage) => (
          <Column key={stage} stage={stage} jobs={jobs.filter(job => job.status === stage)} />
        ))}
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
