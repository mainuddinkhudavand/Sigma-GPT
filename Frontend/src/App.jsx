import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import SettingsModal from "./SettingsModal.jsx";
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
  const [avatarColor, setAvatarColor] = useState(localStorage.getItem("sigmagpt-avatar-color") || "#339cff");
  const [persona, setPersona] = useState(getInitialPersona);
  const [customPrompt, setCustomPrompt] = useState(localStorage.getItem("sigmagpt-custom-prompt") || "You are an expert tutor who explains complex scientific concepts using simple analogies.");
  const [codeTheme, setCodeTheme] = useState(getInitialCodeTheme);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Sync theme attribute with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("sigmagpt-theme", theme);
  }, [theme]);

  // Sync username, avatarColor, persona, and customPrompt to localStorage
  useEffect(() => {
    localStorage.setItem("sigmagpt-username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-avatar-color", avatarColor);
  }, [avatarColor]);

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
    avatarColor, setAvatarColor,
    persona, setPersona,
    customPrompt, setCustomPrompt,
    codeTheme, setCodeTheme,
    isSettingsOpen, setIsSettingsOpen,
    isSidebarOpen, setIsSidebarOpen
  }; 

  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
          <SettingsModal></SettingsModal>
        </MyContext.Provider>
    </div>
  )
}

export default App;
