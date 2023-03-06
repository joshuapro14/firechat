import React, { useEffect, useRef } from 'react'
import { useCurrentUser } from '../../../../context/AuthContext'
import dateFormat, { masks } from "dateformat"
import Style from './messagebar.module.css'

masks.chatTime = "DDDD, mmmm dS, yyyy, hh:MM:ss TT";

const Message = ({ message }) => {
    const user = useCurrentUser();
    const msgRef = useRef();

    const isOwner = message && user && user.uid == message.senderId;



    useEffect(() => {
        msgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return message && (
        <div
            className={`${Style.messageRow} ${isOwner && Style.owner}`}
            ref={msgRef}>
            <div className={Style.messageContent}>
                <span className={Style.messageText}>
                    {message.message}
                </span>
                <span className={Style.timestamp}>
                    {
                        message.date &&
                        dateFormat(message.date.toDate(), "chatTime")
                    }
                </span>
            </div>
        </div>
    )
}

export default Message