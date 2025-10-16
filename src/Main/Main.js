import ChatBox from "../ChatBox/ChatBox";
import Chats from "../Chats/Chats";
import Loading from "../Loading/Loading";
import './Main.css';
import { useEffect, useState } from "react";
import { getConversations } from "../api";
import { currentUser } from "../utils";
import { socketEmit, socketOn } from "../socket";


export default function Main(){
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    
    useEffect(() => {   
        const fetchConversations = async () => {
            const data = await getConversations(currentUser());
            console.log(data);
            setConversations(data);
            setLoading(false);
        }
        console.log('Setting up socket listeners');
        socketOn('newConversation', (conversationId) => {
        console.log('New conversation created with ID:', conversationId);
          fetchConversations();
        });
        fetchConversations();
    },[]);
    const newChat = (conversation) => {
        conversations.push(conversation);
        console.log(conversations)
        setActiveChat(conversation);
    }

    return(
        <div className="main">
            {loading ? (
            <Loading></Loading>
            ) :  (
            <>
                <Chats conversations={conversations} onSelectChat={setActiveChat} activeChat={activeChat}/>
                <ChatBox chat={activeChat} />
            </>
            )}
        </div>
)
}