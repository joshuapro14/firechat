import { useEffect, useState } from 'react';
import { useCurrentUser } from '../../../../context/AuthContext';
import { useChatId, useUserChat } from '../../../../context/ChatContext'
import { subscribeToUserChats } from '../../../../firebase/services';
import Chat from './Chat';
import Style from './chatsBar.module.css'

const ChatsBar = () => {
    const currentUser = useCurrentUser();
    const [, setUserChat] = useUserChat();
    const [, setChatId] = useChatId();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const unsub = subscribeToUserChats(currentUser.uid, (c) => {
            setChats(c);

        })
        return () => unsub && unsub();
    }, [currentUser])

    const sortedChats = () => {
        if(!Array.isArray(chats))return [];
        return chats.sort((c1, c2) => c2.date - c1.date);
    }

    return chats && chats.length > 0 && (
        <div className={Style.container}>
            
            {
                sortedChats().map(chat => (
                    <Chat chat={chat} key={chat.chatId} />
    
                ))
            }

        </div>
    )
}

export default ChatsBar