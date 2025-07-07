
import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import TaskColumn from './TaskColumn';
import TaskModal from './TaskModal';
import ActivityPanel from './ActivityPanel';
import ConflictModal from './ConflictModal';
import '../styles/KanbanBoard.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  lastModified: string;
  createdAt: string;
}

interface ConflictData {
  currentTask: Task;
  userTask: Task;
  taskId: string;
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const { socket, connected } = useSocket();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('task_created', (newTask: Task) => {
        setTasks(prev => [...prev, newTask]);
      });

      socket.on('task_updated', (updatedTask: Task) => {
        setTasks(prev => prev.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        ));
      });

      socket.on('task_deleted', (taskId: string) => {
        setTasks(prev => prev.filter(task => task._id !== taskId));
      });

      return () => {
        socket.off('task_created');
        socket.off('task_updated');
        socket.off('task_deleted');
      };
    }
  }, [socket]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`);

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
        socket?.emit('task_created', newTask);
        setShowTaskModal(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const originalTask = tasks.find(t => t._id === taskId);
    if (!originalTask) return;

    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updates,
          lastModified: originalTask.lastModified
        })
      });

      const data = await response.json();

      if (response.status === 409 && data.conflict) {
        // Handle conflict
        setConflictData({
          currentTask: data.currentTask,
          userTask: { ...originalTask, ...updates },
          taskId
        });
        return;
      }

      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task._id === taskId ? data : task
        ));
        socket?.emit('task_updated', data);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task._id !== taskId));
        socket?.emit('task_deleted', taskId);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleConflictResolve = async (resolution: 'merge' | 'overwrite', resolvedTask: Task) => {
    if (!conflictData) return;

    try {
      const response = await fetch(`${API_BASE}/tasks/${conflictData.taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...resolvedTask,
          lastModified: new Date().toISOString()
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => 
          task._id === conflictData.taskId ? updatedTask : task
        ));
        socket?.emit('task_updated', updatedTask);
        setConflictData(null);
      }
    } catch (error) {
      console.error('Error resolving conflict:', error);
    }
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <div className="header-left">
          <h1>Kanban Board</h1>
          <div className="connection-status">
            <div className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></div>
            <span>{connected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="activity-btn"
            onClick={() => setShowActivityPanel(!showActivityPanel)}
          >
            Activity
          </button>
          <button 
            className="create-task-btn"
            onClick={() => setShowTaskModal(true)}
          >
            + New Task
          </button>
        </div>
      </header>

      <div className="kanban-board">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          status="todo"
          onTaskUpdate={handleUpdateTask}
          onTaskEdit={setEditingTask}
          onTaskDelete={handleDeleteTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="inprogress"
          onTaskUpdate={handleUpdateTask}
          onTaskEdit={setEditingTask}
          onTaskDelete={handleDeleteTask}
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          status="done"
          onTaskUpdate={handleUpdateTask}
          onTaskEdit={setEditingTask}
          onTaskDelete={handleDeleteTask}
        />
      </div>

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onSave={editingTask ? 
            (updates) => handleUpdateTask(editingTask._id, updates) :
            handleCreateTask
          }
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={handleConflictResolve}
          onClose={() => setConflictData(null)}
        />
      )}

      {showActivityPanel && (
        <ActivityPanel onClose={() => setShowActivityPanel(false)} />
      )}
    </div>
  );
};

export default KanbanBoard;
