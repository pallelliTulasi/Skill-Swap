import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Form.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"   // NEW: default role
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      // Decide endpoint based on role
      const endpoint =
        form.role === "admin"
          ? "http://localhost:8081/api/admin/login"
          : "http://localhost:8081/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));

        // Navigate differently for admin vs student
        if (form.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/Dashboard1");
        }
      } else {
        setServerError(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>

        {serverError && (
          <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            {serverError}
          </div>
        )}

        {/* Role selector */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{ marginBottom: "10px" }}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        <button className="submit-btn" onClick={handleLogin}>
          Login
        </button>

        <p>
          New user? <Link to="/signup" className="link">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
