
import React, { useState } from 'react';
import '../styles/TaskCard.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  lastModified: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task._id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`task-card ${isFlipped ? 'flipped' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={handleCardClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="task-header">
            <div 
              className="priority-indicator"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
              title={`${task.priority} priority`}
            ></div>
            <h4 className="task-title">{task.title}</h4>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            <div className={`task-actions ${showActions ? 'visible' : ''}`}>
              <button
                className="action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                title="Edit Task"
              >
                ✏️
              </button>
              <button
                className="action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete Task"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div className="card-back">
          <div className="task-details">
            <h4>Task Details</h4>
            <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
            <p><strong>Last modified:</strong> {new Date(task.lastModified).toLocaleString()}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Status:</strong> {task.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
