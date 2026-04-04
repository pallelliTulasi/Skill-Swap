import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard1 from "./pages/Dashboard1";   // ✔ correct
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Chats from "./pages/Chats";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard1" element={<Dashboard1 />} />  {/* ✔ correct */}

        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chats" element={<Chats />} />

      </Routes>
    </Router>
  );
}

export default App;
