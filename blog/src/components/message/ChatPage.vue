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
                <el-header>
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
    padding: 10px;
}

.message-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;


}

.message-container::-webkit-scrollbar,
.contact-scroll::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: transparent;

}

.contact-scroll:hover::-webkit-scrollbar,
.message-container:hover::-webkit-scrollbar {
    display: block;
    background: transparent;

}

.contact-scroll::-webkit-scrollbar-thumb,
.message-container::-webkit-scrollbar-thumb {
    background-color: #ccc;

}

.contact-scroll::-webkit-scrollbar-button,
.message-container::-webkit-scrollbar-button {
    display: none;
}

.sendMessage {
    text-align: right;
    border-color: rgb(50.8, 116.6, 184.5);
}

.receiveMessage {
    text-align: left;
}

.chattools {
    text-align: right;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--el-border-color);
    margin-top: 10px;
    margin-bottom: 5px;
}

el-footer {
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}

/* 添加移动端适配样式 */
@media screen and (max-width: 768px) {
    .contact-list {
        height: 100vh;

        .chatHeader {
            font-size: 14px;
            margin: 5px 0;
        }
    }

    .contact-scroll {
        height: calc(100vh - 30px);
    }

    .message-container {
        height: calc(100vh - 120px);
    }

    .message-item {
        padding: 8px;
        margin-bottom: 8px;
    }

    el-footer {
        padding: 5px;
    }

    :deep(.el-menu-item) {
        padding: 0 10px;
    }
}
</style>
