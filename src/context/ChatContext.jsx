import { createContext, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "./AuthContext"

const ChatContext = createContext();

export const ChatCtxProvider = ({ children }) => {
    const [chatId, setChatId] = useState(null);
    const [userChat, setUserChat] = useState(null);

    useEffect(()=>{
        setChatId(userChat && userChat.chatId);
    },[userChat]);

    return (
        <ChatContext.Provider value={
            {
                chatId, setChatId,
                userChat, setUserChat
            }
        }>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatId = () => {
    const ctx = useContext(ChatContext);
    if (ctx == null) throw new Error('Need ChatContext Before using it');
    return [ctx.chatId, ctx.setChatId];
}

export const useUserChat = () => {
    const ctx = useContext(ChatContext);
    if (ctx == null) throw new Error('Need ChatContext Before using it');
    return [ctx.userChat, ctx.setUserChat];
}
