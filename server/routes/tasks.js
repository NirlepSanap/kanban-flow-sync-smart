
const express = require('express');
const Task = require('../models/Task');
const ActionLog = require('../models/ActionLog');

const router = express.Router();

// Get all tasks (no auth required)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// Create task (no auth required)
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', status = 'todo' } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      status
    });

    await task.save();

    // Log action (anonymous)
    const actionLog = new ActionLog({
      actionType: 'create',
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

// Update task (no auth required)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { ...updates, lastModified: new Date() },
      { new: true }
    );

    // Log action (anonymous)
    const actionLog = new ActionLog({
      actionType: 'update',
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

// Delete task (no auth required)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(id);

    // Log action (anonymous)
    const actionLog = new ActionLog({
      actionType: 'delete',
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
