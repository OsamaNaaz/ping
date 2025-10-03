import ChatPreview from '../ChatPreview/ChatPreview'
import './Chats.css'
import ChatBox from '../ChatBox/ChatBox'
import { useState, useEffect } from 'react';
import Loading from '../Loading/Loading';
export default function Chats({onSelectChat,conversations}){
   const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
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
          {loading ? <Loading></Loading>:
            (users.map(user => (
                <ChatPreview user={user} key={user.username} onClick={() => onSelectChat(user)}></ChatPreview>
            )))
          }
        </div>
    )
}