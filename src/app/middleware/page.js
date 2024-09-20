'use client'

import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import "../style.css";
import { ChatContextProvider } from "../context/ChatContext";
import { AuthContextProvider } from "../context/AuthContext";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { redirect } from 'next/navigation'


const Middle = () => {
    const { currentUser } = useContext(AuthContext);

    useLayoutEffect(() => {
        if (!currentUser) {
            redirect('/login');
          }
        else
        {
            redirect('/home'); 
        }
      }, []);

   
  return (
    <AuthContextProvider>
         <ChatContextProvider>
        <p>
            Loading....
        </p>
         </ChatContextProvider>
    </AuthContextProvider>
    
  );
};

export default Middle;
