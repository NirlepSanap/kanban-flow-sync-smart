
import React, { useState } from 'react';
import '../styles/ConflictModal.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedUser?: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
  };
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  lastModified: string;
  createdAt: string;
}

interface ConflictData {
  currentTask: Task;
  userTask: Task;
  taskId: string;
}

interface ConflictModalProps {
  conflictData: ConflictData;
  onResolve: (resolution: 'merge' | 'overwrite', resolvedTask: Task) => void;
  onClose: () => void;
}

const ConflictModal: React.FC<ConflictModalProps> = ({
  conflictData,
  onResolve,
  onClose
}) => {
  const [selectedResolution, setSelectedResolution] = useState<'current' | 'user' | 'merge'>('merge');
  const [mergedTask, setMergedTask] = useState<Task>({
    ...conflictData.currentTask,
    title: conflictData.userTask.title || conflictData.currentTask.title,
    description: conflictData.userTask.description || conflictData.currentTask.description,
    priority: conflictData.userTask.priority || conflictData.currentTask.priority,
    status: conflictData.userTask.status || conflictData.currentTask.status
  });

  const handleResolve = () => {
    let resolvedTask: Task;

    switch (selectedResolution) {
      case 'current':
        resolvedTask = conflictData.currentTask;
        break;
      case 'user':
        resolvedTask = conflictData.userTask;
        break;
      case 'merge':
      default:
        resolvedTask = mergedTask;
        break;
    }

    onResolve(selectedResolution === 'merge' ? 'merge' : 'overwrite', resolvedTask);
  };

  const handleMergedChange = (field: keyof Task, value: any) => {
    setMergedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="modal-overlay conflict-modal-overlay">
      <div className="conflict-modal">
        <div className="modal-header">
          <h2>⚠️ Conflict Detected</h2>
          <p>Another user has modified this task while you were editing it.</p>
        </div>

        <div className="conflict-content">
          <div className="conflict-options">
            <div className="resolution-option">
              <input
                type="radio"
                id="current"
                name="resolution"
                value="current"
                checked={selectedResolution === 'current'}
                onChange={(e) => setSelectedResolution(e.target.value as 'current')}
              />
              <label htmlFor="current">
                <strong>Keep Current Version</strong>
                <small>Use the version currently saved on the server</small>
              </label>
            </div>

            <div className="resolution-option">
              <input
                type="radio"
                id="user"
                name="resolution"
                value="user"
                checked={selectedResolution === 'user'}
                onChange={(e) => setSelectedResolution(e.target.value as 'user')}
              />
              <label htmlFor="user">
                <strong>Use My Version</strong>
                <small>Overwrite with your changes</small>
              </label>
            </div>

            <div className="resolution-option">
              <input
                type="radio"
                id="merge"
                name="resolution"
                value="merge"
                checked={selectedResolution === 'merge'}
                onChange={(e) => setSelectedResolution(e.target.value as 'merge')}
              />
              <label htmlFor="merge">
                <strong>Merge Changes</strong>
                <small>Combine both versions (recommended)</small>
              </label>
            </div>
          </div>

          <div className="version-comparison">
            <div className="version-column">
              <h4>Current Version (Server)</h4>
              <div className="version-details">
                <p><strong>Title:</strong> {conflictData.currentTask.title}</p>
                <p><strong>Description:</strong> {conflictData.currentTask.description}</p>
                <p><strong>Priority:</strong> {conflictData.currentTask.priority}</p>
                <p><strong>Status:</strong> {conflictData.currentTask.status}</p>
                <p><strong>Modified:</strong> {new Date(conflictData.currentTask.lastModified).toLocaleString()}</p>
              </div>
            </div>

            <div className="version-column">
              <h4>Your Version</h4>
              <div className="version-details">
                <p><strong>Title:</strong> {conflictData.userTask.title}</p>
                <p><strong>Description:</strong> {conflictData.userTask.description}</p>
                <p><strong>Priority:</strong> {conflictData.userTask.priority}</p>
                <p><strong>Status:</strong> {conflictData.userTask.status}</p>
              </div>
            </div>
          </div>

          {selectedResolution === 'merge' && (
            <div className="merge-editor">
              <h4>Merged Version (Edit as needed)</h4>
              <div className="merge-form">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={mergedTask.title}
                    onChange={(e) => handleMergedChange('title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={mergedTask.description}
                    onChange={(e) => handleMergedChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Priority:</label>
                    <select
                      value={mergedTask.priority}
                      onChange={(e) => handleMergedChange('priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={mergedTask.status}
                      onChange={(e) => handleMergedChange('status', e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="resolve-btn" onClick={handleResolve}>
            Resolve Conflict
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
