import React, { useContext, useState } from "react";
import { IoSend } from "react-icons/io5";
import { BsFillCameraFill } from "react-icons/bs";
import { IoAttachOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSendMsgInGroup = async (group) => {
    await updateDoc(doc(db, "chats", group.groupId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    Promise.all(
      group.members.map((member) => {
        return new Promise(async (resolve, reject) => {
          try {
            await updateDoc(doc(db, "userChats", member), {
              [group.groupId + ".lastMessage"]: {
                text,
              },
              [group.groupId + ".date"]: serverTimestamp(),
            });
            console.log("added to user's chat", member);
            resolve();
          } catch (err) {
            console.log("error while adding to user chat", err);
            resolve();
          }
        });
      })
    );
  };

  const handleSend = async () => {
    console.log("am running");
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      //uploading image to storage
      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      console.log(data);
      if (data.user.groupId) {
        handleSendMsgInGroup(data.user);
        return;
      }
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    //updating last message and date in userChats for current user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    //updating last message and date in userChats for other user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  return (
    <div className="input" >
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <label>
          <IoAttachOutline className="fileIcon" />
        </label>

        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <BsFillCameraFill className="fileIcon" />
        </label>
        <button onClick={handleSend} className="my_score_button">
          <IoSend className="fileIcon" />
        </button>
      </div>
    </div>
  );
};

export default Input;
