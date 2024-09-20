import {createContext,useContext,useReducer,} from "react";
  import { AuthContext } from "./AuthContext";
  import React from "react";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    //Reducer
    const chatReducer = (state, action) => {
      console.log(action.payload);
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:action.payload.groupId?action.payload.groupId:
              currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid,
          };
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };