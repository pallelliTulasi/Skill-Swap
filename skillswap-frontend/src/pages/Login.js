import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Form.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: form.email, 
        password: form.password 
      })
    });
    
    const data = await response.json();
    console.log("Login response:", data);
    
    if (response.ok) {
      // Store the user data exactly as it comes from backend
      localStorage.setItem("user", JSON.stringify(data));
      
      // THIS IS CRITICAL - Keep your existing navigation!
      navigate("/Dashboard1");  // This takes you to your dashboard with sidebar
      
    } else {
      setServerError(data.error || "Invalid email or password");
    }
  } catch (error) {
    console.error('Login error:', error);
    setServerError("Server error. Please try again later.");
  }
};
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Login</h2>

        {serverError && (
          <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
            {serverError}
          </div>
        )}

        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <small style={{color: 'red'}}>{errors.email}</small>}

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange}
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <small style={{color: 'red'}}>{errors.password}</small>}

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