import ChatBox from "../ChatBox/ChatBox";
import Chats from "../Chats/Chats";
import Loading from "../Loading/Loading";
import './Main.css';
import { useEffect, useState } from "react";
import { getConversations } from "../api";
import { currentUser } from "../utils";

export default function Main(){
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        const fetchConversations = async () => {
            const data = await getConversations(currentUser());
            setConversations(data);
            setLoading(false);
        }
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
                <Chats conversations={conversations} onSelectChat={setActiveChat} newChat={newChat}/>
                <ChatBox chat={activeChat} />
            </>
            )}
        </div>
)
}