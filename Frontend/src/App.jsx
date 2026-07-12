import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import SettingsModal from "./SettingsModal.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  // Theme and User Customization States
  const [theme, setTheme] = useState(localStorage.getItem("sigmagpt-theme") || "dark");
  const [username, setUsername] = useState(localStorage.getItem("sigmagpt-username") || "Explorer");
  const [avatarColor, setAvatarColor] = useState(localStorage.getItem("sigmagpt-avatar-color") || "#339cff");
  const [persona, setPersona] = useState(localStorage.getItem("sigmagpt-persona") || "general");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  // Sync theme attribute with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("sigmagpt-theme", theme);
  }, [theme]);

  // Sync username, avatarColor, and persona to localStorage
  useEffect(() => {
    localStorage.setItem("sigmagpt-username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-avatar-color", avatarColor);
  }, [avatarColor]);

  useEffect(() => {
    localStorage.setItem("sigmagpt-persona", persona);
  }, [persona]);

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
