import { Client } from '@stomp/stompjs';
import { ref} from 'vue';

const userId = localStorage.getItem("userId");
let stompClient = null;
const baseURL = import.meta.env.VITE_WebSocketUrl;
const token = ref(null)
token.value = localStorage.getItem("jwt");
const isConnection = ref(false);
export function fleshToken(){
    token.value = localStorage.getItem("jwt");
}
export function createWebSocket() {
    if (!stompClient) {
        // WebSocket 服务器的 URL
        const url = `${baseURL}?token=${token.value}`;

        // 创建 STOMP 客户端并配置
        stompClient = new Client({
            brokerURL: url, // 设置 STOMP 服务器的 URL
            reconnectDelay: 4000,  // 重连延迟
            heartbeatIncoming:  10000 ,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                console.log("WebSocket 连接成功！");
                isConnection.value = true;
                console.log("发送");
                    
                stompClient.publish({
                    destination: `/app/getStoreMessage/${userId}`,
                    headers: { priority: 9 },
                    body: "Hello, STOMP"
                });
                
            },
            onDisconnect: () => {
                console.log("WebSocket 连接断开！");
                isConnection.value = false;
            },
            onStompError: (error) => {
                console.error("STOMP 错误", error);
            },
        });

        // 激活 STOMP 客户端
        stompClient.activate();
    }

    return stompClient;
}

export function getWebSocket() {
    return stompClient;
}

export function getConnectionCondition() {
    return isConnection.value;
}