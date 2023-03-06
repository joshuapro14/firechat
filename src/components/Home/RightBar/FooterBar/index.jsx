import React, { useRef, useState } from 'react'
import { useChatId, useUserChat } from '../../../../context/ChatContext'
import Style from './footerbar.module.css'
import { sendMessage } from '../../../../firebase/services'
import { useCurrentUser } from '../../../../context/AuthContext'
import Errors from '../../../Modal/Errors'

const FooterBar = () => {
  const sender = useCurrentUser();
  const [chatId] = useChatId();
  const [receiver] = useUserChat();
  const inputRef = useRef();
  const [errors, setErrors] = useState(null);

  const handleEnter = async (e) => {
    try {
      if (e.code === "Enter") {
        await sendMessage(sender.uid, receiver.destUid, chatId, inputRef.current.value);
        inputRef.current.value = "";
      }
    } catch (error) {
      setErrors([`${error}`]);
    }

  }

  const handleChange = () => {
    setErrors([]);
  }

  return chatId && receiver && receiver.displayName && (
    <div className={Style.bar}>
      <Errors error={errors}/>
      <div className={Style.inputBox}>
        <input ref={inputRef}
          placeholder="Type a message"
          onKeyDown={handleEnter}
          onChange={handleChange}
          className={Style.inputMessage} />
      </div>
    </div>
  )
}

export default FooterBar