import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      setNewUsername(storedUser.username);
      setNewPassword(storedUser.password);
    }
  }, []);

  const handleUpdate = () => {
    if (!newUsername || !newPassword) {
      setMessage("Username and password cannot be empty.");
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = allUsers.findIndex(u => u.username === user.username);

    if (userIndex === -1) {
      setMessage("User not found.");
      return;
    }

    // Check for duplicate username
    const isUsernameTaken = allUsers.some((u, index) =>
      u.username === newUsername && index !== userIndex
    );
    if (isUsernameTaken) {
      setMessage("Username already taken.");
      return;
    }

    // Update user info
    allUsers[userIndex].username = newUsername;
    allUsers[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(allUsers));

    const updatedUser = { ...user, username: newUsername, password: newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Rename cart if username changed
    if (user.username !== newUsername) {
      const oldCartKey = `cart_${user.username}`;
      const newCartKey = `cart_${newUsername}`;
      const cart = JSON.parse(localStorage.getItem(oldCartKey)) || [];
      localStorage.removeItem(oldCartKey);
      localStorage.setItem(newCartKey, JSON.stringify(cart));
    }

    setMessage("Profile updated successfully.");
  };

  if (!user) {
    return <div className="profile-container">Please log in to access your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <div className="form-group">
        <label>New Username:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate}>Update Profile</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Profile;
