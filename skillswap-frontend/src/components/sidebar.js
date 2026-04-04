import React from "react";

function Sidebar({ setActive }) {
  return (
    <div className="sidebar">
      <h2>Skill Swap</h2>

      <div className="menu-item" onClick={() => setActive("home")}>
        Home
      </div>
      <div className="menu-item" onClick={() => setActive("profile")}>
        Profile
      </div>
      <div className="menu-item" onClick={() => setActive("explore")}>
        Explore
      </div>
      <div className="menu-item" onClick={() => setActive("chats")}>
        Chats
      </div>
    </div>
  );
}

export default Sidebar;
