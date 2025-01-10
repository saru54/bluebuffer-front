<template>
  <el-dropdown class="contianer" trigger="click">
    <el-badge  :value="totalMessageCount" :show-zero="false">
      <el-icon size="30" color="var(--el-color-primary)"><BellFilled /></el-icon>
    </el-badge>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <el-badge :show-zero="false" :value="likeMessageCount" :max="99" class="notification-item" type="success">

            <el-button class="msgBtn" type="" @click="toCommenMessagePage(messageType.Like)">点赞</el-button>
          </el-badge>
        </el-dropdown-item>
        <el-dropdown-item class="btnContainer">
          <el-badge :show-zero="false" :value="commentMessageCount" :max="99" class="notification-item" type="info">

            <el-button class="msgBtn" type="" @click="toCommenMessagePage(messageType.Comment)">回复</el-button>
          </el-badge>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-badge :show-zero="false" :value="subscribeMessageCount" :max="99" class="notification-item"
            type="warning">

            <el-button class="msgBtn" type="" @click="toCommenMessagePage(messageType.Subsribe)">关注</el-button>
          </el-badge>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-badge :show-zero="false" :value="privateMessageCount" :max="99" class="notification-item" type="danger">

            <el-button class="msgBtn" type="" @click="toPrivateMessagePage">私信</el-button>
          </el-badge>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<script setup>


import { createWebSocket, getWebSocket } from '@/functions/websocket';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';

const contacts = ref([])

const userId = localStorage.getItem("userId")
const privateMessageCount = ref(0)
const commentMessageCount = ref(0)
const subscribeMessageCount = ref(0)
const likeMessageCount = ref(0)
const router = useRouter()
const totalMessageCount = ref(0)
const messageType = { Comment: "Comment", Like: "Like", Subsribe: "Subscribe", PrivateMessage: "PrivateMessage" }

function Message(sender, content, createTime) {
  this.sender = sender;
  this.content = content;

  this.createTime = createTime;

}

function initWebSocket() {
  let socket = null
  if (getWebSocket() == null) {
    socket = createWebSocket();

  } else {
    socket = getWebSocket()
  }
  socket.onopen = () => {
    console.log("连接已建立");
  };

  socket.onmessage = (event) => {
    console.log("收到消息: ", event.data);
    const data = JSON.parse(event.data)
    saveAndUpdateMessageCount(data.type)
    if (data.type == messageType.PrivateMessage) {


      insertToContacts(data)
    }

  };

  socket.onclose = () => {
    console.log("连接已关闭");
  };

  socket.onerror = (error) => {
    console.error("WebSocket 错误: ", error);
  };

}
function toPrivateMessagePage() {
  localStorage.setItem(`${userId}-${messageType.PrivateMessage}--NotReadCount`, 0);
  privateMessageCount.value = 0
  totalMessageCount.value -= privateMessageCount.value;
  const url = router.resolve({ path: `/privateMessagePage` }).href
  window.open(url, '_blank')

}
function toCommenMessagePage(type) {
  switch (type) {
    case messageType.Comment:
      commentMessageCount.value = 0;
      totalMessageCount.value -= commentMessageCount.value;
      localStorage.setItem(`${userId}-${messageType.Comment}--NotReadCount`, 0);
      window.open(router.resolve({ path: '/commonMessagePage/2' }).href, '_blank')
      break;
    case messageType.Like:
      likeMessageCount.value = 0
      totalMessageCount.value -= likeMessageCount.value;
      localStorage.setItem(`${userId}-${messageType.Like}--NotReadCount`, 0);

      window.open(router.resolve({ path: '/commonMessagePage/0' }).href, '_blank')
      break;
    case messageType.Subsribe:
      subscribeMessageCount.value = 0
      totalMessageCount.value -= subscribeMessageCount.value;
      localStorage.setItem(`${userId}-${messageType.Subsribe}--NotReadCount`, 0);
      window.open(router.resolve({ path: '/commonMessagePage/3' }).href, '_blank')
      break;
  }
}
function saveAndUpdateMessageCount(type) {
  switch (type) {
    case messageType.Comment:
      commentMessageCount.value++;
      totalMessageCount.value++;
      localStorage.setItem(`${userId}-${messageType.Comment}--NotReadCount`, commentMessageCount.value);
      break;
    case messageType.Like:
      likeMessageCount.value++;
      totalMessageCount.value++;
      localStorage.setItem(`${userId}-${messageType.Like}--NotReadCount`, likeMessageCount.value);
      break;
    case messageType.Subsribe:
      subscribeMessageCount.value++;
      totalMessageCount.value++;
      localStorage.setItem(`${userId}-${messageType.Subsribe}--NotReadCount`, subscribeMessageCount.value);
      break;
    case messageType.PrivateMessage:
      privateMessageCount.value++;
      totalMessageCount.value++;
      localStorage.setItem(`${userId}-${messageType.PrivateMessage}--NotReadCount`, privateMessageCount.value);
      break;
  }
}


// 保存消息到本地存储
function saveMessage() {

  localStorage.setItem(userId + "-" + "PrivateMessage", JSON.stringify(contacts.value))
}
// 插入消息到联系人列表
function insertToContacts(data) {
  const { senderId, senderName, content, createTime } = data;


  let contact = contacts.value.find(c => c.id == senderId);
  if (contact) {
    contact.messages.push(new Message(senderName, content, createTime));
  } else {
    contacts.value.push({ id: senderId, name: senderName, messages: [new Message(senderName, content, createTime)] });
  }
  saveMessage();
}
function getMessageData() {
  commentMessageCount.value = parseInt(localStorage.getItem(`${userId}-${messageType.Comment}--NotReadCount`)) || 0;
  likeMessageCount.value = parseInt(localStorage.getItem(`${userId}-${messageType.Like}--NotReadCount`)) || 0;
  subscribeMessageCount.value = parseInt(localStorage.getItem(`${userId}-${messageType.Subsribe}--NotReadCount`)) || 0;
  privateMessageCount.value = parseInt(localStorage.getItem(`${userId}-${messageType.PrivateMessage}--NotReadCount`)) || 0;
  contacts.value = JSON.parse(localStorage.getItem(userId + "-" + "PrivateMessage")) || [];
  totalMessageCount.value = commentMessageCount.value + likeMessageCount.value + subscribeMessageCount.value + privateMessageCount.value;



}
onMounted(() => {
  getMessageData()
  initWebSocket()
})
</script>

<style scoped>
.msgBtn {
  width: 100%;
}

.notification-item {
  width: 100%;
}
</style>