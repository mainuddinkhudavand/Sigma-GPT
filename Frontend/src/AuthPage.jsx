import React, { useContext, useState } from "react";
import "./AuthPage.css";
import { MyContext } from "./MyContext.jsx";

function AuthPage() {
  const { handleLogin, showToast } = useContext(MyContext);
  
  const [isSignUp, setIsSignUp] = useState(true); // Default to Registration first
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!nameInput.trim()) {
        setError("Please enter your display name.");
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
          setError(data.error || "Registration failed. Please try again.");
          return;
        }
        handleLogin(data.user.username, data.user.email);
      } catch (err) {
        setLoading(false);
        // Fallback login if backend offline
        handleLogin(nameInput.trim(), emailInput.trim());
      }
    } else {
      if (!emailInput.trim() && !nameInput.trim()) {
        setError("Please enter your email address or username.");
        return;
      }
      if (!passwordInput) {
        setError("Please enter your password.");
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
          setError(data.error || "Invalid credentials.");
          return;
        }
        handleLogin(data.user.username, data.user.email);
      } catch (err) {
        setLoading(false);
        handleLogin(nameInput.trim() || emailInput.split("@")[0] || "Sigma User", emailInput.trim());
      }
    }
  };

  const handleGuestAccess = () => {
    setError("");
    handleLogin("Explorer", "guest@sigmagpt.ai");
    if (showToast) showToast("Welcome to SigmaGPT Guest Mode!");
  };

  return (
    <div className="auth-page-container">
      {/* Dynamic Background Glow Elements */}
      <div className="bg-glow orb-1"></div>
      <div className="bg-glow orb-2"></div>
      
      <div className="auth-content-wrapper">
        {/* Left Hero Column */}
        <div className="auth-hero-section">
          <div className="brand-badge animate-fade-in">
            <div className="brand-logo-icon">
              <i className="fa-solid fa-brain"></i>
            </div>
            <span className="brand-name">SigmaGPT</span>
          </div>

          <h1 className="hero-heading animate-slide-up">
            Next-Gen AI Intelligence <br />
            <span className="gradient-text">Built for Creators & Engineers</span>
          </h1>

          <p className="hero-subtext animate-slide-up">
            Sign up or log in to unlock custom AI Personas, voice audio text-to-speech, infinite thread history, and premium dark mode themes.
          </p>

          <div className="features-grid animate-fade-in">
            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
              <div className="feature-info">
                <h4>Ultra-Fast Response</h4>
                <p>Powered by high-throughput AI models</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-masks-theater"></i></div>
              <div className="feature-info">
                <h4>Custom AI Personas</h4>
                <p>Code Wizard, Writer & Sarcastic Buddy</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-volume-high"></i></div>
              <div className="feature-info">
                <h4>Voice Text-to-Speech</h4>
                <p>Listen to assistant answers aloud</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
              <div className="feature-info">
                <h4>Secure Cloud Sync</h4>
                <p>Persistent MongoDB database support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Form Column */}
        <div className="auth-form-section">
          <div className="auth-card animate-scale-up">
            <div className="card-header">
              <h2>{isSignUp ? "Create Your Sigma Account" : "Welcome Back"}</h2>
              <p>{isSignUp ? "Register below to begin using the AI workspace" : "Sign in to access your saved profile & chat history"}</p>
            </div>

            {/* Auth Tab Switcher */}
            <div className="auth-mode-tabs">
              <button 
                type="button"
                className={`tab-btn ${isSignUp ? "active" : ""}`}
                onClick={() => { setIsSignUp(true); setError(""); }}
              >
                <i className="fa-solid fa-user-plus"></i> Register 1st
              </button>
              <button 
                type="button"
                className={`tab-btn ${!isSignUp ? "active" : ""}`}
                onClick={() => { setIsSignUp(false); setError(""); }}
              >
                <i className="fa-solid fa-right-to-bracket"></i> Sign In
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error-alert animate-shake">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              {isSignUp && (
                <div className="form-field">
                  <label><i className="fa-solid fa-user"></i> Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="auth-input"
                  />
                </div>
              )}

              <div className="form-field">
                <label><i className="fa-solid fa-envelope"></i> Email Address or Username</label>
                <input
                  type="text"
                  placeholder={isSignUp ? "name@example.com" : "Email or display name"}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="auth-input"
                  required
                />
              </div>

              <div className="form-field">
                <label><i className="fa-solid fa-lock"></i> Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="auth-input"
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-field">
                  <label><i className="fa-solid fa-shield"></i> Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
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

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button type="button" className="guest-access-btn" onClick={handleGuestAccess}>
              <i className="fa-solid fa-user-astronaut"></i> Continue as Guest Explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
