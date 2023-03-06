import React from 'react'
import { useUserChat } from '../../../../context/ChatContext'
import Style from './infobar.module.css'
import SideBarIcon from './SideBarIcon';

const InfoBar = () => {
  const [userChat] = useUserChat(); 

  return userChat && userChat.displayName && (
    <div className={Style.container}>
      <span>
        <SideBarIcon />
      </span>
      <div className={Style.bar}>        
        <span className={Style.item}>
          {userChat && userChat.displayName}
        </span>
        <span className={Style.item}>
          {userChat && userChat.email}
        </span>
        
    </div>
    </div>
    
  )
}

export default InfoBar