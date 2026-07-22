import React, { useContext, useState } from "react";
import "./LoginModal.css";
import { MyContext } from "./MyContext.jsx";

function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, isLoggedIn, handleLogin, username, email } = useContext(MyContext);
  
  const [nameInput, setNameInput] = useState(username !== "Explorer" ? username : "");
  const [emailInput, setEmailInput] = useState(email || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  if (!isLoginOpen && isLoggedIn) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim() && !isSignUp) {
      setError("Please enter a display name or email to continue.");
      return;
    }
    setError("");
    handleLogin(nameInput || "Sigma User", emailInput);
  };

  const handleGuestLogin = () => {
    setError("");
    handleLogin("Explorer", "guest@sigmagpt.ai");
  };

  return (
    <div className="login-overlay">
      <div className="login-modal animate-scale-up">
        <div className="login-header">
          <div className="login-logo-badge">
            <i className="fa-solid fa-robot"></i>
          </div>
          <h2>Welcome to SigmaGPT</h2>
          <p>{isSignUp ? "Create your account to save chats & customize your AI experience." : "Sign in to access your profile, history, and AI assistant personas."}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error-alert">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="login-field">
            <label><i className="fa-solid fa-user"></i> Display Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Rivera"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required={isSignUp}
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label><i className="fa-solid fa-envelope"></i> Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label><i className="fa-solid fa-lock"></i> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="login-input"
            />
          </div>

          <button type="submit" className="login-submit-btn">
            <i className="fa-solid fa-right-to-bracket"></i> {isSignUp ? "Create Account & Sign In" : "Sign In to SigmaGPT"}
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button className="guest-login-btn" onClick={handleGuestLogin}>
          <i className="fa-solid fa-user-astronaut"></i> Continue as Guest (Quick 1st Login)
        </button>

        <div className="login-footer">
          <p>
            {isSignUp ? "Already have an account?" : "New to SigmaGPT?"}{" "}
            <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-auth-mode">
              {isSignUp ? "Sign In" : "Create Account"}
            </span>
          </p>
          {isLoggedIn && (
            <button className="login-close-btn" onClick={() => setIsLoginOpen(false)}>
              <i className="fa-solid fa-xmark"></i> Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
