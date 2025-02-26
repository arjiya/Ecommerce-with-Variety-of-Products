import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.username);
      setPassword(storedUser.password || ""); // Assuming password was stored
    } else {
      navigate("/Login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const handleSave = () => {
    if (!username || !password) {
      alert("Username and password cannot be empty!");
      return;
    }

    const updatedUser = { username, password };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>

      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default Profile;
