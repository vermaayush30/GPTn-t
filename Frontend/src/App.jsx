import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile slide-in state

  const [token, setToken] = useState(localStorage.getItem("orionToken") || null);
  const [user, setUser] = useState(() => {
      const stored = localStorage.getItem("orionUser");
      return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken, newUser) => {
      localStorage.setItem("orionToken", newToken);
      localStorage.setItem("orionUser", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
  };

  const logout = () => {
      localStorage.removeItem("orionToken");
      localStorage.removeItem("orionUser");
      setToken(null);
      setUser(null);
      setCurrThreadId(uuidv1());
      setPrevChats([]);
      setAllThreads([]);
      setNewChat(true);
      setReply(null);
      setPrompt("");
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen,
    token, user, login, logout
  }; 

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          {
            token ? (
              <>
                <Sidebar></Sidebar>
                <ChatWindow></ChatWindow>
              </>
            ) : (
              <Auth></Auth>
            )
          }
        </MyContext.Provider>
    </div>
  )
}

export default App