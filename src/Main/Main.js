import ChatBox from "../ChatBox/ChatBox";
import Chats from "../Chats/Chats";
import Loading from "../Loading/Loading";
import './Main.css';
import { useEffect, useState } from "react";

export default function Main(){
    const [activeChat, setActiveChat] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        getConversations();
    },[]);
    const getConversations = async () => {
        try{
            const response = await fetch('http://localhost:9000/getConversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: user.username})
            }).then(res => res.json());
            setConversations(response);
            setLoading(false);
        }
        catch(err){
            console.log(err);
        }
    }
    return(
        <div className="main">
            {loading ? (
            <Loading></Loading>
            ) :  (
            <>
                <Chats conversations={conversations} onSelectChat={setActiveChat} />
                <ChatBox chat={activeChat} />
            </>
            )}
        </div>
)
}