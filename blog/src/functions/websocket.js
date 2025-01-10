let socket = null;
const baseURL =  import.meta.env.VITE_WebSocketUrl;
export function createWebSocket(){
        if(socket==null){
        const token = localStorage.getItem("jwt")
        socket = new WebSocket(`${baseURL}?token=${token}`);
        }

        return socket;

}
export function getWebSocket(){
    return socket;
}
