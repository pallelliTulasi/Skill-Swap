import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Form.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    
    // First name validation
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    // Last name validation
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
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
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    };

    try {
      const response = await fetch("http://localhost:8081/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/Dashboard1");
      } else {
        // Handle validation errors from backend
        if (data.email) {
          setErrors({ email: data.email });
        } else if (data.password) {
          setErrors({ password: data.password });
        } else {
          setServerError(data.error || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Create Account</h2>

        {serverError && (
          <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>
            {serverError}
          </div>
        )}

        <input 
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          value={form.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'input-error' : ''}
        />
        {errors.firstName && <small style={{color: 'red'}}>{errors.firstName}</small>}

        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          value={form.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'input-error' : ''}
        />
        {errors.lastName && <small style={{color: 'red'}}>{errors.lastName}</small>}

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

        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={form.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'input-error' : ''}
        />
        {errors.confirmPassword && <small style={{color: 'red'}}>{errors.confirmPassword}</small>}

        <button className="submit-btn" onClick={handleSignup}>
          Sign Up
        </button>

        <p>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}