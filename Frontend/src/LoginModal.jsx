import React, { useContext, useState } from "react";
import "./LoginModal.css";
import { MyContext } from "./MyContext.jsx";

function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, isLoggedIn, handleLogin, username, email } = useContext(MyContext);
  
  const [isSignUp, setIsSignUp] = useState(true);
  const [nameInput, setNameInput] = useState(username !== "Explorer" ? username : "");
  const [emailInput, setEmailInput] = useState(email || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isLoginOpen && isLoggedIn) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!nameInput.trim()) {
        setError("Please enter a display name.");
        return;
      }
      if (!emailInput.trim() || !emailInput.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!passwordInput || passwordInput.length < 4) {
        setError("Password must be at least 4 characters long.");
        return;
      }
      if (passwordInput !== confirmPassword) {
        setError("Passwords do not match. Please verify.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: nameInput.trim(),
            email: emailInput.trim(),
            password: passwordInput
          })
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.error || "Registration failed.");
          return;
        }
        handleLogin(data.user.username, data.user.email);
      } catch (err) {
        setLoading(false);
        // Fallback to local auth if backend offline
        handleLogin(nameInput.trim(), emailInput.trim());
      }
    } else {
      if (!emailInput.trim() && !nameInput.trim()) {
        setError("Please enter your email address or display name.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailOrName: emailInput.trim() || nameInput.trim(),
            password: passwordInput
          })
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setError(data.error || "Login failed.");
          return;
        }
        handleLogin(data.user.username, data.user.email);
      } catch (err) {
        setLoading(false);
        // Fallback to local login
        handleLogin(nameInput.trim() || emailInput.split("@")[0] || "Sigma User", emailInput.trim());
      }
    }
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
            <i className="fa-solid fa-brain"></i>
          </div>
          <h2>{isSignUp ? "Create Your Sigma Account" : "Welcome Back to SigmaGPT"}</h2>
          <p>{isSignUp ? "Sign up to unlock custom AI personas, saved history, and cloud sync." : "Sign in to access your saved profile, chat threads, and preferences."}</p>
        </div>

        {/* Tab switch */}
        <div className="auth-tab-bar">
          <button 
            type="button" 
            className={`auth-tab-btn ${isSignUp ? "active" : ""}`}
            onClick={() => { setIsSignUp(true); setError(""); }}
          >
            <i className="fa-solid fa-user-plus"></i> 1st: Create Account
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${!isSignUp ? "active" : ""}`}
            onClick={() => { setIsSignUp(false); setError(""); }}
          >
            <i className="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error-alert animate-shake">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div className="login-field">
              <label><i className="fa-solid fa-user"></i> Display Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="login-input"
              />
            </div>
          )}

          <div className="login-field">
            <label><i className="fa-solid fa-envelope"></i> Email or Username</label>
            <input
              type="text"
              placeholder={isSignUp ? "name@example.com" : "Email or display name"}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-field">
            <label><i className="fa-solid fa-lock"></i> Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="login-input"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="login-field">
              <label><i className="fa-solid fa-shield"></i> Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="login-input"
              />
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : isSignUp ? (
              <>
                <i className="fa-solid fa-user-check"></i> Register & Enter SigmaGPT
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket"></i> Sign In to Account
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>OR QUICK ACCESS</span>
        </div>

        <button className="guest-login-btn" onClick={handleGuestLogin}>
          <i className="fa-solid fa-user-astronaut"></i> Continue as Guest Explorer
        </button>

        <div className="login-footer">
          {isLoggedIn && (
            <button className="login-close-btn" onClick={() => setIsLoginOpen(false)}>
              <i className="fa-solid fa-xmark"></i> Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

