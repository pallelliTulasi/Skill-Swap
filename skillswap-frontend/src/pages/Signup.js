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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
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

    setIsLoading(true);
    setServerError("");

    // IMPORTANT: Use 'isBlocked' instead of 'blocked' to match your entity
    const userData = {
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  email: form.email.trim().toLowerCase(),
  password: form.password,
  phone: "",
  branch: "",
  role: "USER",
  profileType: "",
  about: "",
  skillsToTeach: [],
  skillsToLearn: [],
  isBlocked: false,
  blocked: false  // <--- ADD THIS LINE
};

    console.log("Sending data:", userData);

    try {
      const response = await fetch("http://localhost:8081/api/auth/signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/Dashboard1");
      } else {
        if (data.email) {
          setErrors({ email: data.email });
        } else if (data.password) {
          setErrors({ password: data.password });
        } else if (data.firstName) {
          setErrors({ firstName: data.firstName });
        } else if (data.lastName) {
          setErrors({ lastName: data.lastName });
        } else if (data.error) {
          setServerError(data.error);
        } else {
          setServerError("Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setServerError("Cannot connect to server. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Create Account</h2>

        {serverError && (
          <div className="error-message" style={{color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '4px'}}>
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
          disabled={isLoading}
        />
        {errors.firstName && <small style={{color: 'red', display: 'block', marginBottom: '5px'}}>{errors.firstName}</small>}

        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          value={form.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.lastName && <small style={{color: 'red', display: 'block', marginBottom: '5px'}}>{errors.lastName}</small>}

        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.email && <small style={{color: 'red', display: 'block', marginBottom: '5px'}}>{errors.email}</small>}

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={form.password}
          onChange={handleChange}
          className={errors.password ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.password && <small style={{color: 'red', display: 'block', marginBottom: '5px'}}>{errors.password}</small>}

        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          value={form.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'input-error' : ''}
          disabled={isLoading}
        />
        {errors.confirmPassword && <small style={{color: 'red', display: 'block', marginBottom: '5px'}}>{errors.confirmPassword}</small>}

        <button 
          className="submit-btn" 
          onClick={handleSignup}
          disabled={isLoading}
          style={{opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}