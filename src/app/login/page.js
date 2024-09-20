'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {PiButterflyDuotone} from 'react-icons/pi'
import { ChatContextProvider } from "../context/ChatContext";
import { AuthContextProvider } from "../context/AuthContext";
import "../style.css";

const Login = () => {
  const [err, setErr] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);//firebase auth
      router.push('/home');
    } catch (err) {
      setErr(true);
    }
  };
  return (
    <AuthContextProvider>
        <ChatContextProvider>
        <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">
            ChatApp
            <PiButterflyDuotone className="logoIcon"/>
        </span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>You don't have an account? 
        <button type="button" onClick={() => router.push('/register')}>
      Register
    </button>
    </p> 
            {/* <Link className="link" to="/register">Register</Link></p> */}
      </div>
    </div>
        </ChatContextProvider>
    </AuthContextProvider>
   
  );
};

export default Login;