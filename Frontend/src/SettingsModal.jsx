import React, { useContext } from "react";
import "./SettingsModal.css";
import { MyContext, THEMES } from "./MyContext.jsx";

function SettingsModal() {
  const {
    theme,
    setTheme,
    username,
    setUsername,
    avatarColor,
    setAvatarColor,
    isSettingsOpen,
    setIsSettingsOpen
  } = useContext(MyContext);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    setIsSettingsOpen(false);
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
