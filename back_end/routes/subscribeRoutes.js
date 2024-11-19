const express = require('express');
const pool = require('../config/db'); // Your database connection
const router = express.Router();

// Get subscription status for a user and topic
router.get('/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const userId = req.query.userId; // Pass userId as a query parameter

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM user_subscriptions WHERE user_id = $1 AND topic_id = $2',
      [userId, topicId]
    );

    res.json({ isSubscribed: result.rows.length > 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch subscription status' });
  }
});

// Add a subscription for a user and topic
router.post('/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await pool.query(
      'INSERT INTO user_subscriptions (user_id, topic_id) VALUES ($1, $2)',
      [userId, topicId]
    );

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    // Handle duplicate subscription
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Already subscribed to this topic' });
    }

    console.error(err.message);
    res.status(500).json({ message: 'Failed to subscribe to topic' });
  }
});

// Delete a subscription for a user and topic
router.delete('/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const userId = req.query.userId; // Pass userId as a query parameter

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    await pool.query(
      'DELETE FROM user_subscriptions WHERE user_id = $1 AND topic_id = $2',
      [userId, topicId]
    );

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to unsubscribe from topic' });
  }
});

// Get a user's subscribed topics
router.get('/profile/:userId/subscriptions', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT topics.id, topics.name ' +
      'FROM user_subscriptions ' +
      'JOIN topics ON user_subscriptions.topic_id = topics.id ' +
      'WHERE user_subscriptions.user_id = $1',
      [userId]
    );

    res.json({ subscriptions: result.rows });
  } catch (err) {
    console.error('Failed to fetch subscriptions:', err.message);
    res.status(500).json({ message: 'Failed to fetch subscriptions' });
  }
});

// Get a user's total upvotes on their posts
router.get('/profile/:userId/upvotes', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT COALESCE(SUM(posts.total_votes), 0) AS total_upvotes ' +
      'FROM posts ' +
      'WHERE posts.userId = $1',
      [userId]
    );

    const totalUpvotes = result.rows[0].total_upvotes || 0;
    res.json({ totalUpvotes });
  } catch (err) {
    console.error('Failed to fetch total upvotes:', err.message);
    res.status(500).json({ message: 'Failed to fetch total upvotes' });
  }
});

module.exports = router;
