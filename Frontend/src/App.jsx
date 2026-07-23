import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import SettingsModal from "./SettingsModal.jsx";
import LoginModal from "./LoginModal.jsx";
import UpgradeModal from "./UpgradeModal.jsx";
import { MyContext, THEMES } from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  // Theme and User Customization States with defensive check
  const getInitialTheme = () => {
    const saved = localStorage.getItem("sigmagpt-theme");
    const validThemes = Object.values(THEMES || {});
    return saved && validThemes.includes(saved) ? saved : "dark";
  };

  const getInitialPersona = () => {
    const saved = localStorage.getItem("sigmagpt-persona");
    const validPersonas = ["general", "coder", "writer", "sarcastic", "custom"];
    return saved && validPersonas.includes(saved) ? saved : "general";
  };

  const getInitialCodeTheme = () => {
    const saved = localStorage.getItem("sigmagpt-code-theme");
    const validCodeThemes = ["github", "monokai", "cyberpunk"];
    return saved && validCodeThemes.includes(saved) ? saved : "github";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [username, setUsername] = useState(localStorage.getItem("sigmagpt-username") || "Explorer");
  const [email, setEmail] = useState(localStorage.getItem("sigmagpt-email") || "");
  const [bio, setBio] = useState(localStorage.getItem("sigmagpt-bio") || "Exploring the AI cosmos with SigmaGPT.");
  const [avatarColor, setAvatarColor] = useState(localStorage.getItem("sigmagpt-avatar-color") || "#339cff");
  const [avatarIcon, setAvatarIcon] = useState(localStorage.getItem("sigmagpt-avatar-icon") || "fa-robot");
  const [searchHistory, setSearchHistory] = useState([]);
  const [persona, setPersona] = useState(getInitialPersona);
  const [customPrompt, setCustomPrompt] = useState(localStorage.getItem("sigmagpt-custom-prompt") || "You are an expert tutor who explains complex scientific concepts using simple analogies.");
  const [codeTheme, setCodeTheme] = useState(getInitialCodeTheme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Authentication & Subscription Plan States
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("sigmagpt-is-logged-in") === "true");
  const [userPlan, setUserPlan] = useState(() => localStorage.getItem("sigmagpt-user-plan") || "Free");
  const [isLoginOpen, setIsLoginOpen] = useState(() => localStorage.getItem("sigmagpt-is-logged-in") !== "true");
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");



  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const handleLogin = (user, mail) => {
    const finalName = user && user.trim() ? user.trim() : "Explorer";
    const finalMail = mail && mail.trim() ? mail.trim() : "";
    setUsername(finalName);
    setEmail(finalMail);
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    localStorage.setItem("sigmagpt-is-logged-in", "true");
    localStorage.setItem("sigmagpt-username", finalName);
    localStorage.setItem("sigmagpt-email", finalMail);
    saveProfileBackend({ username: finalName, email: finalMail, isLoggedIn: true, plan: userPlan });
    showToast(`Welcome back, ${finalName}! Logged in successfully.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsLoginOpen(true);
    localStorage.setItem("sigmagpt-is-logged-in", "false");
    saveProfileBackend({ isLoggedIn: false });
    showToast("Logged out successfully.");
  };

  const handleUpgradePlan = (newPlan) => {
    setUserPlan(newPlan);
    localStorage.setItem("sigmagpt-user-plan", newPlan);
    saveProfileBackend({ plan: newPlan });
    setIsUpgradeOpen(false);
    showToast(`Upgraded to ${newPlan} Plan successfully! 🎉`);
  };

  // Sync profile from backend database
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.username) setUsername(data.username);
        if (data.email !== undefined) setEmail(data.email);
        if (data.bio !== undefined) setBio(data.bio);
        if (data.avatarColor) setAvatarColor(data.avatarColor);
        if (data.avatarIcon) setAvatarIcon(data.avatarIcon);
        if (data.plan) setUserPlan(data.plan);
        if (data.isLoggedIn !== undefined && localStorage.getItem("sigmagpt-is-logged-in") === null) {
          setIsLoggedIn(data.isLoggedIn);
          setIsLoginOpen(!data.isLoggedIn);
        }
      }
    } catch (err) {
      console.log("Using local storage fallback for user profile:", err);
    }
  };

  const saveProfileBackend = async (updatedData) => {
    try {
      if (updatedData.avatarIcon) localStorage.setItem("sigmagpt-avatar-icon", updatedData.avatarIcon);
      await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.error("Failed to sync profile to backend:", err);
    }
  };

  // Sync search history from backend database
  const fetchSearchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/search-history");
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch search history:", err);
    }
  };

  const logSearchQuery = async (query) => {
    if (!query || !query.trim()) return;
    try {
      const response = await fetch("http://localhost:8080/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });
      if (response.ok) {
        fetchSearchHistory();
      }
    } catch (err) {
      console.error("Failed to log search query:", err);
    }
  };

  const deleteSearchHistoryItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/search-history/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSearchHistory(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete search history item:", err);
    }
  };

  const clearAllSearchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/search-history", { method: "DELETE" });
      if (response.ok) {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error("Failed to clear search history:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSearchHistory();
  }, []);

  // Sync theme attribute with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("sigmagpt-theme", theme);
  }, [theme]);

  // Sync username, avatarColor, email, bio to localStorage
  useEffect(() => {
    localStorage.setItem("sigmagpt-username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-bio", bio);
  }, [bio]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-avatar-color", avatarColor);
  }, [avatarColor]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-avatar-icon", avatarIcon);
  }, [avatarIcon]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-persona", persona);
  }, [persona]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-custom-prompt", customPrompt);
  }, [customPrompt]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-code-theme", codeTheme);
  }, [codeTheme]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    theme, setTheme,
    username, setUsername,
    email, setEmail,
    bio, setBio,
    avatarColor, setAvatarColor,
    avatarIcon, setAvatarIcon,
    saveProfileBackend,
    searchHistory, setSearchHistory,
    fetchSearchHistory, logSearchQuery,
    deleteSearchHistoryItem, clearAllSearchHistory,
    persona, setPersona,
    customPrompt, setCustomPrompt,
    codeTheme, setCodeTheme,
    isSettingsOpen, setIsSettingsOpen,
    isSidebarOpen, setIsSidebarOpen,
    isLoggedIn, setIsLoggedIn,
    userPlan, setUserPlan,
    isLoginOpen, setIsLoginOpen,
    isUpgradeOpen, setIsUpgradeOpen,
    handleLogin, handleLogout, handleUpgradePlan,
    showToast
  }; 

  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
          <SettingsModal></SettingsModal>
          <LoginModal></LoginModal>
          <UpgradeModal></UpgradeModal>
          {toastMsg && (
            <div className="toast-notification animate-bounce-in">
              <i className="fa-solid fa-circle-check toast-icon"></i>
              <span>{toastMsg}</span>
            </div>
          )}
        </MyContext.Provider>
    </div>
  )
}

export default App;
