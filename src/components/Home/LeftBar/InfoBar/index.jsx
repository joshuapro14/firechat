import React from 'react';
import Style from './infobar.module.css';
import Logo from '../../../Logo';
import { signOutUser } from '../../../../firebase/services';

import { useCurrentUser } from '../../../../context/AuthContext';

const InfoBar = () => {
  const user = useCurrentUser();
  const signOut = async() => {
    await signOutUser();
  }

  return (
    <div className={Style.bar}>
      <div className={Style.titleBar}>
        
        <span className={Style.logo}>
          <Logo />
        </span>
        <button onClick={signOut}>
            Sign out
        </button>
      </div> 
      <div className={Style.infoBar}>
        <span className={Style.userDisplayName}>
          {user.displayName}
        </span>
        <span className={Style.email}>
          {user.email}
        </span>
      </div>
        
        
    </div>
  )
}

export default InfoBar