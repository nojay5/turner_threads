import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Sidebar for topics
import Posts from "./components/Posts"; // Posts component
import Login from "./pages/Login"; // Login page
import Register from "./pages/Register"; // Register page
import Profile from "./components/Profile"; // Profile page
import Header from "./components/Header"; // Header component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Check if user is logged in
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#121212" }}>
        {/* Header */}
        {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} onLogout={handleLogout} />}
        <div style={{ display: "flex", flex: 1, marginTop: isAuthenticated ? "60px" : "0" }}>
          {/* Sidebar */}
          {isAuthenticated && <Sidebar />}
          {/* Main Content */}
          <div style={{ flex: 1, padding: "20px", marginLeft: isAuthenticated ? "250px" : "0", overflowY: "auto" }}>
            <Routes>
              {/* Public Routes: Login and Register */}
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/topics" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/topics" /> : <Register />}
              />

              {/* Authenticated Routes */}
              {isAuthenticated ? (
                <>
                  <Route path="/topics" element={<div>Select a topic from the sidebar.</div>} />
                  <Route path="/topics/:id" element={<Posts />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/topics" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
