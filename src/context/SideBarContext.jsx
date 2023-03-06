import { createContext, useContext, useState } from "react";
import { useChatId } from "./ChatContext";

const SideBarContext = createContext();

export const SideBarCtxProvider = ({children}) => {
    const [showBar, setShowBar] = useState(true);
    const [chatId] = useChatId();

    const toggleSideBar = () => {
        setShowBar(s => !s)
    }

    return (
        <SideBarContext.Provider 
            value={{
                showBar,
                toggleSideBar
            }}>
            {children}
        </SideBarContext.Provider>
    )

}

export const useToggleSideBar = () => {
    const ctx = useContext(SideBarContext);
    if (ctx == null) throw new Error('Need SideBarContext Before using it');
    return ctx.toggleSideBar;
}

export const useIsShowSideBar = () => {
    const ctx = useContext(SideBarContext);
    if (ctx == null) throw new Error('Need SideBarContext Before using it');
    return ctx.showBar;
}