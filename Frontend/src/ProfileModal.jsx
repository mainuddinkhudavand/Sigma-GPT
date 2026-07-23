import React, { useContext, useState } from "react";
import "./ProfileModal.css";
import { MyContext } from "./MyContext.jsx";

function ProfileModal() {
  const {
    isProfileOpen,
    setIsProfileOpen,
    username,
    setUsername,
    email,
    setEmail,
    bio,
    setBio,
    avatarColor,
    setAvatarColor,
    avatarIcon,
    setAvatarIcon,
    saveProfileBackend,
    userPlan,
    setIsUpgradeOpen,
    isLoggedIn,
    setIsLoginOpen,
    handleLogout,
    allThreads,
    searchHistory
  } = useContext(MyContext);

  const [saveStatus, setSaveStatus] = useState("");

  if (!isProfileOpen) return null;

  const totalThreads = allThreads ? allThreads.length : 0;
  const totalMessages = allThreads ? allThreads.reduce((sum, t) => sum + (t.messages ? t.messages.length : 0), 0) : 0;
  const totalSearches = searchHistory ? searchHistory.length : 0;

  const handleClose = () => {
    setIsProfileOpen(false);
    setSaveStatus("");
  };

  const handleSaveProfile = () => {
    saveProfileBackend({ username, email, bio, avatarColor, avatarIcon });
    setSaveStatus("Profile saved successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const presetColors = [
    "#339cff", // Classic Blue
    "#ff4757", // Rose Red
    "#2ed573", // Emerald Green
    "#ffa502", // Sunset Orange
    "#9b59b6", // Amethyst Purple
    "#e84393", // Neon Pink
    "#f1c40f", // Gold Yellow
    "#1abc9c"  // Turquoise
  ];

  return (
    <div className="profile-modal-overlay" onClick={handleClose}>
      <div className="profile-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="profile-modal-header">
          <div className="header-title">
            <i className="fa-solid fa-user-astronaut header-icon"></i>
            <h2>My Profile & Account</h2>
          </div>
          <button className="close-btn" onClick={handleClose} title="Close Profile">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Profile Content Body */}
        <div className="profile-modal-body">
          
          {/* Profile Card Banner */}
          <div className="profile-banner-card" style={{ "--avatar-bg": avatarColor }}>
            <div className="profile-avatar-wrapper" style={{ backgroundColor: avatarColor }}>
              <i className={`fa-solid ${avatarIcon || "fa-robot"}`}></i>
            </div>

            <div className="profile-details-box">
              <div className="profile-title-row">
                <h4>{username || "Explorer"}</h4>
                <span className={`plan-badge-pill ${userPlan.toLowerCase()}`}>
                  <i className="fa-solid fa-shield-halved"></i> {userPlan} Plan
                </span>
              </div>
              <p className="profile-email-text"><i className="fa-solid fa-envelope"></i> {email || "guest@sigmagpt.ai"}</p>
              <p className="profile-bio-text">"{bio || "Exploring the AI cosmos with SigmaGPT."}"</p>
            </div>

            <div className="profile-tier-cta">
              <button className="manage-plan-btn" onClick={() => { setIsProfileOpen(false); setIsUpgradeOpen(true); }}>
                <i className="fa-solid fa-rocket"></i> {userPlan === "Free" ? "Upgrade to Pro" : "Manage Plan"}
              </button>
            </div>
          </div>

          {/* Activity Metrics Grid */}
          <div className="profile-stats-grid">
            <div className="stat-metric-card">
              <div className="stat-icon"><i className="fa-solid fa-comments"></i></div>
              <div className="stat-info">
                <span className="stat-value">{totalThreads}</span>
                <span className="stat-label">Total Chats</span>
              </div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-icon"><i className="fa-solid fa-paper-plane"></i></div>
              <div className="stat-info">
                <span className="stat-value">{totalMessages}</span>
                <span className="stat-label">Messages Sent</span>
              </div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <div className="stat-info">
                <span className="stat-value">{totalSearches}</span>
                <span className="stat-label">Search Queries</span>
              </div>
            </div>
            <div className="stat-metric-card">
              <div className="stat-icon"><i className="fa-solid fa-bolt"></i></div>
              <div className="stat-info">
                <span className="stat-value">{userPlan === "Enterprise" ? "Unlimited" : userPlan === "Pro" ? "5,000" : "50 / day"}</span>
                <span className="stat-label">AI Capacity</span>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="profile-form-section">
            <div className="settings-field">
              <label><i className="fa-solid fa-signature"></i> Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className="settings-input"
              />
            </div>

            <div className="settings-field">
              <label><i className="fa-solid fa-envelope"></i> Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="settings-input"
              />
            </div>

            <div className="settings-field">
              <label><i className="fa-solid fa-quote-left"></i> About & Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief tagline or bio..."
                className="settings-textarea"
                rows={2}
              />
            </div>

            {/* Avatar Icon Selector */}
            <div className="settings-field">
              <label><i className="fa-solid fa-icons"></i> Choose Avatar Symbol</label>
              <div className="avatar-icons-selector">
                {[
                  { icon: "fa-robot", label: "Robot" },
                  { icon: "fa-user-astronaut", label: "Astronaut" },
                  { icon: "fa-wand-magic-sparkles", label: "Wizard" },
                  { icon: "fa-crown", label: "Crown" },
                  { icon: "fa-code", label: "Coder" },
                  { icon: "fa-brain", label: "Brain" },
                  { icon: "fa-ghost", label: "Ghost" },
                  { icon: "fa-user", label: "Classic" }
                ].map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    className={`avatar-icon-btn ${avatarIcon === item.icon ? "active" : ""}`}
                    onClick={() => setAvatarIcon && setAvatarIcon(item.icon)}
                    title={item.label}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Color presets */}
            <div className="settings-field">
              <label><i className="fa-solid fa-palette"></i> Avatar Accent Color</label>
              <div className="color-presets">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-bubble ${avatarColor === color ? "active" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setAvatarColor(color)}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  value={avatarColor}
                  onChange={(e) => setAvatarColor(e.target.value)}
                  className="custom-color-picker"
                  title="Choose custom color"
                />
              </div>
            </div>
          </div>

          <div className="action-row">
            <button className="save-profile-btn" onClick={handleSaveProfile}>
              <i className="fa-solid fa-floppy-disk"></i> Save Profile Changes
            </button>

            {isLoggedIn ? (
              <button className="logout-profile-btn" onClick={() => { handleLogout(); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
              </button>
            ) : (
              <button className="login-profile-btn" onClick={() => { setIsLoginOpen(true); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-right-to-bracket"></i> Sign In / Create Account
              </button>
            )}

            {saveStatus && <span className="save-status-msg"><i className="fa-solid fa-circle-check"></i> {saveStatus}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
