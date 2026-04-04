import "../styles/dashboard.css";
import { useState, useEffect } from "react";
import Profile from "./Profile";
import Explore from "./Explore";
import RequestPanel from "./RequestPanel";
import Chats from "./Chats";
function Dashboard1() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Placeholder components
  const Skills = () => <div className="content-placeholder">Skills Content</div>;


  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "explore":
        return <Explore />;
      case "skills":
        return <Skills />;
      case "chats":
        return <Chats />;
      case "home":
      default:
        return (
          <>
            <div className="text-section">
              <h1 className="main-heading">Learn Together. Grow Together.</h1>
              <p className="intro-text">
                Skill Swap is a student-focused learning ecosystem where individuals 
                can share skills, teach others, and collaborate to grow academically 
                and personally. Our platform bridges the gap between learners and 
                educators inside college environments.
              </p>
              <h2 className="sub-heading">Platform Roles</h2>
              <p className="role-text">
                <strong>Learner:</strong> Students who want to learn new skills.<br />
                <strong>Teacher:</strong> Students who wish to teach complete a test.<br />
                <strong>Both:</strong> Students who want to learn and teach.
              </p>
              <h2 className="sub-heading">How Skill Swap Helps Students</h2>
              <p className="intro-text">
                • Discover students with the skills you want to learn.<br />
                • Request learning sessions.<br />
                • Collaborate through tests and verified roles.<br />
                • Join a community designed for growth.<br />
              </p>
            </div>
            <div className="image-section">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Learning Collaboration"
                className="full-image"
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Skill Swap</h2>
        <ul className="menu">
          <li
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            Home
          </li>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </li>
          <li
            className={activeTab === "explore" ? "active" : ""}
            onClick={() => setActiveTab("explore")}
          >
            Explore Courses
          </li>
          <li
            className={activeTab === "skills" ? "active" : ""}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </li>
          <li
            className={activeTab === "chats" ? "active" : ""}
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content-area">
        {activeTab === "skills" && (
          <div style={{ width: "100%", height: "100vh" }}>
            <iframe
              src="/skills.html"
              title="Skills Page"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        )}
        {activeTab !== "skills" && renderContent()}
      </div>
    </div>
  );
}

export default Dashboard1;