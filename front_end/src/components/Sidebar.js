import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css"; // Add custom styling if needed

const Sidebar = () => {
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('/api/topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };
  
    fetchTopics();
  }, []);
  

  return (
    <div className="sidebar">
      <h2>Topics</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
