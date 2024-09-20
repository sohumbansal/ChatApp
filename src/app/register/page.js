'use client'
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation'
import {AiOutlineUserAdd} from 'react-icons/ai'
import {PiButterflyDuotone} from 'react-icons/pi'
import { ChatContextProvider } from "../context/ChatContext";
import { AuthContextProvider } from "../context/AuthContext";
import "../style.css";
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handleSubmit = async (e) => {
    console.log('i am running');
   // setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;


    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);//firebase auth

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
       //Update profile
            await updateProfile(res.user, {
              displayName,
           
            });
            //creating  users db on firestore - to store users
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
             
            });
            console.log("User created successfully");

            //creating userChats db on firestore - to store chats
            await setDoc(doc(db, "userChats", res.user.uid), {});
            router.push('/home');

      // await uploadBytesResumable(storageRef, file).then(() => {
      //   getDownloadURL(storageRef).then(async (downloadURL) => {
      //     try {
           
      //     } catch (err) {
      //       console.log('i am catch 1');
      //       console.log(err);
      //       setErr(true);
      //       setLoading(false);
      //     }
      //   });
      // });
    } catch (err) {
      console.log('i am catch 2');
      setErr(true);
      setLoading(false);
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
        
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          {/* <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <div className="iconContainer">
                <AiOutlineUserAdd className="icon"/>
            </div>            
            <span>Add an avatar</span>
          </label> */}
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? 
          <button type="button" onClick={() => router.push('/login')}>
      Login
    </button>

          {/* <Link className="link"to="/login">Login</Link> */}
        </p>
      </div>
    </div>
        </ChatContextProvider>
    </AuthContextProvider>

  );
};

export default Register;