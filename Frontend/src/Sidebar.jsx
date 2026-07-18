import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { API_URL } from "./config.js";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen, token} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_URL}/api/thread`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if(token) getAllThreads();
    }, [currThreadId, token])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setIsSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        setIsSidebarOpen(false);

        try {
            const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
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
            const response = await fetch(`${API_URL}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
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

    return (
        <>
            {isSidebarOpen && <div className="sidebarOverlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <section className={`sidebar ${isSidebarOpen ? "sidebarOpen" : ""}`}>
                <div className="sidebarTop">
                    <button className="newChatBtn" onClick={createNewChat}>
                        <img src="src/Assests/orion.png" alt="OrionGPT logo" className="logo"></img>
                        <span className="wordmark">GPTn't</span>
                        <span><i className="fa-solid fa-pen-to-square"></i></span>
                    </button>
                </div>

                {allThreads?.length > 0 && <p className="historyLabel">Recent</p>}
                <ul className="history">
                    {
                        allThreads?.map((thread, idx) => (
                            <li key={idx} 
                                onClick={(e) => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted": " "}
                            >
                                {thread.title}
                                <i className="fa-solid fa-trash"
                                    onClick={(e) => {
                                        e.stopPropagation(); //stop event bubbling
                                        deleteThread(thread.threadId);
                                    }}
                                ></i>
                            </li>
                        ))
                    }
                </ul>
    
                <div className="sign">
                    <p>By Ayush Verma</p>
                </div>
            </section>
        </>
    )
}

export default Sidebar;