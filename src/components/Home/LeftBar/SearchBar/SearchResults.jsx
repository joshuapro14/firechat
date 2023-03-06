import React from 'react'
import Style from "./searchbar.module.css";

//searchResultsBox
const SearchResults = ({ users, disabled, handleSelect }) => {
    if (!Array.isArray(users) || users.length == 0 || disabled) return;

    const selectUser = (e, user) => {
        e.stopPropagation();
        handleSelect(user);
    }

    return (
        <div className={Style.searchResultsBox}>
            {
                users.map(user => (
                    <div key={user.uid} 
                        className={Style.searchedUser} 
                        onClick={(e) => selectUser(e, user)}>
                        <span>{user.displayName}</span>
                        <span>{user.email}</span>
                    </div>
                ))
            }

        </div>
    )
}

export default SearchResults