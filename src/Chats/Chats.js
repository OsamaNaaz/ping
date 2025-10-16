import ChatPreview from '../ChatPreview/ChatPreview'
import './Chats.css'
import ChatBox from '../ChatBox/ChatBox'
import { useState, useEffect, useRef } from 'react';
import Loading from '../Loading/Loading';
import Search from '../Search/Search';
import { createConversationApi, fetchUserInfo } from '../api';
import { currentUser } from '../utils';
import { socketEmit, socketJoin, socketOn } from '../socket';
import { set } from 'mongoose';

export default function Chats({onSelectChat,conversations}){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  useEffect(() => {
    socketJoin(currentUser()?.username);
    socketOn('recieveNotification', async (data) => {
      setLoading(true);
      console.log('Notification received:', data);
      console.log('activeChat:', activeChatRef.current);
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers?.map(user => {
              console.log(data);
                if (user.username === data.sender && activeChatRef.current?.username !== data.sender) {
                    return { ...user, hasNewMessage: true, lastMessageTime: data.time, conversationId: data.conversationId };
                }
                return user;
            });
            // if(activeChatRef.current?.username === data.sender){
            //   updatedUsers.forEach(user => {
            //     if(user.username === data.sender){
            //       user.hasNewMessage = false;
            //     }
            //   });
            // }
            return updatedUsers;
        });
        if(!users?.some(user => user.username === data.sender)){
          console.log(data);
              try{
                await fetchUserInfo(data.sender).then((user) => {
                setUsers(prev => [
                    ...prev,
                    { ...user, hasNewMessage: true, lastMessageTime: data.time, conversationId: data.conversationId }
                  ]);
              });}
              catch(err){
                console.log(err);
              }
            }
            setUsers(prev => {
              const unique = prev.filter(
                (user, index, self) =>
                  index === self.findIndex(u => u.username === user.username)
              );
              return unique;
            });
        setLoading(false);
    });
  },[]);

  const createConversation = async (searchedUser) => {
    const user = currentUser();
    if(user.username === searchedUser.username)
      return;
    if(!user || !searchedUser)
      return;
    const participants = [user.username, searchedUser.username];
    try{
      const conversation = await createConversationApi(participants);
      setUsers([...users, {...searchedUser, conversationId: conversation._id}]);
      onSelectChat({...searchedUser, conversationId: conversation._id});
    }
    catch(err){
      console.log(err);
    }
  }
  const handleClick = (user) => {
    onSelectChat(user);
    setActiveChat(user);
    console.log(user)
    user.hasNewMessage = false;
  }
  const fetchUsers = async () => {
    try{
      const usernames = conversations.map(conversation => conversation.participant);                
      const res = await fetch('http://localhost:9000/getUsers',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({usernames: usernames})
      })
        const data = await res.json();
        const usersWithConversations = data.map(user => {
          const conversation = conversations.find(conversation => conversation.participant === user.username);
          return {
            ...user,
            conversationId: conversation.id
          }
        });
        socketOn('onlineUsers', (onlineUsers) => {
            const updatedUsersWithConversations = usersWithConversations.map(user => ({...user, status: onlineUsers.includes(user.username) ? 'online' : 'offline'}));
            console.log(updatedUsersWithConversations);
            setUsers(updatedUsersWithConversations);
        });
        setUsers(usersWithConversations);
        console.log(data);
        setLoading(false);
        return data;
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
              users?.filter(user => user.username.toLowerCase().includes(searchValue.toLowerCase())).map(user => (
                <ChatPreview user={user} key={user.username} onClick={() => {handleClick(user);
                }}></ChatPreview>
            )))
          }
        </div>
    )
}