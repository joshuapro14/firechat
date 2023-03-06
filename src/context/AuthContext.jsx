import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged} from "../firebase/services"

const AuthContext = createContext();

const INIT = {};

export const AuthCtxProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(INIT);

    useEffect(() => {
        const unsub = onAuthStateChanged(async(user) => {
            setCurrentUser(user);
        })

        return () => unsub();
    }, []);


    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useCurrentUser = () => {
    const ctx = useContext(AuthContext);
    if (ctx == null) throw new Error('Need AuthContext Before using it');
    return ctx.currentUser;
}

export const useLoggedIn = () => {
    const ctx = useContext(AuthContext);
    if (ctx == null) throw new Error('Need AuthContext Before using it');
    return { isLoggedIn: ctx.currentUser != null && ctx.currentUser != INIT };
}

export const useIsAuthInitialized = () => {
    const ctx = useContext(AuthContext);
    if (ctx == null) throw new Error('Need AuthContext Before using it');
    return { isInitialized: ctx.currentUser != INIT };
}