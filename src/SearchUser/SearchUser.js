import { set } from 'mongoose';
import './SearchUser.css'
import ChatPreview from '../ChatPreview/ChatPreview'
import { useState } from 'react';
export default function SearchUser({selectedUser}){
    const[visible, setVisible] = useState(false);
    setTimeout(() => {
        setVisible(true);
    }, 10);
    const [usersFound, setUsersFound] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    SearchUser = (query) => {
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
            <div className={`search-user-pop-up ${visible ? 'visible' : ''}`}>
                <div className='search-user-body'>
                    <input placeholder="Search or start new chat" className="search-bar-pop-up" value={searchQuery} onChange={(e) => SearchUser(e.target.value)}></input>
                </div>
                {searchQuery !== '' && <div className='search-user-results'>
                    {usersFound.map(user => {
                        return(
                            <div className='search-user-result'>
                                <ChatPreview user={user} onClick={() => selectedUser(user)} key={user.username}></ChatPreview> 
                            </div>
                        )
                    })}
                </div> }
                {searchQuery !== '' && usersFound.length === 0
                && <div className='search-user-result'>
                    <p>No results found</p>
                </div>}
            </div>
        </div>
    )
}