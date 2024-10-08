import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { IoPersonAddSharp } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

import { redirect } from "next/navigation";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  if(!currentUser)
  {
    redirect('/login');
  }
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>
          {data.user?.groupName ? data.user?.groupName : data.user?.displayName}
        </span>
        <span>{data.user.displayName ? "Online" : ""}</span>
        <div className="chatIcons">
          <BsFillCameraVideoFill />
          <IoPersonAddSharp />
          <FiMoreHorizontal />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
