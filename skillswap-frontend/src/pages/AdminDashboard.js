import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, messagesRes] = await Promise.all([
        axios.get("http://localhost:8081/api/admin/users"),
        axios.get("http://localhost:8081/api/admin/messages")
      ]);
      
      setUsers(usersRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/admin/users/${id}/block`);
      setUsers(users.map(user => 
        user.id === id ? response.data : user
      ));
    } catch (err) {
      console.error("Error toggling block status:", err);
      alert("Failed to toggle block status");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/admin/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
      alert("Message deleted successfully");
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-box" style={{ textAlign: "center", padding: "60px" }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-box">
        <div className="admin-header">
          <h2 className="admin-title">Admin Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon"></span>
            <div>
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{users.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"></span>
            <div>
              <div className="stat-label">Total Messages</div>
              <div className="stat-value">{messages.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"></span>
            <div>
              <div className="stat-label">Blocked Users</div>
              <div className="stat-value">{users.filter(u => u.blocked).length}</div>
            </div>
          </div>
        </div>

        <div className="tab-buttons">
          <button 
            className={activeTab === "users" ? "active-tab" : ""} 
            onClick={() => setActiveTab("users")}
          >
            Users <span className="badge">{users.length}</span>
          </button>
          <button 
            className={activeTab === "messages" ? "active-tab" : ""} 
            onClick={() => setActiveTab("messages")}
          >
             Messages <span className="badge">{messages.length}</span>
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="users-section">
            <h3>Registered Users</h3>
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className={u.blocked ? "blocked-row" : ""}>
                        <td>#{u.id}</td>
                        <td>
                          <div className="user-name">
                            {u.firstName} {u.lastName}
                            {u.blocked && <span className="blocked-tag">Blocked</span>}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role || 'User'}
                          </span>
                        </td>
                        <td>{u.branch || '-'}</td>
                        <td>
                          <button 
                            className={`action-btn ${u.blocked ? 'unblock-btn' : 'block-btn'}`} 
                            onClick={() => handleBlockUser(u.id)}
                          >
                            {u.blocked ? ' Unblock' : 'Block'}
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="messages-section">
            <h3>User Conversations</h3>
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                        No messages found
                      </td>
                    </tr>
                  ) : (
                    messages.map((m) => (
                      <tr key={m.id}>
                        <td>#{m.id}</td>
                        <td>
                          <div className="sender-info">
                            <div className="name">
                              {m.senderFullName || `User ${m.senderId}`}
                            </div>
                            <div className="email">
                              {m.senderUsername || ''}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="receiver-info">
                            <div className="name">
                              {m.receiverFullName || `User ${m.receiverId}`}
                            </div>
                            <div className="email">
                              {m.receiverUsername || ''}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="message-content" title={m.content}>
                            {m.content || 'No content'}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="action-btn delete-btn" 
                            onClick={() => handleDeleteMessage(m.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}