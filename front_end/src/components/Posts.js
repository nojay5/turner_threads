import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import for decoding token
import { FaRegComment } from 'react-icons/fa'; // Comment icon
import './Posts.css'; // Import custom styles

const Posts = () => {
  const { id: subtopicId } = useParams(); // Subtopic ID from URL
  const [posts, setPosts] = useState([]);
  const [topicName, setTopicName] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});

  // Decode user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (err) {
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  // Fetch posts, topic name, and subscription status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicRes = await axios.get(`/api/topics/${subtopicId}`);
        setTopicName(topicRes.data.name);

        const postsRes = await axios.get(`/api/posts/${subtopicId}`);
        setPosts(postsRes.data);

        const subStatusRes = await axios.get(`/api/subscriptions/${subtopicId}`, {
          params: { userId }, // Pass the userId as a query parameter
        });
        setIsSubscribed(subStatusRes.data.isSubscribed);
      } catch (err) {
        setError('Failed to load posts, topic, or subscription status!');
      }
    };

    if (userId) {
      fetchData();
    }
  }, [subtopicId, userId]);

  // Add a new post
  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', {
        ...newPost,
        topicId: subtopicId,
        userId,
      });
      const postsRes = await axios.get(`/api/posts/${subtopicId}`);
      setPosts(postsRes.data);
      setNewPost({ title: '', content: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add post!');
    }
  };

  // Handle upvote or downvote
  const handleVote = async (postId, voteType) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/vote`, {
        userId,
        vote: voteType, // 'upvote' or 'downvote'
      });

      // Update the total votes in the frontend
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, total_votes: Math.max(0, res.data.totalVotes) } : post
      );
      setPosts(updatedPosts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to vote on post!');
    }
  };

  // Handle subscription toggle
  const toggleSubscription = async () => {
    try {
      if (isSubscribed) {
        await axios.delete(`/api/subscriptions/${subtopicId}`, {
          params: { userId },
        });
        setIsSubscribed(false);
      } else {
        await axios.post(`/api/subscriptions/${subtopicId}`, { userId });
        setIsSubscribed(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle subscription!');
    }
  };

  // Handle comment visibility toggle
  const toggleComments = (postId) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId] ? null : [], // Initialize comments as an empty array if toggling on
    }));
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    const commentText = commentInput[postId];
    if (!commentText) return;

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { username: 'You', text: commentText, date: new Date().toLocaleString() }],
    }));

    setCommentInput((prev) => ({
      ...prev,
      [postId]: '',
    }));
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="posts-container">
      <div className="subtopic-header">
        <h3 className="subtopic-title">t/{topicName}</h3>
        <div className="header-actions">
            <button className="subscribe-button" onClick={toggleSubscription}>
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
            <button
            className="add-post-button"
            onClick={() => setShowForm(!showForm)}
            >
            Add Post
            </button>
        </div>
        </div>


      {/* Add Post Form */}
      {showForm && (
        <div className="add-post-container">
          <h4>Add a Post</h4>
          <form onSubmit={handleAddPost}>
            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
            <textarea
              placeholder="Post content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {/* List of Posts */}
      {posts.length === 0 ? (
        <p>No posts available for this topic.</p>
      ) : (
        posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-votes">
              <button className="btn upvote" onClick={() => handleVote(post.id, 'upvote')}>
                ⬆
              </button>
              <span className="vote-count">{Math.max(0, post.total_votes)}</span>
              <button className="btn downvote" onClick={() => handleVote(post.id, 'downvote')}>
                ⬇
              </button>
            </div>
            <div className="post-content">
              <h5 className="post-title">{post.title}</h5>
              <p className="post-snippet">{post.content}</p>
              <small className="post-author">Posted by: {post.username}</small>
            </div>
            <FaRegComment className="comment-icon" onClick={() => toggleComments(post.id)} />
            {comments[post.id] && (
              <div className="comments-section">
                <h5>Comments</h5>
                <ul className="comments-list">
                  {Array.isArray(comments[post.id]) &&
                    comments[post.id].map((comment, index) => (
                      <li key={index}>
                        <span className="comment-username">{comment.username}</span>
                        <span className="comment-text">{comment.text}</span>
                        <span className="comment-date">{comment.date}</span>
                      </li>
                    ))}
                </ul>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(post.id);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput[post.id] || ''}
                    onChange={(e) =>
                      setCommentInput((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button type="submit">Comment</button>
                </form>
              </div>
            )}
          </div>
        ))
      )}

      {/* Floating Add Post Button */}
      <button className="floating-post-button" onClick={() => setShowForm(!showForm)}>
        +
      </button>
    </div>
  );
};

export default Posts;
