
import { auth, db } from ".";
import { onAuthStateChanged as onAuthChange, signOut, updateProfile } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, writeBatch, serverTimestamp, arrayUnion, Timestamp, onSnapshot } from 'firebase/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import { flattenArray } from "../utility";

import {v4 as uuid} from 'uuid';


const onAuthStateChanged = (cb) => {
    return onAuthChange(auth, (user) => {
        typeof cb == "function" && cb(user);
    });
}

const updateLogout = async (user) => {
    if (user == null || user.uid == null) return;
    const userRef = doc(db, "user", user.uid);
    await setDoc(userRef, { isLoggedIn: false }, { merge: true });
}

const SEARCH_WORD_TYPES = ["string", "number"]

const formatSearchWord = (sw, splitBy=false) => {
    if (!SEARCH_WORD_TYPES.some(tp => tp == typeof sw)) {
        return sw;
    }
    const word0 = `${sw}`.toLowerCase().replace(/\s/g,'');
    if(!splitBy)return word0;
    return `${sw}`.toLowerCase()
        .split(/\s/g)
        .filter(s => s != "")
        .concat(word0)
}

const getSearchWords = (...keys) => {
    let sws = flattenArray(keys)
        .filter(k => SEARCH_WORD_TYPES.some(tp => tp == typeof k))
        .map((sw) => formatSearchWord(sw, true));
    return [...new Set(flattenArray(sws))];
}

const registerUser = async ({ email, password, displayName }) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName });
    const batch = writeBatch(db);
    batch.set(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        isLoggedIn: true,
        searchWords: getSearchWords(displayName, email)
    })
    batch.set(doc(db, "userchats", res.user.uid), {});
    await batch.commit();
}

const signInUser = async ({ email, password }) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const batch = writeBatch(db);
    batch.set(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
        isLoggedIn: true
    }, { merge: true })
    batch.set(doc(db, "userchats", res.user.uid), {}, { merge: true });
    await batch.commit();
}

const getCurrentAuthUser = () => {
    try {
        return auth.currentUser;
    } catch (error) {
        return null;
    }
}

const signOutUser = async () => {
    updateLogout(getCurrentAuthUser());
    await signOut(auth);
}

const fetchCurrentUser = async () => {
    try {
        const user = getCurrentAuthUser();;
        if (user == null) return null;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
        return null;
    }
}

const searchUsers = async (searchString) => {
    if (!SEARCH_WORD_TYPES.some(tp => tp == typeof searchString)) return [];
    const q = query(
        collection(db, "users"),
        where("searchWords", "array-contains", formatSearchWord(searchString)));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => doc.data());
}

const getUserChat = async(uid, chatId) => {   
    const chatRef = doc(db, `userchats/${uid}/chats/${chatId}`);
    const chatSnap = await getDoc(chatRef);
        return chatSnap.exists() ? chatSnap.data() : null;
}

const getChatById = async(chatId) => {
    const chatRef = doc(db, `chats/${chatId}`);
    const chatSnap = await getDoc(chatRef);
        return chatSnap.exists() ? chatSnap.data() : null;
}

const isChatExist = async(uid, chatId) => {
    try {
        const res = await Promise.all([getUserChat(uid, chatId), getChatById(chatId)])
        return res.every(r => r != null);
    } catch (error) {
        return false;
    }
}

const sendMessage = async(senderUID, receiverUID, chatId, message) => {
    const batch = writeBatch(db);

    const sourceChatRef = doc(db, `userchats/${senderUID}/chats/${chatId}`);
    const sourceUserChat = {
        destUid: receiverUID,
        date: serverTimestamp(),
        lastMessage: message
    }
    batch.set(sourceChatRef, sourceUserChat, {merge: true});

    const destChatRef = doc(db, `userchats/${receiverUID}/chats/${chatId}`);
    const destUserChat = {
        destUid: senderUID,
        date: serverTimestamp(),
        lastMessage: message
    }
    batch.set(destChatRef, destUserChat, {merge: true});

    const chatsRef = doc(db, "chats", chatId);
    batch.set(chatsRef, {
        messages: arrayUnion({
            id: uuid(),
            senderId: senderUID,
            message,
            date: Timestamp.now(),
        }), 
        updateBy: senderUID
    }, {merge: true});

    await batch.commit();
}

const createNewUserChat = async(sourceUser, destUser, chatId) => {
    const batch = writeBatch(db);

    const sourceChatRef = doc(db, `userchats/${sourceUser.uid}/chats/${chatId}`);
    const sourceUserChat = {
        destUid: destUser.uid,
        displayName: destUser.displayName,
        email: destUser.email,
        participants: [sourceUser.uid, destUser.uid],
        date: serverTimestamp()
    }
    batch.set(sourceChatRef, sourceUserChat, {merge: true});

    const destChatRef = doc(db, `userchats/${destUser.uid}/chats/${chatId}`);
    const destUserChat = {
        destUid: sourceUser.uid,
        displayName: sourceUser.displayName,
        email: sourceUser.email,
        participants: [sourceUser.uid, destUser.uid],
        date: serverTimestamp()
    }
    batch.set(destChatRef, destUserChat, {merge: true});

    const chatsRef = doc(db, "chats", chatId);
    batch.set(chatsRef, {messages: [], updateBy: sourceUser.uid}, {merge: true});

    await batch.commit();

}

const subscribeToChats = (chatId, callBack) => {
    if(chatId == null)return null;
    const chatsRef = doc(db, "chats", chatId);
    return onSnapshot(chatsRef, (d) => {
        if(d.exists() && typeof callBack == "function"){
            callBack(d.data().messages);
        }
    })
}

const subscribeToUserChats = (uid, callBack) => {
    if(uid == null)return null;
    const userChatRef = collection(db, `userchats/${uid}/chats`);
    return onSnapshot(userChatRef, (docs) => {
        if(typeof callBack == "function"){
            const chats = [];
            docs.forEach(doc => {
                chats.push({
                    chatId: doc.id,
                    ...doc.data()
                })
            })
            callBack(chats);
        }
    })
}

export {
    onAuthStateChanged,
    updateLogout,
    registerUser,
    signInUser,
    signOutUser,
    fetchCurrentUser,
    searchUsers,
    getUserChat,
    createNewUserChat,
    isChatExist,
    sendMessage,
    subscribeToChats,
    subscribeToUserChats
}