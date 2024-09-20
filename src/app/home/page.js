'use client'

import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import "../style.css";
import { ChatContextProvider } from "../context/ChatContext";
import { AuthContextProvider } from "../context/AuthContext";

const Home = () => {
  return (
    <AuthContextProvider>
         <ChatContextProvider>
         <div className="home">
      <div className="container">
     
        <Sidebar />
        <Chat />
      </div>
    </div>
         </ChatContextProvider>
    </AuthContextProvider>
    
  );
};

export default Home;
