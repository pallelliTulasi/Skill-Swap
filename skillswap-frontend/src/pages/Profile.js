import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate(); // Add this for navigation
  // Get stored user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add logout loading state

  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branch: "",
    role: "",
    profileType: "learner",
    about: "",
    skillsToTeach: [],
    skillsToLearn: [],
    profileImage: "",
  });

  const [newSkillTeach, setNewSkillTeach] = useState("");
  const [newSkillLearn, setNewSkillLearn] = useState("");

  const API_BASE_URL = "http://localhost:8081";

  // ⭐ Logout function
  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    setIsLoggingOut(true);
    
    try {
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // if you have token stored
      
      // Optional: Call backend logout API if you have one
      // await fetch(`${API_BASE_URL}/api/auth/logout`, {
      //   method: "POST",
      //   credentials: "include" // if using cookies
      // });
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  // ⭐ Load from localStorage FIRST
  useEffect(() => {
    if (storedUser) {
      console.log("Loading from localStorage:", storedUser);
      setUserData({
        id: storedUser.id || "",
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        branch: storedUser.branch || "",
        role: storedUser.role || "",
        profileType: storedUser.profileType || "learner",
        about: storedUser.about || "",
        skillsToTeach: storedUser.skillsToTeach || [],
        skillsToLearn: storedUser.skillsToLearn || [],
        profileImage: storedUser.profileImage || "",
      });
    }
    // Then sync with database
    fetchUserProfile();
  }, []);

  // ⭐ Background sync with database
  const fetchUserProfile = async () => {
    if (!storedUser?.email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/get/${storedUser.email}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Background sync from DB:", data);
      }
    } catch (error) {
      console.error("Background sync failed:", error);
    }
  };

  // ⭐ Save to localStorage IMMEDIATELY
  const saveToLocalStorage = (updatedData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user")) || {};
      const userForStorage = {
        ...currentUser,
        ...updatedData,
      };
      localStorage.setItem("user", JSON.stringify(userForStorage));
      console.log(" Saved to localStorage:", userForStorage);
      setLastSaved(new Date().toLocaleTimeString());
      return userForStorage;
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      return updatedData;
    }
  };

  // ⭐ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => {
      const updated = { ...prev, [name]: value };
      saveToLocalStorage({ [name]: value });
      return updated;
    });
  };

  // ⭐ Handle profile type change
  const handleProfileTypeChange = (type) => {
    setUserData(prev => {
      const updated = { ...prev, profileType: type };
      saveToLocalStorage({ profileType: type });
      return updated;
    });
  };

  // ⭐ Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData(prev => {
        const updated = { ...prev, profileImage: reader.result };
        saveToLocalStorage({ profileImage: reader.result });
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  // ⭐ Handle add skill to teach
  const addSkillToTeach = () => {
    if (newSkillTeach.trim()) {
      setUserData(prev => {
        const currentSkills = prev.skillsToTeach || [];
        const updatedSkills = [...currentSkills, newSkillTeach.trim()];
        const updated = { ...prev, skillsToTeach: updatedSkills };
        saveToLocalStorage({ skillsToTeach: updatedSkills });
        return updated;
      });
      setNewSkillTeach("");
    }
  };

  // ⭐ Handle add skill to learn
  const addSkillToLearn = () => {
    if (newSkillLearn.trim()) {
      setUserData(prev => {
        const currentSkills = prev.skillsToLearn || [];
        const updatedSkills = [...currentSkills, newSkillLearn.trim()];
        const updated = { ...prev, skillsToLearn: updatedSkills };
        saveToLocalStorage({ skillsToLearn: updatedSkills });
        return updated;
      });
      setNewSkillLearn("");
    }
  };

  // ⭐ Handle remove skill
  const removeSkillToTeach = (indexToRemove) => {
    setUserData(prev => {
      const currentSkills = prev.skillsToTeach || [];
      const updatedSkills = currentSkills.filter((_, index) => index !== indexToRemove);
      const updated = { ...prev, skillsToTeach: updatedSkills };
      saveToLocalStorage({ skillsToTeach: updatedSkills });
      return updated;
    });
  };

  const removeSkillToLearn = (indexToRemove) => {
    setUserData(prev => {
      const currentSkills = prev.skillsToLearn || [];
      const updatedSkills = currentSkills.filter((_, index) => index !== indexToRemove);
      const updated = { ...prev, skillsToLearn: updatedSkills };
      saveToLocalStorage({ skillsToLearn: updatedSkills });
      return updated;
    });
  };

  // ⭐ Handle submit to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const latestUserData = JSON.parse(localStorage.getItem("user")) || userData;

    const updateData = {
      id: latestUserData.id,
      firstName: latestUserData.firstName || "",
      lastName: latestUserData.lastName || "",
      email: latestUserData.email,
      phone: latestUserData.phone || "",
      branch: latestUserData.branch || "",
      role: latestUserData.role || "",
      profileType: latestUserData.profileType || "learner",
      about: latestUserData.about || "",
      skillsToTeach: latestUserData.skillsToTeach || [],
      skillsToLearn: latestUserData.skillsToLearn || [],
      profileImage: latestUserData.profileImage || "",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Database sync failed");
      const dbResponse = await response.json();
      
      localStorage.setItem("user", JSON.stringify(dbResponse));
      setUserData(dbResponse);
      alert("Profile synced with database!");
      setIsEditMode(false);
      
    } catch (error) {
      console.error(" Database sync failed:", error);
      setError("Changes saved locally but failed to sync with database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUserData(savedUser);
    setIsEditMode(false);
    setError("");
  };

  return (
    <div className="profile-container-compact">
      {/* Simple status message */}
      {lastSaved && !isEditMode && (
        <div style={{
          background: '#e8f5e9',
          padding: '5px 10px',
          margin: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#2e7d32',
          textAlign: 'right'
        }}>
           Saved {lastSaved}
        </div>
      )}
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Syncing with database...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message" style={{
          background: '#fff3e0',
          color: '#e65100',
          padding: '10px',
          margin: '10px',
          borderRadius: '5px',
          border: '1px solid #ff9800',
          position: 'relative'
        }}>
          {error}
          <button 
            onClick={() => setError("")}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#e65100'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="profile-header-compact">
        <h1>My Profile</h1>
        <div className="profile-buttons" style={{ display: 'flex', gap: '10px' }}>
          {isEditMode ? (
            <>
              <button
                className="action-btn-compact submit"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  background: '#4CAF50',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? "Syncing..." : " Save to Database"}
              </button>
              <button
                className="action-btn-compact cancel"
                onClick={handleCancel}
                style={{
                  background: '#f44336',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="action-btn-compact edit"
                onClick={() => setIsEditMode(true)}
                style={{
                  background: '#2196F3',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                 Edit Profile
              </button>
              
              {/* 🔴 LOGOUT BUTTON - Added here */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: isLoggingOut ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoggingOut) e.target.style.background = '#c82333';
                }}
                onMouseLeave={(e) => {
                  if (!isLoggingOut) e.target.style.background = '#dc3545';
                }}
              >
                {isLoggingOut ? (
                  <>
                    <span>⏳</span> Logging out...
                  </>
                ) : (
                  <>
                    <span></span> Logout
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rest of your profile content remains exactly the same */}
      <div className="profile-content-compact">
        {/* LEFT SECTION */}
        <div className="profile-left-compact">
          {/* Profile Card with Avatar */}
          <div className="profile-card-compact">
            <div
              className={`profile-avatar-compact ${isEditMode ? "editable" : ""}`}
              onClick={() => isEditMode && fileInputRef.current.click()}
              style={{ cursor: isEditMode ? 'pointer' : 'default' }}
            >
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Profile" 
                  className="profile-img"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div className="avatar-placeholder-compact" style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 'bold'
                }}>
                  {userData.firstName?.charAt(0) || ''}{userData.lastName?.charAt(0) || ''}
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: "none" }}
            />

            <h3 className="profile-name-compact" style={{ marginTop: '15px', marginBottom: '5px' }}>
              {userData.firstName} {userData.lastName}
            </h3>
            <p className="profile-role-compact" style={{ color: '#666', marginBottom: '20px' }}>
              {userData.role || 'Member'}
            </p>
          </div>

          {/* Profile Type Selection */}
          <div className="profile-type-section-compact" style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>I want to:</h4>
            <div className="type-buttons-compact" style={{ display: 'flex', gap: '10px' }}>
              {["learner", "teacher", "both"].map((type) => (
                <button
                  key={type}
                  className={`type-btn-compact ${userData.profileType === type ? "active" : ""}`}
                  disabled={!isEditMode}
                  onClick={() => handleProfileTypeChange(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: userData.profileType === type ? '#4CAF50' : '#f0f0f0',
                    color: userData.profileType === type ? 'white' : 'black',
                    cursor: !isEditMode ? 'default' : 'pointer',
                    fontWeight: userData.profileType === type ? 'bold' : 'normal'
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="about-section-compact" style={{ marginTop: '25px' }}>
            <h4 style={{ marginBottom: '10px' }}>About Me</h4>
            {isEditMode ? (
              <textarea
                name="about"
                value={userData.about || ""}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            ) : (
              <p style={{ 
                background: '#f9f9f9', 
                padding: '12px', 
                borderRadius: '8px',
                lineHeight: '1.6',
                color: '#333'
              }}>
                {userData.about || "No about information added yet."}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SECTION - Keep all your existing code here */}
        <div className="profile-right-compact" style={{ flex: 1 }}>
          {/* Personal Information Card */}
          <div className="personal-info-card" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
              Personal Information
            </h3>

            {/* First Name */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                First Name
              </label>
              {isEditMode ? (
                <input
                  name="firstName"
                  value={userData.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {userData.firstName || "Not set"}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                Last Name
              </label>
              {isEditMode ? (
                <input
                  name="lastName"
                  value={userData.lastName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {userData.lastName || "Not set"}
                </p>
              )}
            </div>

            {/* Email (Read Only) */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                Email
              </label>
              <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px', color: '#666' }}>
                {userData.email || "Not set"}
              </p>
            </div>

            {/* Phone */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                Phone
              </label>
              {isEditMode ? (
                <input
                  name="phone"
                  value={userData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {userData.phone || "Not set"}
                </p>
              )}
            </div>

            {/* Branch */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                Branch
              </label>
              {isEditMode ? (
                <input
                  name="branch"
                  value={userData.branch || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your branch"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {userData.branch || "Not set"}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="info-field-compact" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#555' }}>
                Role
              </label>
              {isEditMode ? (
                <input
                  name="role"
                  value={userData.role || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your role (e.g., Student, Teacher)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <p style={{ padding: '10px', background: '#f5f5f5', borderRadius: '6px' }}>
                  {userData.role || "Not set"}
                </p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="skills-section-compact">
            {/* Skills to Learn */}
            {(userData.profileType === "learner" || userData.profileType === "both") && (
              <div className="skills-card-compact" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}> Skills I Want to Learn</h3>
                
                {isEditMode && (
                  <div className="add-skill-compact" style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <input
                      value={newSkillLearn}
                      onChange={(e) => setNewSkillLearn(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillToLearn()}
                      placeholder="Add a skill..."
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={addSkillToLearn}
                      style={{
                        padding: '10px 20px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      + Add
                    </button>
                  </div>
                )}

                <div className="skills-list">
                  {userData.skillsToLearn && userData.skillsToLearn.length > 0 ? (
                    userData.skillsToLearn.map((skill, index) => (
                      <div key={index} className="skill-item-compact" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 15px',
                        background: '#e3f2fd',
                        margin: '8px 0',
                        borderRadius: '8px',
                        border: '1px solid #bbdefb'
                      }}>
                        <span style={{ color: '#1976d2' }}>{skill}</span>
                        {isEditMode && (
                          <button
                            onClick={() => removeSkillToLearn(index)}
                            style={{
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 12px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic', padding: '15px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
                      No skills added yet
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Skills to Teach */}
            {(userData.profileType === "teacher" || userData.profileType === "both") && (
              <div className="skills-card-compact" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}> Skills I Can Teach</h3>
                
                {isEditMode && (
                  <div className="add-skill-compact" style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px'
                  }}>
                    <input
                      value={newSkillTeach}
                      onChange={(e) => setNewSkillTeach(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkillToTeach()}
                      placeholder="Add a skill..."
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      onClick={addSkillToTeach}
                      style={{
                        padding: '10px 20px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      + Add
                    </button>
                  </div>
                )}

                <div className="skills-list">
                  {userData.skillsToTeach && userData.skillsToTeach.length > 0 ? (
                    userData.skillsToTeach.map((skill, index) => (
                      <div key={index} className="skill-item-compact" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 15px',
                        background: '#fff3e0',
                        margin: '8px 0',
                        borderRadius: '8px',
                        border: '1px solid #ffe0b2'
                      }}>
                        <span style={{ color: '#e65100' }}>{skill}</span>
                        {isEditMode && (
                          <button
                            onClick={() => removeSkillToTeach(index)}
                            style={{
                              background: '#ff4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 12px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic', padding: '15px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
                      No skills added yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;