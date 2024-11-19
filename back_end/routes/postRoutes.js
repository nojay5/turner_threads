const express = require('express');
const pool = require('../config/db'); // Database connection
const router = express.Router();

// Get posts for a specific subtopic
router.get('/:subtopicId', async (req, res) => {
  const { subtopicId } = req.params;

  try {
    const posts = await pool.query(
      'SELECT posts.id, posts.title, posts.content, posts.total_votes, users.username ' +
      'FROM posts JOIN users ON posts.userId = users.id ' +
      'WHERE posts.topicId = $1 ' +
      'ORDER BY posts.created_at DESC',
      [subtopicId]
    );
    res.json(posts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new post
router.post('/', async (req, res) => {
    const { title, content, topicId, userId } = req.body;
  
    if (!title || !content || !topicId || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      await pool.query(
        'INSERT INTO posts (title, content, topicId, userId, total_votes) VALUES ($1, $2, $3, $4, $5)',
        [title, content, topicId, userId, 0] // Default votes to 0
      );
      res.status(201).json({ message: 'Post added successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
// Handle upvote/downvote with restriction
router.post('/:postId/vote', async (req, res) => {
    const { postId } = req.params;
    const { userId, vote } = req.body; // Expect userId and vote ('upvote' or 'downvote')
  
    try {
      // Check if the user has already voted on this post
      const existingVote = await pool.query(
        'SELECT vote FROM user_votes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
  
      if (existingVote.rows.length > 0) {
        // If the user has already voted
        const currentVote = existingVote.rows[0].vote;
  
        if (
          (currentVote === 1 && vote === 'upvote') || // Cancel out upvote
          (currentVote === -1 && vote === 'downvote') // Cancel out downvote
        ) {
          // Remove the user's vote
          await pool.query('DELETE FROM user_votes WHERE user_id = $1 AND post_id = $2', [
            userId,
            postId,
          ]);
        } else {
          // Change the user's vote (e.g., upvote to downvote or vice versa)
          await pool.query('UPDATE user_votes SET vote = $1 WHERE user_id = $2 AND post_id = $3', [
            vote === 'upvote' ? 1 : -1,
            userId,
            postId,
          ]);
        }
      } else {
        // If the user hasn't voted, insert a new vote
        await pool.query(
          'INSERT INTO user_votes (user_id, post_id, vote) VALUES ($1, $2, $3)',
          [userId, postId, vote === 'upvote' ? 1 : -1]
        );
      }
  
      // Recalculate total votes for the post
      const voteResult = await pool.query(
        'SELECT COALESCE(SUM(vote), 0) AS total_votes FROM user_votes WHERE post_id = $1',
        [postId]
      );
  
      const totalVotes = voteResult.rows[0].total_votes;
  
      // Update the total_votes in the posts table
      await pool.query('UPDATE posts SET total_votes = $1 WHERE id = $2', [totalVotes, postId]);
  
      res.json({ totalVotes });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });


  
  
  
  
  

module.exports = router;
