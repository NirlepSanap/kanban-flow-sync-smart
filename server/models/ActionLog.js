
const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'assign', 'move', 'conflict_resolved']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
