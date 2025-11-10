const express = require('express');
const router = express.Router();
const Usage = require('../models/Usage');

// POST new usage
router.post('/', async (req, res) => {
  const { userId, litersUsed } = req.body;
  try {
    const usage = new Usage({ userId, litersUsed });
    await usage.save();
    res.status(201).json(usage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET usage by user
router.get('/:userId', async (req, res) => {
  try {
    const data = await Usage.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;