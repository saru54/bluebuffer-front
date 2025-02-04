<template>
    <div>
        <el-container class="notification-container">
            <el-aside width="200px" class="notification-aside">
                <el-menu style="border: none;">
                    <el-menu-item index="11" @click="toLike">点赞</el-menu-item>
                    <el-menu-item index="22" @click="toComment">回复</el-menu-item>
                    <el-menu-item index="33" @click="toSystem">系统通知</el-menu-item>
                </el-menu>

            </el-aside>
            <el-container class="notification-scroll">
                <div v-if="type == notificationType.Like" style="width: 90%;">

                    <LikeNotification></LikeNotification>
                </div>
                <div v-if="type == notificationType.Comment" style="width: 90%;">
                    <CommentNotification></CommentNotification>
                </div>

                <div v-if="type == notificationType.System">
                    sys
                </div>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import router from '@/routers/router';
import { useRoute } from 'vue-router';
import LikeNotification from './LikeNotification.vue';
import CommentNotification from './CommentNotification.vue';
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('jwt')
const route = useRoute()
const type = route.params.type
const notificationType = {
    Like: "like",
    Comment: 'comment',
    System: "system"
}
function toComment() {
    router.push("/home/notification/comment")
}
function toLike() {
    router.push("/home/notification/like")
}
function toSystem() {
    router.push("/home/notification/system")
}
</script>
<style scoped>
.notification-container {
    height: 90vh;
    width: 100%;

}

.notification-scroll {
    overflow-y: scroll;
    height: 90vh;
    width: 100%;
}

.notification-aside {
    height: 90vh;
    border-right: 1px solid var(--el-border-color);
}

.notification-scroll::-webkit-scrollbar {
    width: 8px;
}

.notification-scroll::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
}

.notification-scroll:hover::-webkit-scrollbar-thumb {
    background: #888;
}
</style>