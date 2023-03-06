import React from 'react'
import FooterBar from './FooterBar'
import InfoBar from './InfoBar'
import Style from './rightBar.module.css'
import MessageBar from './MessageBar'

const RightBar = () => {
  return (
    <div className={Style.bar}>
        <InfoBar />
        <div className={Style.scrollableBar}>
                <MessageBar />
                

        </div>
        <FooterBar />
        {/* <div style={{flexShrink: 0}}></div> */}
        
    </div>
  )
}

export default RightBar