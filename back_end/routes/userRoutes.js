const express = require('express');
const pool = require('../config/db'); // Database connection
const router = express.Router();

// Get username by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ username: user.rows[0].username });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
