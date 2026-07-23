import React, { useContext, useState } from "react";
import "./SettingsModal.css";
import { MyContext, THEMES } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function SettingsModal() {
  const {
    theme,
    setTheme,
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
    searchHistory,
    deleteSearchHistoryItem,
    clearAllSearchHistory,
    customPrompt,
    setCustomPrompt,
    codeTheme,
    setCodeTheme,
    isSettingsOpen,
    setIsSettingsOpen,
    allThreads,
    setAllThreads,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    userPlan,
    setIsUpgradeOpen,
    isLoggedIn,
    setIsLoginOpen,
    handleLogout
  } = useContext(MyContext);

  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState("");

  if (!isSettingsOpen) return null;

  const totalThreads = allThreads ? allThreads.length : 0;
  const totalMessages = allThreads ? allThreads.reduce((sum, t) => sum + (t.messages ? t.messages.length : 0), 0) : 0;
  const totalSearches = searchHistory ? searchHistory.length : 0;

  const handleClose = () => {
    setIsSettingsOpen(false);
    setSaveStatus("");
  };

  const handleSaveProfile = () => {
    saveProfileBackend({ username, email, bio, avatarColor });
    setSaveStatus("Profile saved successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleClearAllConversations = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL conversations? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/thread", { method: "DELETE" });
      await response.json();
      setAllThreads([]);
      setPrompt("");
      setReply(null);
      setPrevChats([]);
      setNewChat(true);
      setCurrThreadId(uuidv1());
      setIsSettingsOpen(false);
    } catch(err) {
      console.error("Failed to clear all threads from database:", err);
    }
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
    <div className="settings-overlay" onClick={handleClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="settings-header">
          <div className="header-title">
            <i className="fa-solid fa-user-gear header-icon"></i>
            <h2>SigmaGPT Control Center</h2>
          </div>
          <button className="close-btn" onClick={handleClose} title="Close Settings">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Container with Sidebar Navigation & Tab Content */}
        <div className="settings-container">
          
          {/* Navigation Sidebar */}
          <nav className="settings-nav">
            <button 
              className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fa-solid fa-user"></i>
              <span>User Profile</span>
            </button>

            <button 
              className={`nav-tab ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <i className="fa-solid fa-sliders"></i>
              <span>Preferences</span>
            </button>

            <button 
              className={`nav-tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
              <span>Search History</span>
              {totalSearches > 0 && <span className="tab-badge">{totalSearches}</span>}
            </button>

            <button 
              className={`nav-tab ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <i className="fa-solid fa-chart-pie"></i>
              <span>Analytics</span>
            </button>

            <button 
              className={`nav-tab danger ${activeTab === "danger" ? "active" : ""}`}
              onClick={() => setActiveTab("danger")}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Danger Zone</span>
            </button>
          </nav>

          {/* Main Content Area */}
          <div className="settings-content">

            {/* TAB 1: User Profile */}
            {activeTab === "profile" && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h3>User Profile & Account Intelligence</h3>
                  <p>Personalize your AI identity, avatar styling, subscription plan, and active credentials.</p>
                </div>

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
                    <button className="manage-plan-btn" onClick={() => { setIsSettingsOpen(false); setIsUpgradeOpen(true); }}>
                      <i className="fa-solid fa-rocket"></i> {userPlan === "Free" ? "Upgrade to Pro" : "Manage Subscription"}
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
                    <button className="logout-profile-btn" onClick={() => { handleLogout(); setIsSettingsOpen(false); }}>
                      <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
                    </button>
                  ) : (
                    <button className="login-profile-btn" onClick={() => { setIsLoginOpen(true); setIsSettingsOpen(false); }}>
                      <i className="fa-solid fa-right-to-bracket"></i> Sign In / Create Account
                    </button>
                  )}

                  {saveStatus && <span className="save-status-msg"><i className="fa-solid fa-circle-check"></i> {saveStatus}</span>}
                </div>
              </div>
            )}


            {/* TAB 2: Preferences */}
            {activeTab === "preferences" && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h3>App Preferences</h3>
                  <p>Customize theme aesthetics, bot personality, and editor styles.</p>
                </div>

                {/* Theme Selection */}
                <div className="settings-section-block">
                  <h4><i className="fa-solid fa-wand-magic-sparkles"></i> Visual Theme</h4>
                  <div className="theme-grid">
                    <div
                      className={`theme-card dark ${theme === THEMES.DARK ? "active" : ""}`}
                      onClick={() => setTheme(THEMES.DARK)}
                    >
                      <div className="theme-preview" style={{ backgroundColor: "#131314" }}>
                        <span className="dot" style={{ backgroundColor: "#339cff" }}></span>
                      </div>
                      <span>Sleek Dark</span>
                    </div>

                    <div
                      className={`theme-card cyberpunk ${theme === THEMES.CYBERPUNK ? "active" : ""}`}
                      onClick={() => setTheme(THEMES.CYBERPUNK)}
                    >
                      <div className="theme-preview" style={{ backgroundColor: "#0a0512" }}>
                        <span className="dot" style={{ backgroundColor: "#ff007f" }}></span>
                      </div>
                      <span>Cyberpunk</span>
                    </div>

                    <div
                      className={`theme-card glassmorphism ${theme === THEMES.GLASSMORPHISM ? "active" : ""}`}
                      onClick={() => setTheme(THEMES.GLASSMORPHISM)}
                    >
                      <div className="theme-preview" style={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <span className="dot" style={{ backgroundColor: "#38bdf8" }}></span>
                      </div>
                      <span>Glassmorphism</span>
                    </div>

                    <div
                      className={`theme-card emerald ${theme === THEMES.EMERALD ? "active" : ""}`}
                      onClick={() => setTheme(THEMES.EMERALD)}
                    >
                      <div className="theme-preview" style={{ backgroundColor: "#0b1511" }}>
                        <span className="dot" style={{ backgroundColor: "#10b981" }}></span>
                      </div>
                      <span>Emerald Forest</span>
                    </div>
                  </div>
                </div>

                {/* Custom Bot Instructions */}
                <div className="settings-section-block">
                  <h4><i className="fa-solid fa-robot"></i> Custom Bot Instructions</h4>
                  <div className="settings-field">
                    <label>Define custom system instructions to guide the bot's tone or persona. Select "Custom" persona from the top navbar to activate.</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="e.g., You are a friendly coding mentor..."
                      className="settings-textarea"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Code Theme */}
                <div className="settings-section-block">
                  <h4><i className="fa-solid fa-code"></i> Code Syntax Theme</h4>
                  <div className="settings-field">
                    <select
                      value={codeTheme}
                      onChange={(e) => setCodeTheme(e.target.value)}
                      className="settings-select"
                    >
                      <option value="github">GitHub Dark (Default)</option>
                      <option value="monokai">Monokai Classic</option>
                      <option value="cyberpunk">Cyberpunk Neon</option>
                    </select>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="settings-section-block">
                  <h4><i className="fa-solid fa-keyboard"></i> Keyboard Shortcuts</h4>
                  <div className="shortcuts-list">
                    <div className="shortcut-item">
                      <span className="shortcut-key">Ctrl + ,</span>
                      <span className="shortcut-desc">Open / Close Settings</span>
                    </div>
                    <div className="shortcut-item">
                      <span className="shortcut-key">Esc</span>
                      <span className="shortcut-desc">Close Modals</span>
                    </div>
                    <div className="shortcut-item">
                      <span className="shortcut-key">Enter</span>
                      <span className="shortcut-desc">Send message</span>
                    </div>
                    <div className="shortcut-item">
                      <span className="shortcut-key">Shift + Enter</span>
                      <span className="shortcut-desc">Add new line</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Search History */}
            {activeTab === "history" && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header flex-header">
                  <div>
                    <h3>Search History</h3>
                    <p>Review and manage your logged chat search queries saved in the database.</p>
                  </div>
                  {searchHistory && searchHistory.length > 0 && (
                    <button className="clear-history-btn" onClick={clearAllSearchHistory}>
                      <i className="fa-solid fa-trash-can"></i> Clear All History
                    </button>
                  )}
                </div>

                {searchHistory && searchHistory.length > 0 ? (
                  <div className="search-history-list">
                    {searchHistory.map((item) => (
                      <div key={item._id || item.timestamp} className="history-item-card">
                        <div className="history-item-content">
                          <i className="fa-solid fa-magnifying-glass history-icon"></i>
                          <span className="history-query">{item.query}</span>
                        </div>
                        <div className="history-item-actions">
                          <span className="history-time">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button 
                            className="delete-history-btn" 
                            onClick={() => deleteSearchHistoryItem(item._id)}
                            title="Delete query"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-history-state">
                    <i className="fa-solid fa-clock-rotate-left empty-icon"></i>
                    <p>No search history recorded yet.</p>
                    <small>Search for chat titles in the sidebar to log your searches here.</small>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Analytics */}
            {activeTab === "analytics" && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h3>Usage Analytics</h3>
                  <p>Real-time statistics on your chat threads, messages, and theme settings.</p>
                </div>

                <div className="stats-grid">
                  <div className="stats-card">
                    <i className="fa-solid fa-comments stats-card-icon"></i>
                    <span className="stats-num">{totalThreads}</span>
                    <span className="stats-label">Total Chats</span>
                  </div>
                  <div className="stats-card">
                    <i className="fa-solid fa-paper-plane stats-card-icon"></i>
                    <span className="stats-num">{totalMessages}</span>
                    <span className="stats-label">Total Messages</span>
                  </div>
                  <div className="stats-card">
                    <i className="fa-solid fa-magnifying-glass stats-card-icon"></i>
                    <span className="stats-num">{totalSearches}</span>
                    <span className="stats-label">Logged Searches</span>
                  </div>
                  <div className="stats-card animate-theme">
                    <i className="fa-solid fa-palette stats-card-icon"></i>
                    <span className="stats-num" style={{ textTransform: "capitalize" }}>{theme}</span>
                    <span className="stats-label">Active Theme</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Danger Zone */}
            {activeTab === "danger" && (
              <div className="tab-pane animate-fade-in">
                <div className="pane-header">
                  <h3 className="danger-title">Danger Zone</h3>
                  <p>Irreversible actions that affect your stored chat history and database records.</p>
                </div>

                <div className="danger-box">
                  <div className="danger-info">
                    <h4>Delete All Conversations</h4>
                    <p>Permanently truncate all stored conversation threads and message logs in MongoDB. This action cannot be undone.</p>
                  </div>
                  <button className="clear-all-btn" onClick={handleClearAllConversations}>
                    <i className="fa-solid fa-trash-can"></i> Clear All Conversations
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <p className="db-status">
            <i className="fa-solid fa-database"></i> Connected with Database & Search Service
          </p>
          <button className="done-btn" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
