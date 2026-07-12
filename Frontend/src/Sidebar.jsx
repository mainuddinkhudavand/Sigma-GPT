import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen} = useContext(MyContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingThreadId, setEditingThreadId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    const handleRename = async (threadId) => {
        if (!tempTitle.trim()) {
            setEditingThreadId(null);
            return;
        }
        
        // Optimistic UI update
        setAllThreads(prev => prev.map(t => t.threadId === threadId ? { ...t, title: tempTitle } : t));
        setEditingThreadId(null);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: tempTitle })
            });
            const res = await response.json();
            console.log(res);
        } catch(err) {
            console.log("Failed to rename thread on backend:", err);
        }
    };

    return (
        <section className="sidebar">
            <div className="sidebar-header">
                <button onClick={createNewChat} className="new-chat-btn">
                    <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>
                <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} title="Close sidebar">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div className="search-container">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <ul className="history">
                {
                    allThreads?.filter(thread => 
                        thread.title?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => {
                                if (editingThreadId !== thread.threadId) {
                                    changeThread(thread.threadId);
                                }
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingThreadId(thread.threadId);
                                setTempTitle(thread.title);
                            }}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {editingThreadId === thread.threadId ? (
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onBlur={() => handleRename(thread.threadId)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleRename(thread.threadId);
                                        } else if (e.key === "Escape") {
                                            setEditingThreadId(null);
                                        }
                                    }}
                                    autoFocus
                                    className="edit-title-input"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <>
                                    <span className="thread-title-text">{thread.title}</span>
                                    <div className="thread-actions">
                                        <i className="fa-solid fa-pen-to-square edit-icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingThreadId(thread.threadId);
                                                setTempTitle(thread.title);
                                            }}
                                        ></i>
                                        <i className="fa-solid fa-trash"
                                            onClick={(e) => {
                                                e.stopPropagation(); //stop event bubbling
                                                deleteThread(thread.threadId);
                                            }}
                                        ></i>
                                    </div>
                                </>
                            )}
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By ApnaCollege &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;