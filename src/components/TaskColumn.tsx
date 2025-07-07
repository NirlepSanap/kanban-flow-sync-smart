
import React from 'react';
import TaskCard from './TaskCard';
import '../styles/TaskColumn.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  lastModified: string;
  createdAt: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'inprogress' | 'done';
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  status,
  onTaskUpdate,
  onTaskEdit,
  onTaskDelete
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find(t => t._id === taskId);
    
    if (task && task.status !== status) {
      onTaskUpdate(taskId, { status });
    }
  };

  const getColumnColor = () => {
    switch (status) {
      case 'todo': return '#3498db';
      case 'inprogress': return '#f39c12';
      case 'done': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <div 
      className="task-column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="column-header" style={{ borderTopColor: getColumnColor() }}>
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="column-content">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={() => onTaskEdit(task)}
            onDelete={() => onTaskDelete(task._id)}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="empty-column">
            <p>No tasks yet</p>
            <small>Drag tasks here or create new ones</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
