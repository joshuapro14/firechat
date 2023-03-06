import React, { useCallback, useEffect, useRef } from 'react'
import { useUserChat } from '../../../../context/ChatContext';
import Style from './chatsBar.module.css';
import dateFormat, { masks } from 'dateformat'
import { useToggleSideBar } from '../../../../context/SideBarContext';

masks.chatTime = "DDDD, mmmm dS, yyyy, hh:MM:ss TT";

const Chat = ({ chat }) => {
  const [userChat, setUserChat] = useUserChat();
  const toggleSideBar = useToggleSideBar();
  const ref = useRef();

  const isSelected = useCallback(() => {
    return userChat && chat && userChat.chatId == chat.chatId;
  }, [userChat, chat])

  useEffect(() => {
    if (isSelected()) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat])


  const handleClick = (e) => {
    e.stopPropagation();
    setUserChat(chat);
    toggleSideBar();
  }

  return chat && chat.displayName && (
    <div
      className={`${Style.chat} ${isSelected() && Style.selected}`}
      onClick={handleClick}
      ref={ref}
    >
      <span>{chat.displayName}</span>
      <span>{chat.email}</span>
      <span className={Style.lastMessageBox}>
        <span className={Style.lastMessage}>
          {chat.lastMessage}
        </span>
        <span className={Style.timestamp}>
          {
            chat.date &&
            dateFormat(chat.date.toDate(), "chatTime")
          }
        </span>
      </span>


    </div>
  )
}


export default Chat