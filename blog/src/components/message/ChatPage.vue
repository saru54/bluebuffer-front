<template>
    <div :class="['slide', { 'active': visible }]">
        <el-container>
            <el-aside :width="isMobile ? '100px' : '200px'" class="contact-list">
                <span class="chatHeader">联系人</span>
                <el-menu class="contact-scroll">
                    <el-menu-item v-for="contact in contacts" :key="contact.senderId" :index="contact.senderId"
                        @click="handleSelectContact(contact.senderId)">
                        <UserLink :user-id="contact.senderId" :username="contact.senderName"></UserLink>
                    </el-menu-item>
                </el-menu>

            </el-aside>
            <el-container>
                <el-header style="display: flex; justify-content: right; align-items: center;">
                    <div class="chattools">
                        <el-button @click="clearMessageHistory"><el-icon>
                                <Delete />
                            </el-icon></el-button>
                        <el-button @click="closePage">
                            <el-icon>
                                <Close />
                            </el-icon>
                        </el-button>
                    </div>
                </el-header>
                <el-main class="message-container">
                    <div v-if="selectContact != null">
                        <div v-for="message in selectContact.message" :key="message.id" class="message-item"
                            :class="{ 'sendMessage': message.type === MessageType.Self, 'receiveMessage': message.type !== MessageType.Self }">
                            <p>{{ message.content }}</p>
                            <div>
                                <CreateTime :time="message.sendTime"></CreateTime>
                            </div>
                        </div>

                    </div>
                    <div v-if="selectContact == null" style="display: flex; justify-content: center;">
                        <el-text type="info" size="large">请选择联系人</el-text>
                    </div>
                </el-main>
                <el-footer v-if="selectContact != null"
                    style="display: flex; justify-content: center; align-items: center;">
                    <el-input v-model="messageInput" placeholder="发送消息" @keyup.enter="sendMessage"></el-input>
                    <el-button @click="sendMessage">发送</el-button>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch, computed } from 'vue';
import messageaxios from '@/functions/messageaxios';
import UserLink from '../user/UserLink.vue';
import { createWebSocket, getConnectionCondition, getWebSocket } from '@/functions/websocket';

import CreateTime from '../time/CreateTime.vue';
import { dayjs } from 'element-plus';
import { chatModelStore } from '@/functions/chat';
import { messageCountStore } from '@/functions/badge';
import { useWindowSize } from '@vueuse/core';

const selectContact = ref(null);
const messageInput = ref("");
const userId = localStorage.getItem("userId")
const { visible } = defineProps(["visible"]);
const token = localStorage.getItem("jwt")
const data = ref(null)
const { width } = useWindowSize();
const isMobile = computed(() => width.value <= 768);
function closePage() {
    chatModelStore.toggle()
}
class Contact {
    constructor(senderId, senderImage, senderName, message) {
        this.senderId = senderId
        this.senderImage = senderImage
        this.senderName = senderName
        this.message = message != null ? message : []
    }
}
class Message {
    constructor(id, content, sendTime, type) {
        this.id = id
        this.content = content
        this.sendTime = sendTime
        this.type = type
    }
}
const MessageType = {
    Self: "Self",
    Other: "Other"
}
const contacts = ref([
    // {
    //     senderId: "1",
    //     senderImage: "https://example.com/image1.png",
    //     senderName: "Alice",
    //     message: [{
    //         id: "asdasdasdasd",
    //         content: "hello",
    //         sendTime: "2025-01-01T12:00:00",
    //         type: null
    //     },
    //     {
    //         id: "asdasdasdasd",
    //         content: "hello",
    //         sendTime: "2025-01-01T12:00:00",
    //         type: "me"
    //     }, {
    //         id: "asdasdasdasd",
    //         content: "hello",
    //         sendTime: "2025-01-01T12:00:00",
    //         type: "me"
    //     }]
    // }
]);

watch(() => chatModelStore.visible, () => {
    if (chatModelStore.visible == true) {
        if (chatModelStore.data == null) {
            return;
        }

        data.value = chatModelStore.data
        if (data.value.id != userId) {
            for (var e of contacts.value) {
                if (e.senderId == data.value.id) {
                    return;
                }
            }

            contacts.value.push(new Contact(data.value.id, data.value.image, data.value.name, []))
            chatModelStore.clear()
            saveMesssageHistory()
        }
    }

})
function saveMesssageHistory() {

    const temp = contacts.value.filter(e => e.message.length > 0)
    localStorage.setItem(userId + "-" + "messsage", JSON.stringify(temp))
    console.log(contacts.value);
}
function initMesssage() {
    contacts.value = JSON.parse(localStorage.getItem(userId + "-" + "messsage")) || []
}


let client;
function initWebSocket() {

    if (getWebSocket() == null) {
        client = createWebSocket();
    } else {
        client = getWebSocket();
    }

    watch(() => getConnectionCondition(), () => {
        if (getConnectionCondition()) {
            console.log("Chat WebSocket 已连接，开始订阅");

            client.subscribe(`/user/${userId}/message`, (message) => {
                messageCountStore.add()
                insertToContactsOnReceiving(JSON.parse(message.body))
                console.log("接收到消息-" + message.body);
            });


        }
    });

}
function handleSelectContact(senderId) {

    selectContact.value = contacts.value.find(e => e.senderId == senderId);
}

function clearMessageHistory() {
    for (var c of contacts.value) {
        if (c.senderId == selectContact.value.senderId) {
            c.message = []
        }
    }
    saveMesssageHistory()
}
function insertToContactsOnReceiving(data) {
    for (var c of contacts.value) {
        if (c.senderId == data.senderId) {
            c.message.push(new Message(data.id, data.content, data.sendTime, MessageType.Other))

            saveMesssageHistory()


            return;
        }
    }



    contacts.value.push(
        new Contact(data.senderId, data.senderImage, data.senderName, [new Message(data.id, data.content, data.sendTime, MessageType.Other)])
    );


    saveMesssageHistory()

}
function getCreateTime() {
    return dayjs().format('YYYY-MM-DDTHH:mm:ss')
}
function insertToContactsOnSending(data) {
    for (var c of contacts.value) {
        if (c.senderId == data.receiverId) {
            c.message.push(new Message(data.id, data.content, data.sendTime, MessageType.Self));
        }
    }
    saveMesssageHistory()

}
function sendMessage() {
    if (messageInput.value.trim() === "") return;

    const data = {
        senderId: userId,
        receiverId: selectContact.value.senderId,
        content: messageInput.value,
        sendTime: getCreateTime()
    };
    console.log(data);

    messageaxios.post("/message/send", data, {
        headers: {
            token: token
        }
    }).then((res) => {
        if (res.status == 200) {
            insertToContactsOnSending(data)
        }


    })

    // 清空输入框
    messageInput.value = "";


    nextTick(() => {
        const chatMessages = document.querySelector('.message-container');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

onMounted(() => {
    initWebSocket();
    initMesssage();

});
</script>

<style scoped>
.slide {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 100%;
    max-width: 600px;
    background-color: var(--el-bg-color);
    transition: transform 0.3s ease, left 0.3s ease;
    z-index: 1000;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--el-border-color);
}

.slide.active {
    left: 0;
}

.chatHeader {
    display: flex;
    text-align: center;
    justify-content: center;
    margin-bottom: 10px;
    margin-top: 10px;
}

/* Contact List Styling */
.contact-list {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    border-right: 1px solid var(--el-border-color);
}

.contact-scroll {
    height: calc(100vh - 40px);
    overflow-y: auto;
    overflow-x: hidden;
}

/* Message Container Styling */
.message-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 150px);
    overflow-y: auto;
    padding: 20px;
    background-color: var(--el-bg-color-page);
}

.message-item {
    margin-bottom: 15px;
    max-width: 80%;
    position: relative;
    animation: fadeIn 0.3s ease;
}

.message-item p {
    margin: 0;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
}

.sendMessage {
    margin-left: auto;
}

.sendMessage p {
    background-color: var(--el-color-primary);
    color: white;
    border-bottom-right-radius: 4px;
}

.receiveMessage p {
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-bottom-left-radius: 4px;
}

.message-item div {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-top: 4px;
}

.sendMessage div {
    text-align: right;
}

.receiveMessage div {
    text-align: left;
}

.chattools {
    display: flex;
    justify-content: right;
    align-items: center;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
    .message-container {
        padding: 10px;
        height: calc(100vh - 120px);
    }

    .message-item {
        max-width: 90%;
        margin-bottom: 12px;
    }

    .message-item p {
        padding: 10px 14px;
        font-size: 13px;
    }

    .contact-list {
        width: 100px !important;
    }

    .contact-scroll {
        height: calc(100vh - 30px);
    }

    .chatHeader {
        font-size: 14px;
        padding: 8px 0;
    }

    :deep(.el-menu-item) {
        padding: 0 8px;
        height: 40px;
        line-height: 40px;
    }

    .chattools {
        padding: 5px;

    }

    el-footer {
        padding: 8px;
    }

    :deep(.el-input) {
        width: calc(100% - 60px);
    }
}

/* 滚动条样式优化 */
.message-container::-webkit-scrollbar,
.contact-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.message-container::-webkit-scrollbar-thumb,
.contact-scroll::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color);
    border-radius: 3px;
}

.message-container::-webkit-scrollbar-track,
.contact-scroll::-webkit-scrollbar-track {
    background-color: transparent;
}

/* 联系人列表样式优化 */
.contact-list {
    background-color: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color);
}

.chatHeader {
    font-size: 16px;
    font-weight: 500;
    padding: 15px 0;
    border-bottom: 1px solid var(--el-border-color);
}

:deep(.el-menu-item) {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
}

:deep(.el-menu-item.is-active) {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

/* 底部输入框样式 */
el-footer {
    padding: 10px 15px;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    display: flex;
    gap: 10px;
    align-items: center;
}

:deep(.el-input__wrapper) {
    box-shadow: none;
    border: 1px solid var(--el-border-color);
}

:deep(.el-input__wrapper:hover) {
    border-color: var(--el-color-primary);
}
</style>
