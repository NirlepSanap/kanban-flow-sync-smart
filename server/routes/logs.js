
const express = require('express');
const ActionLog = require('../models/ActionLog');

const router = express.Router();

// Get recent action logs (no auth required)
router.get('/', async (req, res) => {
  try {
    const logs = await ActionLog.find()
      .populate('taskId', 'title')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error fetching logs' });
  }
});

module.exports = router;
