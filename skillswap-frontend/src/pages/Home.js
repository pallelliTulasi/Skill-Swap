import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-inner">
          <h1 className="logo">SkillSwap</h1>

          <div className="nav-buttons">
            <Link to="/login">
              <button className="btn login-btn">Login</button>
            </Link>

            <Link to="/signup">
              <button className="btn signup-btn">Sign Up</button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Home;
