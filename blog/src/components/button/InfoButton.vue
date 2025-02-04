<template>
    <div>
        <el-popover :visible="visible" placement="bottom">

            <el-menu class="info-menu">

                <el-menu-item class="info-item" index="1" @click="toNotificationPageWithLike">
                    <el-badge :value="likeCount" :show-zero="false" :offset="[5, 10]">
                        点赞
                    </el-badge>
                </el-menu-item>
                <el-menu-item index="2" @click="toNotificationPageWithComment">
                    <el-badge :value="commentCount" :show-zero="false" :offset="[5, 10]">
                        回复
                    </el-badge>
                </el-menu-item>
                <el-menu-item index="3" @click="toNotificationPageWithSystem">
                    <el-badge :value="systemCount" :show-zero="false" :offset="[5, 10]">
                        系统通知
                    </el-badge>
                </el-menu-item>
            </el-menu>

            <el-button style="width: 100%; margin-top: 15px;" round @click="toNotificationPage">显示更多</el-button>
            <template #reference>
                <el-badge :value="totalCount" :max="99" :show-zero="false" :offset="[0, 10]">
                    <el-button circle @click="show">
                        <el-icon>
                            <Bell />
                        </el-icon>
                    </el-button>
                </el-badge>
            </template>
        </el-popover>
    </div>
</template>
<script setup>
// import { infoCountStore } from '@/functions/badge';
import { createWebSocket, getConnectionCondition, getWebSocket } from '@/functions/websocket';
import router from '@/routers/router';
import { computed, onMounted, ref, watch } from 'vue';
const visible = ref(false)
const userId = localStorage.getItem("userId")
function show() {
    visible.value = !visible.value
    // infoCountStore.clear()
}
function toNotificationPage() {

}
const MessageType = {
    Like: "Like" + userId,
    Comment: "Comment" + userId,
    System: "System" + userId
}


let client = null;

function toNotificationPageWithLike() {
    router.push("/home/notification/like")
    visible.value = false
    likeCount.value = 0
    save()

}
function toNotificationPageWithComment() {
    router.push("/home/notification/comment")
    visible.value = false
    commentCount.value = 0
    save()
}
function toNotificationPageWithSystem() {

    router.push("/home/notification/system")
    visible.value = false
    systemCount.value = 0
    save()
}
const likeCount = ref(0)
const commentCount = ref(0)
const systemCount = ref(0)
const totalCount = computed(() => parseInt(likeCount.value) + parseInt(commentCount.value) + parseInt(systemCount.value))

function initWebSocket() {

    if (getWebSocket() == null) {
        client = createWebSocket();
    } else {
        client = getWebSocket();
    }

    watch(() => getConnectionCondition(), () => {
        if (getConnectionCondition()) {
            console.log("Notification WebSocket 已连接，开始订阅");

            client.subscribe(`/user/${userId}/notification/like`, (message) => {
                likeCount.value++
                save()
                console.log("接收到消息-" + message.body);
            });

            client.subscribe(`/user/${userId}/notification/comment`, (message) => {
                commentCount.value++
                save()
                console.log("接收到评论消息-" + message.body);
            });

            client.subscribe(`/user/${userId}/notification/system`, (message) => {
                systemCount.value++
                save()
                console.log("接收到系统通知-" + message.body);
            });
        }
    });

}
function initUnreadMessage() {
    likeCount.value = parseInt(localStorage.getItem(MessageType.Like)) || 0
    commentCount.value = parseInt(localStorage.getItem(MessageType.Comment)) || 0
    systemCount.value = parseInt(localStorage.getItem(MessageType.System)) || 0
}
function save() {
    localStorage.setItem(MessageType.Like, likeCount.value)
    localStorage.setItem(MessageType.Comment, commentCount.value)
    localStorage.setItem(MessageType.System, systemCount.value)
}
onMounted(() => {
    initWebSocket()
    initUnreadMessage()
})
</script>
<style scoped>
.info-item {}

.info-menu {
    border: none;
}
</style>