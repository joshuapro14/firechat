import React, { useRef, useState, useCallback } from 'react';
import { debounce } from '../../utility';

import Style from './searchbox.module.css'

const SearchBox = ({onChange, handleSearch,disabled}) => {
    const searchRef = useRef();

    const handleChange = debounce(()=>{
        if(typeof onChange == "function"){
            onChange(searchRef.current.value);
        }
    },500);

    const handleKey = (e) => {
        if(e.code === "Enter" && typeof handleSearch == "function"){
            handleSearch(searchRef.current.value);
            searchRef.current.value = "";
        }
    }
  return (
    <span>
        <input type="text" placeholder='Search' ref={searchRef} 
        className={Style.input} onChange={handleChange} 
        onKeyDown={handleKey}
        disabled={disabled}
        />
    </span>
  )
}

export default SearchBox