import { set } from 'mongoose';
import './SearchUser.css'
import ChatPreview from '../ChatPreview/ChatPreview'
import { useEffect, useState,useRef } from 'react';
import { currentUser } from '../utils';
export default function SearchUser({selectedUser, onClose}){
    const[visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
        setVisible(true);
    }, 5);
        return () => clearTimeout(timer);
    },[]);
    const popUpRef = useRef(null);
    const [usersFound, setUsersFound] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        function handleClickOutside (event){
            if (popUpRef.current && !popUpRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    
},[onClose]);
    const handleSearch = (query) => {
        setSearchQuery(query);
        if(query === ''){
            setUsersFound([]);
            return;
        }
        try{
            fetch('http://localhost:9000/searchUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    searchQuery: query
                })
            }).then(res => res.json()).then(data => {
                setUsersFound(data);
            })
        }
        catch(err){
            console.log('Error');
        }
    }
    return(
        <div className="search-user-overlay">
            <div className={`search-user-pop-up ${visible ? 'visible' : ''}`} ref={popUpRef}>
                <div className='search-user-body'>
                    <input placeholder="Search or start new chat" className="search-bar-pop-up" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}></input>
                </div>
                {searchQuery !== '' && <div className='search-user-results'>
                    {usersFound.map(user => {
                        return(
                            <div key={user.username} className='search-user-result'>
                                <ChatPreview user={user} onClick={() => selectedUser(user)} key={user.username}></ChatPreview> 
                            </div>
                        )
                    }).filter((user) => user !== currentUser().username)}
                </div> }
                {searchQuery !== '' && usersFound.length === 0
                && <div className='search-user-result'>
                    <p>No results found</p>
                </div>}
            </div>
        </div>
    )
}