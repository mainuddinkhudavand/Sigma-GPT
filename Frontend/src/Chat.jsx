import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const triggerCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className="copy-msg-btn" onClick={triggerCopy} title="Copy message">
            {copied ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-copy"></i>}
        </button>
    );
};

const SpeakButton = ({ text }) => {
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleSpeech = (e) => {
        e.stopPropagation();
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            window.speechSynthesis.cancel();
            // Clean markdown tags for clearer speech
            const cleanText = text.replace(/[*#`_\-]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = () => setSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setSpeaking(true);
        }
    };

    return (
        <button className="speak-msg-btn" onClick={toggleSpeech} title={speaking ? "Stop reading" : "Read aloud"}>
            {speaking ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume-high"></i>}
        </button>
    );
};

const CopyCodeButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const triggerCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button className="copy-code-btn" onClick={triggerCopy}>
            {copied ? <><i className="fa-solid fa-check"></i> Copied</> : <><i className="fa-solid fa-copy"></i> Copy</>}
        </button>
    );
};

const MarkdownComponents = {
    code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const codeText = String(children).replace(/\n$/, '');
        const isBlock = match || String(children).includes('\n');
        
        if (isBlock) {
            return (
                <div className="code-container">
                    <div className="code-header">
                        <span className="code-lang">{match ? match[1] : 'code'}</span>
                        <CopyCodeButton text={codeText} />
                    </div>
                    <pre className="code-pre">
                        <code className={className} {...props}>
                            {children}
                        </code>
                    </pre>
                </div>
            );
        }
        return <code className={className} {...props}>{children}</code>;
    }
};

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv message-container"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <>
                                    <div className="message-content">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={MarkdownComponents}>{chat.content}</ReactMarkdown>
                                    </div>
                                    <div className="message-actions">
                                        <CopyButton text={chat.content} />
                                        <SpeakButton text={chat.content} />
                                    </div>
                                </>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv message-container" key={"non-typing"} >
                                        <div className="message-content">
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={MarkdownComponents}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                        </div>
                                        <div className="message-actions">
                                            <CopyButton text={prevChats[prevChats.length-1].content} />
                                            <SpeakButton text={prevChats[prevChats.length-1].content} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="gptDiv message-container" key={"typing"} >
                                        <div className="message-content">
                                            <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={MarkdownComponents}>{latestReply}</ReactMarkdown>
                                        </div>
                                        <div className="message-actions">
                                            <CopyButton text={latestReply} />
                                            <SpeakButton text={latestReply} />
                                        </div>
                                    </div>
                                )

                            }
                        </>
                    )
                }

            </div>
        </>
    )
}

export default Chat;