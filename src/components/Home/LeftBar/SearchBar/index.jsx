import { useState } from 'react';
import {useCurrentUser} from '../../../../context/AuthContext';
import Style from "./searchbar.module.css";
import SearchBox from "../../../SearchBox";
import { searchUsers, getUserChat, createNewUserChat, isChatExist } from '../../../../firebase/services';
import SearchResults from './SearchResults';
import Errors from '../../../Modal/Errors';
import { useChatId, useUserChat } from '../../../../context/ChatContext';
import { useToggleSideBar } from '../../../../context/SideBarContext';

const SearchBar = () => {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useCurrentUser();
  const [errors, setErrors] = useState(null);
  const [, setChatId] = useChatId();
  const toggleSideBar = useToggleSideBar();
 

  const [, setUserChat] = useUserChat();

  const handleSearch = async (searchString) => {
    setIsLoading(true);
    setErrors(null);
    let dbUsers = await searchUsers(searchString);
    if(currentUser != null && currentUser.email != null){
      dbUsers = dbUsers.filter(u => u.email != currentUser.email);
    }
    setUsers(dbUsers);
    setIsLoading(false);
  }

  const handleSelect = async(selectedUser) => { 
    setErrors(null);
    const chatId = selectedUser.uid > currentUser.uid
                        ? `${currentUser.uid}${selectedUser.uid}`
                        : `${selectedUser.uid}${currentUser.uid}`;
    try {
            
      const flag = await isChatExist(currentUser.uid, chatId);

      if(!flag){
        await createNewUserChat(currentUser, selectedUser, chatId);
      }

      setUserChat({chatId,  destUid: selectedUser.uid, ...selectedUser});


      setUsers([]);
      toggleSideBar();
    } catch (error) {
      setErrors([`${error}`]);
    }                        
  }


  return (
    <div className={Style.container}>
      {isLoading && <h3>Loading...</h3>}
      <SearchBox handleSearch={handleSearch} disabled={isLoading} />
      <Errors error={errors} />
      <SearchResults users={users}
        disabled={isLoading}
        handleSelect={handleSelect} />
    </div>
  )
}

export default SearchBar