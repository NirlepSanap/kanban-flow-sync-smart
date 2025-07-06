
import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import '../styles/ActivityPanel.css';

interface ActivityLog {
  _id: string;
  actionType: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  taskId: {
    _id: string;
    title: string;
  };
  details: string;
  timestamp: string;
}

interface ActivityPanelProps {
  onClose: () => void;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('activity_logged', (newLog: ActivityLog) => {
        setLogs(prev => [newLog, ...prev.slice(0, 19)]);
      });

      return () => {
        socket.off('activity_logged');
      };
    }
  }, [socket]);

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'assign': return '👤';
      case 'move': return '↔️';
      case 'conflict_resolved': return '⚠️';
      default: return '📝';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create': return '#2ecc71';
      case 'update': return '#3498db';
      case 'delete': return '#e74c3c';
      case 'assign': return '#9b59b6';
      case 'move': return '#f39c12';
      case 'conflict_resolved': return '#e67e22';
      default: return '#95a5a6';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="activity-panel">
      <div className="panel-header">
        <h3>Activity Feed</h3>
        <button className="close-panel-btn" onClick={onClose}>×</button>
      </div>

      <div className="panel-content">
        {loading ? (
          <div className="loading-logs">
            <div className="loading-spinner small"></div>
            <p>Loading activity...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-logs">
            <p>No activity yet</p>
            <small>Team actions will appear here</small>
          </div>
        ) : (
          <div className="activity-list">
            {logs.map(log => (
              <div key={log._id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ backgroundColor: getActionColor(log.actionType) }}
                >
                  {getActionIcon(log.actionType)}
                </div>
                
                <div className="activity-content">
                  <div className="activity-main">
                    <strong>{log.user.username}</strong>
                    <span className="activity-details">{log.details}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="task-title">{log.taskId?.title || 'Deleted Task'}</span>
                    <span className="activity-time">{formatTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPanel;
