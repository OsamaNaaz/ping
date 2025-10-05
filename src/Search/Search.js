import { useState } from 'react';
import './Search.css'
import { RiChatNewLine } from "react-icons/ri";
import SearchUser from '../SearchUser/SearchUser';
export default function Search({onSearch, selectedUser}){
    const [searchPopUp, setSearchPopUp] = useState(false);
    return(
        <div className="search-container">
            <input placeholder="Search or start new chat" className="search-bar" onChange={(e) => onSearch(e.target.value)}></input>
            <div className="search-icon-container">
                <RiChatNewLine className='search-icon' onClick={() => setSearchPopUp(!searchPopUp)}></RiChatNewLine>
            </div>
            {searchPopUp && <SearchUser selectedUser={selectedUser}></SearchUser>}
        </div>
    )
}
