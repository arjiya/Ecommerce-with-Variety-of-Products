import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    if (storedUser) {
      // Logic from Login.jsx maps email to 'username' key in the user object
      setNewEmail(storedUser.username);
      setNewPassword("");
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!newEmail || !newPassword) {
      setMessage("Email and password cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: newEmail,
          password: newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect new email (which is stored as username key)
        const updatedUser = { ...user, username: newEmail };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Persist
        setUser(updatedUser);
        setMessage("Profile updated successfully.");
        // Do NOT clear password immediately so browser can capture it
        // setNewPassword(""); 
      } else {
        setMessage(data.message || "Update failed");
      }

    } catch (err) {
      setMessage("Server error.");
      console.error(err);
    }
  };

  if (!user) {
    return <div className="profile-container">Please log in to access your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>New Email:</label>
          <input
            type="email"
            value={newEmail}
            autoComplete="username"
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Profile;
