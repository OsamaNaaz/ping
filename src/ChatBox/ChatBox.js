import { use, useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import { IoPaperPlane } from "react-icons/io5";
import Message from '../Message/Message'
import Loading from '../Loading/Loading';
import io from 'socket.io-client';
import Profile from '../Profile/Profile';
import { socketJoin, socketOn } from '../socket';
const socket = io('http://localhost:9000');

export default function ChatBox({chat}){
    const [newMessage, setNewMessage] = useState('');
    const user = JSON.parse(localStorage.getItem("user"));
    const chatBodyRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typing, setTyping] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [typingMessage, setTypingMessage] = useState({
        sender: '',
        text: ''
    });
    const getChat = () =>{
        console.log('Fetching messages for conversation:', chat.conversationId);
        try{
        fetch('http://localhost:9000/getMessages',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({conversationId: chat.conversationId})
        }).then(res => res.json()).then(data => {
            setMessages(data);
            socket.emit('joinConversation', chat.conversationId);
            setLoading(false);
        })
        }catch(err){
            console.log(err);
        }
    }
    const onSendMessage = () => {
        if(newMessage.trim() === '' || !chat?.conversationId) return;
        const message = {
            "convId":chat.conversationId,
            "sender": user.username,
            "text": newMessage,
            "recipient": chat.username,
            "timestamp": new Date().toISOString()
        }
        socket.emit('test', {});
        console.log('Sending message:', message);
        socket.emit('sendMessage', message);
        setMessages([...messages, message]);
        setNewMessage('');
    }
    useEffect(() => {
        setMessages([]);
        setLoading(true);
        if (!chat?.conversationId) return;
        getChat();
        console.log('Setting up chat listeners for conversation:', chat.conversationId);
        socketJoin(chat.conversationId);
       
        socket.on('typing', (data) => {
            if(data.conversationId !== chat.conversationId) return;
            if(data.username == chat.username){
                setTypingMessage({
                    sender: data.username,
                    text: `${data.username} is typing...`
                })
                setTyping(true);
            }
            else{
                setTypingMessage({
                    sender: '',
                    text: ''
                })
                setTyping(false);
            }
        });
        socket.on('stopTyping', (data) => {
            if(data.conversationId !== chat.conversationId) return;
            if(data.participant !== user.username)
            setTyping(false);
        });
        socketOn('receiveMessage', (message) => {
            if(message.convId !== chat.conversationId) return;
            if(message.sender !== user.username)
                setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            
            // socket.off('receiveMessage');
            // socket.off('typing');
            // socket.off('stopTyping');
            // socket.emit('leaveConversation', chat.conversationId);
            setTyping(false);
            setTypingMessage({
                sender: '',
                text: ''
            });
            setMessages([]);
            setLoading(true);
        }
    },[chat?.conversationId]);
    useEffect(() => {
        if(!chat?.conversationId) return;
        if(newMessage.trim() === '' ){
            socket.emit('stopTyping', {username: user.username, conversationId: chat.conversationId});
        }
        else{
            socket.emit('typing', {username: user.username, conversationId: chat.conversationId});
        }
    },[newMessage])
    useEffect(() => {
        if(chatBodyRef.current){
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    },[messages,typing])
    return(
        <div className="chat-box">
            {showUserProfile && <Profile user={chat} closeProfile={() => setShowUserProfile(false)} allowEdit={false}></Profile>}
            {chat && <div className={`chat-container ${chat ? 'visible' : 'hidden'}`}>
           <div className="chat-header" onClick={() => setShowUserProfile(true)}>
                <img src={chat.avatarUrl} alt="User Avatar" className='user-avatar-chat-box'></img>
                <span className='user-name'>
                    {chat.name}
                </span>
            </div>
            <div className={`chat-body ${loading ? 'loading-chat': ''}`} ref={chatBodyRef}>
                {loading ? <Loading></Loading> :
                messages.map(message => <Message message={message} key={message.id}></Message>)}
                {typing && <Message message={typingMessage}></Message>}
            </div>
            <div className='chat-input'>
                <input type="text" placeholder="Type a message..." className="message-input" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        onSendMessage();
                    }
                }}></input>
                <IoPaperPlane className={`send-button ${newMessage.trim() ? 'visible' : ''}`} onClick={onSendMessage}/>
            </div>
            </div>}
            {!chat && <div className={`placeholder-container ${chat ? 'hidden' : 'visible'}`}>
                <div className='placeholder'>
                    SELECT A CHAT TO BEGIN
                </div>
            </div>}
        </div>

    )
}