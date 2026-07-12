import React, { useContext } from "react";
import "./SettingsModal.css";
import { MyContext, THEMES } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function SettingsModal() {
  const {
    theme,
    setTheme,
    username,
    setUsername,
    avatarColor,
    setAvatarColor,
    customPrompt,
    setCustomPrompt,
    isSettingsOpen,
    setIsSettingsOpen,
    setAllThreads,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    setIsSettingsOpen(false);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently delete ALL conversations? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/thread", { method: "DELETE" });
      const res = await response.json();
      console.log(res);

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
        <div className="settings-header">
          <h2>SigmaGPT Settings</h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="settings-body">
          {/* Profile Customization Section */}
          <div className="settings-section">
            <h3>Profile Customization</h3>
            <div className="settings-field">
              <label>Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className="settings-input"
              />
            </div>
            
            <div className="settings-field">
              <label>Avatar Color</label>
              <div className="color-presets">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={`color-bubble ${avatarColor === color ? "active" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setAvatarColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Theme Settings Section */}
          <div className="settings-section">
            <h3>Visual Style</h3>
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

          {/* Custom System prompt instructions */}
          <div className="settings-section">
            <h3>Custom Bot Instructions</h3>
            <div className="settings-field">
              <label>Define custom system instructions to guide the bot's tone or persona. Be sure to select the "Custom" persona from the top navbar to apply it.</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., You are a friendly coding mentor..."
                className="settings-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Keyboard Shortcuts Section */}
          <div className="settings-section">
            <h3>Keyboard Shortcuts</h3>
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
              <div className="shortcut-item">
                <span className="shortcut-key">Double Click</span>
                <span className="shortcut-desc">Rename conversation</span>
              </div>
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="settings-section danger-zone">
            <h3>Danger Zone</h3>
            <div className="settings-field">
              <label>Permanently delete all of your chat threads and message history. This cannot be undone.</label>
              <button className="clear-all-btn" onClick={handleClearAll}>
                <i className="fa-solid fa-trash-can"></i> Clear All Conversations
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <p className="db-status">
            <i className="fa-solid fa-circle-check"></i> Database Connection Active
          </p>
          <button className="save-btn" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
