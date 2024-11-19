import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css"; // Custom styles for the profile page

const Profile = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalUpvotes, setTotalUpvotes] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userId = (() => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
        return decoded.id;
      } catch {
        return null;
      }
    })();

    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        // Fetch subscriptions and upvotes
        const [subsRes, upvotesRes] = await Promise.all([
          axios.get(`/api/subscriptions/profile/${userId}/subscriptions`),
          axios.get(`/api/subscriptions/profile/${userId}/upvotes`),
        ]);

        setSubscriptions(subsRes.data.subscriptions || []);
        setTotalUpvotes(upvotesRes.data.totalUpvotes || 0);
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
        setError("Failed to load profile data.");
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-section">
        <h2>Subscribed Topics</h2>
        {subscriptions.length === 0 ? (
          <p>You are not subscribed to any topics.</p>
        ) : (
          <ul>
            {subscriptions.map((topic) => (
              <li key={topic.id}>{topic.name}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="profile-section">
        <h2>Total Upvotes</h2>
        <p>You have received {totalUpvotes} upvotes on your posts.</p>
      </div>
    </div>
  );
};

export default Profile;
