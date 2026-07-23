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

  const [activeTab, setActiveTab] = useState("preferences");
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
    saveProfileBackend({ username, email, bio, avatarColor, avatarIcon });
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
            <i className="fa-solid fa-gear header-icon"></i>
            <h2>System Control & Settings</h2>
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
