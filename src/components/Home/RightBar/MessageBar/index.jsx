import React, { useEffect, useState } from 'react'
import { useChatId } from '../../../../context/ChatContext'
import { subscribeToChats } from '../../../../firebase/services'
import Message from './Message'
import Style from './messagebar.module.css'

const Messages = () => {
    const [chatId] = useChatId();
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        const unSub = subscribeToChats(chatId, (msgs) =>{
            setMessages(msgs);
        })
        return () => unSub && unSub();
    }, [chatId])
  return chatId && messages && (
    <div className={Style.bar}>
        {messages.map(msg => (
            <Message message={msg} key={msg.id}/>
        ))}
    </div>
  )
}

export default Messages