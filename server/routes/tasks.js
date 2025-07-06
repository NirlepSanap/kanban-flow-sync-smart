
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedUser', 'username email avatar')
      .populate('createdBy', 'username email')
      .sort({ order: 1, createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority = 'medium', status = 'todo' } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      status,
      createdBy: req.user._id
    });

    await task.save();
    await task.populate('assignedUser', 'username email avatar');
    await task.populate('createdBy', 'username email');

    // Log action
    const actionLog = new ActionLog({
      actionType: 'create',
      user: req.user._id,
      taskId: task._id,
      details: `Created task: ${title}`
    });
    await actionLog.save();

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { lastModified: clientLastModified } = updates;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Conflict detection
    if (clientLastModified && new Date(clientLastModified) < existingTask.lastModified) {
      return res.status(409).json({
        message: 'Task has been modified by another user',
        currentTask: existingTask,
        conflict: true
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...updates, lastModified: new Date() },
      { new: true }
    ).populate('assignedUser', 'username email avatar')
     .populate('createdBy', 'username email');

    // Log action
    const actionLog = new ActionLog({
      actionType: 'update',
      user: req.user._id,
      taskId: id,
      details: `Updated task: ${updatedTask.title}`
    });
    await actionLog.save();

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// Smart assign task
router.put('/:id/smart-assign', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get all users
    const users = await User.find().select('_id username');
    
    // Count active tasks for each user
    const userTaskCounts = await Promise.all(
      users.map(async (user) => {
        const activeTasks = await Task.countDocuments({
          assignedUser: user._id,
          status: { $in: ['todo', 'inprogress'] }
        });
        return { user, count: activeTasks };
      })
    );

    // Find user with fewest active tasks
    const leastBusyUser = userTaskCounts.reduce((min, current) => 
      current.count < min.count ? current : min
    );

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { 
        assignedUser: leastBusyUser.user._id,
        lastModified: new Date()
      },
      { new: true }
    ).populate('assignedUser', 'username email avatar')
     .populate('createdBy', 'username email');

    // Log action
    const actionLog = new ActionLog({
      actionType: 'assign',
      user: req.user._id,
      taskId: id,
      details: `Smart assigned to ${leastBusyUser.user.username}`
    });
    await actionLog.save();

    res.json(updatedTask);
  } catch (error) {
    console.error('Smart assign error:', error);
    res.status(500).json({ message: 'Server error during smart assignment' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(id);

    // Log action
    const actionLog = new ActionLog({
      actionType: 'delete',
      user: req.user._id,
      taskId: id,
      details: `Deleted task: ${task.title}`
    });
    await actionLog.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
