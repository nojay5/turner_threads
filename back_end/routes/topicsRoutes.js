const express = require('express');
const pool = require('../config/db'); // Your database connection
const router = express.Router();

// GET all topics
router.get('/', async (req, res) => {
  try {
    const topics = await pool.query('SELECT * FROM topics'); // Fetch topics
    res.json(topics.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET topic details by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);
    if (topic.rows.length === 0) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
