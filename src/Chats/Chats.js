import ChatPreview from '../ChatPreview/ChatPreview'
import './Chats.css'
import ChatBox from '../ChatBox/ChatBox'
import { useState, useEffect } from 'react';
import Loading from '../Loading/Loading';
import Search from '../Search/Search';
import { createConversationApi } from '../api';
import { currentUser } from '../utils';
export default function Chats({onSelectChat,newChat,conversations}){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const createConversation = async (searchedUser) => {
    const user = currentUser();
    if(user.username === searchedUser.username)
      return;
    if(!user || !searchedUser)
      return;
    const participants = [user.username, searchedUser.username];
    try{
      const conversation = await createConversationApi(participants);
                console.log(conversation);

      onSelectChat({...searchedUser, conversationId: conversation._id});
    }
    catch(err){
      console.log(err);
    }
  }
        
  const fetchUsers = async () => {
    try{
      const usernames = conversations.map(conversation => conversation.participant);                
      fetch('http://localhost:9000/getUsers',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({usernames: usernames})
      }).then(async res => {
        const data = await res.json();
        const usersWithConversations = data.map(user => {
          const conversation = conversations.find(conversation => conversation.participant === user.username);
          console.log(conversation);
          return {
            ...user,
            conversationId: conversation.id
          }
        });
        setUsers(usersWithConversations);
        setLoading(false);
      });
    }
    catch(err){
      console.log(err);
    }
  }
    useEffect(() => {
        fetchUsers();
    },[]);

    return(
        <div className="chats">
          <Search onSearch={setSearchValue} selectedUser={createConversation}></Search>
          {loading ? <Loading></Loading>:
            (
              users.filter(user => user.username.toLowerCase().includes(searchValue.toLowerCase())).map(user => (
                <ChatPreview user={user} key={user.username} onClick={() => onSelectChat(user)}></ChatPreview>
            )))
          }
        </div>
    )
}