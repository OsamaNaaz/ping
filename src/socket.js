import { io } from "socket.io-client";
const socket = io('http://localhost:9000',{
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnection: true
});
export function socketJoin(room){
    if(!room) return;
    socket.emit('joinRoom', room);
}
export function socketEmit(event, optional){
    console.log("Emitting event:", event, optional);
    socket.emit(event, optional);
}
export function socketOn(event, callback){
    socket.on(event, callback);
}
export function socketConnect(){
    if(!socket.connected){
        socket.connect();
    }
}
export function socketDisconnect(){
    if(socket.connected){
        socket.disconnect();
    }
}
export function socketId() { return socket.id}