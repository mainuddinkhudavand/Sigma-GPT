import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, persona, setPersona, customPrompt, setIsSettingsOpen, username, avatarColor, isSidebarOpen, setIsSidebarOpen} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
                persona: persona,
                customPrompt: customPrompt
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const exportChatToMarkdown = () => {
        if (!prevChats || prevChats.length === 0) return;

        let markdownContent = `# SigmaGPT Chat Export\n\n`;
        prevChats.forEach((chat) => {
            const roleName = chat.role === "user" ? "User" : "SigmaGPT";
            markdownContent += `### **${roleName}**:\n${chat.content}\n\n---\n\n`;
        });

        const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sigmagpt-chat-${currThreadId.substring(0, 8)}.md`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="nav-left">
                    <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle sidebar">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span className="logo-title">SigmaGPT</span>
                    <div className="persona-selector">
                        <select value={persona} onChange={(e) => setPersona(e.target.value)} className="persona-select">
                            <option value="general">🤖 Assistant</option>
                            <option value="coder">💻 Code Wizard</option>
                            <option value="writer">✍️ Creative Writer</option>
                            <option value="sarcastic">🤪 Sarcastic Buddy</option>
                            <option value="custom">⚙️ Custom Bot</option>
                        </select>
                    </div>
                    {prevChats && prevChats.length > 0 && (
                        <button className="nav-icon-btn" onClick={exportChatToMarkdown} title="Export Chat to Markdown">
                            <i className="fa-solid fa-download"></i>
                        </button>
                    )}
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon" style={{ backgroundColor: avatarColor, color: '#fff', fontWeight: 'bold' }} title={username}>
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                    </span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem" onClick={() => { setIsSettingsOpen(true); setIsOpen(false); }}><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            {loading && (
                <div className="gpt-loader-container">
                    <div className="gpt-avatar-loader">
                        <i className="fa-solid fa-robot"></i>
                    </div>
                    <div className="typing-bubble">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
            )}
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;