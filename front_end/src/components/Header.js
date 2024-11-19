import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Removed incorrect destructuring
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        // Fetch username using the userId
        fetch(`/api/users/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.username) setUsername(data.username);
          })
          .catch((err) => console.error('Error fetching user data:', err));
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <h1 className="header-logo">Turner Threads</h1>
      <div className="header-actions">
        {username && <span className="username">{username}</span>}
        <button className="icon-button" onClick={handleProfile} title="Profile">
          <FaUser />
        </button>
        <button className="icon-button" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
