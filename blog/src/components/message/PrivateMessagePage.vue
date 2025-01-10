<template>
    <div class="container">
        <div class="chat-container">
            <!-- 左侧联系人列表 -->
            <el-menu class="contact-list" @select="handleSelectContact">
                <el-menu-item v-for="contact in contacts" :key="contact.id" :index="contact.id">
                    <span>{{ contact.name }}</span>
                </el-menu-item>
            </el-menu>

            <!-- 右侧聊天窗口 -->
            <div v-if="selectedContact" class="chat-window">
                <div class="chat-header">
                    <h3>{{ selectedContact.name }}</h3>
                </div>

                <!-- 聊天消息区域 -->
                <div class="chat-messages" ref="chatMessages">
                    <div v-for="(message, index) in selectedContact.messages" :key="index"
                        :class="{ 'sent': message.sender === 'me', 'received': message.sender !== 'me' }"
                        class="chat-message">
                        <div class="message-bubble"
                            :class="{ 'sent-bubble': message.sender === 'me', 'received-bubble': message.sender !== 'me' }">
                            <p>{{ message.content }}</p>
                        </div>
                        <!-- 显示消息时间 -->
                        <div class="message-time">
                            <CreateTime :time="message.createTime"></CreateTime>
                        </div>
                    </div>
                </div>

                <!-- 输入框 -->
                <div class="chat-input">
                    <el-input v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" clearable>
                        <template #suffix>
                            <el-button type="primary" @click="sendMessage"
                                :disabled="!newMessage.trim()">Send</el-button>
                        </template>
                    </el-input>
                </div>
            </div>
        </div>
    </div>

</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMenu, ElMenuItem, ElInput, ElButton, dayjs } from 'element-plus'

import { useRoute } from 'vue-router';
import CreateTime from '../time/CreateTime.vue';
import { createWebSocket, getWebSocket } from '@/functions/websocket';
import axiosInstance from '@/functions/axios';
const route = useRoute()
const userId = route.params.userId;
const userName = route.params.userName;

// 模拟联系人列表
const contacts = ref([])
const selectUserId = ref(null)
const selectedContact = ref(null) // 当前选中的聊天联系人
const newMessage = ref('') // 输入框的消息内容
const token = localStorage.getItem("jwt")
const userSelfId = localStorage.getItem("userId")

// 选择联系人
const handleSelectContact = (contactId) => {
    selectedContact.value = contacts.value.find(contact => contact.id === contactId)

    selectUserId.value = contactId
    console.log(contactId);
    nextTick(() => {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// 发送消息
const sendMessage = () => {
    if (newMessage.value.trim()) {
        const messageContent = newMessage.value.trim();
        selectedContact.value.messages.push(new Message('me',
            messageContent, getCreateTime()));
        newMessage.value = ''; // 清空输入框
        saveMessage()
        const data = {
            receiverId: selectUserId.value,
            content: messageContent,
            createTime: getCreateTime()
        };
        console.log(data);

        axiosInstance.post("/message/send", data, {
            headers: {
                token: token
            }
        }).then(() => {
            console.log("消息发送成功");
        }).catch(error => {
            console.error("消息发送失败", error);
        });

        // 等待 DOM 更新后滚动到底部
        nextTick(() => {
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
}
function Message(sender, content, createTime) {
    this.sender = sender;
    this.content = content;

    this.createTime = createTime;



}
function getCreateTime() {
    return dayjs().format('YYYY-MM-DDTHH:mm:ss')
}
// WebSocket连接
// function connectWebSocket() {
//     const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

//     socket.onopen = () => {
//         console.log("连接已建立");
//     };

//     socket.onmessage = (event) => {
//         console.log("收到消息: ", event.data);
//         insertToContacts(event.data)
//     };

//     socket.onclose = () => {
//         console.log("连接已关闭");
//     };

//     socket.onerror = (error) => {
//         console.error("WebSocket 错误: ", error);
//     };
// }
function initWebSocket() {
    let socket = null
    if (getWebSocket() == null) {
        socket = createWebSocket()
    } else {
        socket = getWebSocket()
    }
    socket.onopen = () => {
        console.log("连接已建立");
    };

    socket.onmessage = (event) => {
        console.log("收到消息: ", event.data);
        insertToContacts(event.data)
    };

    socket.onclose = () => {
        console.log("连接已关闭");
    };

    socket.onerror = (error) => {
        console.error("WebSocket 错误: ", error);
    };
}
// 插入消息到联系人列表
function insertToContacts(data) {
    const parsedData = JSON.parse(data);
    const { senderId, senderName, content, createTime } = parsedData;


    let contact = contacts.value.find(c => c.id == senderId);
    if (contact) {
        contact.messages.push(new Message(senderName, content, createTime));
    } else {
        contacts.value.push({ id: senderId, name: senderName, messages: [new Message(senderName, content, createTime)] });
    }
    saveMessage();
}

// 保存消息到本地存储
function saveMessage() {
    localStorage.setItem(userSelfId + "-" + "PrivateMessage", JSON.stringify(contacts.value))
}

// 初始化联系人列表和历史消息
function initMessage() {
    const storedContacts = localStorage.getItem(userSelfId + "-" + "PrivateMessage");
    contacts.value = storedContacts ? JSON.parse(storedContacts) : [];

    if (userId && userName) {
        const existingContact = contacts.value.find(c => c.id == userId);
        if (!existingContact) {
            contacts.value.push({ id: userId, name: userName, messages: [] });
        }
        selectUserId.value = userId;
    }

}

onMounted(() => {
    initMessage();
    // connectWebSocket();
    initWebSocket()
});
</script>

<style scoped>
/* 全屏显示的主容器 */
.chat-container {
    display: flex;
    width: 80vw;
    height: 80vh;
    overflow: hidden;
    margin: auto, auto;
}

/* 左侧联系人列表 */
.contact-list {
    width: 250px;
    border-right: 1px solid #ddd;
    padding: 10px;
    background-color: #fafafa;
    height: 100%;
    overflow-y: auto;
}

/* 单个联系人项 */
.el-menu-item {
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    font-size: 14px;
    background-color: #fff;
    transition: background-color 0.3s ease;
}

.el-menu-item:hover {
    background-color: #e0f7fa;
}

.el-menu-item.is-active {
    background-color: #46948b;
    color: #fff;
}

/* 右侧聊天窗口 */
.chat-window {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
}

/* 聊天头部 */
.chat-header {
    background-color: #f7f7f7;
    padding: 10px;
    margin-bottom: 10px;
}

/* 聊天消息区域 */
.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 10px;
}

/* 聊天气泡样式 */
.chat-message {
    margin: 0 15px;
    display: inline-block;
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;
}

.sent {
    background-color: #e0f7fa;
    color: #00796b;
    align-self: flex-end;
    border-top-right-radius: 0;
}

.received {
    background-color: #f1f1f1;
    color: #333;
    align-self: flex-start;
    border-top-left-radius: 0;
}

/* 输入框样式 */
.chat-input {
    padding-top: 10px;
}

.el-input__inner {
    padding: 8px;
    font-size: 14px;
    background-color: #fafafa;
    border: 1px solid #ddd;
    border-radius: 8px;
}

/* 聊天气泡下方的时间 */
.message-time {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
    text-align: right;
}

.container {
    width: 80%;
    margin: 30px auto;
}
</style>
