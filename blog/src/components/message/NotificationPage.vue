<template>
    <div>
        <el-container class="notification-container">
            <!-- 在PC端显示侧边栏，在移动端显示顶部菜单 -->
            <el-aside v-if="!isMobile" width="200px" class="notification-aside">
                <el-menu style="border: none;">
                    <el-menu-item index="11" @click="toLike">点赞</el-menu-item>
                    <el-menu-item index="22" @click="toComment">回复</el-menu-item>
                    <el-menu-item index="33" @click="toSystem">系统通知</el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 移动端顶部菜单 -->
            <div v-else>
                <el-menu mode="horizontal" style="border: none;">
                    <el-menu-item index="11" @click="toLike">点赞</el-menu-item>
                    <el-menu-item index="22" @click="toComment">回复</el-menu-item>
                    <el-menu-item index="33" @click="toSystem">系统通知</el-menu-item>
                </el-menu>
            </div>

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
import { ref, onMounted, onUnmounted } from 'vue'

const userId = localStorage.getItem('userId')
const token = localStorage.getItem('jwt')
const route = useRoute()
const type = route.params.type
const notificationType = {
    Like: "like",
    Comment: 'comment',
    System: "system"
}

const isMobile = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})

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
    flex-direction: column;
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

/* 移动端样式 */
@media screen and (max-width: 768px) {
    .notification-container {
        height: calc(100vh - 60px);
    }

    .notification-scroll {
        height: calc(100vh - 60px);
        width: 100%;
        padding: 0 10px;
    }

    .mobile-menu {
        width: 100%;
        border-bottom: 1px solid var(--el-border-color);
    }

    :deep(.el-menu--horizontal) {
        justify-content: space-around;
    }

    :deep(.el-menu-item) {
        padding: 0;
    }
}
</style>