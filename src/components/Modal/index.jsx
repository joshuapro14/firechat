import React, { useState } from 'react'
import Style from './modal.module.css';

const Modal = ({ title, body, children, ...props }) => {
    const [isOpen, setIsOpen] = useState(true)
    let condition = title != null && (body != null || children != null);
    if (!isOpen || !condition) return;

    const close = () => {
        if (typeof props.onClose === "function") props.onClose();
        setIsOpen(false);
    }

    const stopPropagation = (e) => e.stopPropagation();

    return (
        <div className={Style.modalContainer} onClick={close}>
            <div className={Style.modalBox} onClick={stopPropagation}>
                <div className={Style.header}>
                    <span></span>
                    <span className={Style.title}>
                    {title}
                    </span>
                    <button
                        className={Style.closebtn}
                        onClick={close}>
                        X
                    </button>
                </div>
                <hr/>
                <div className={Style.body}>
                    {body}
                    {children}
                </div>
                {
                    props.footer && <footer>{props.footer}</footer>
                }
            </div>
        </div>
    )
}

export default Modal