<template>
    <div v-if="data" class="userinfo-container">
        <el-popover v-model:visible="visible" trigger="manual" placement="left-start" :width="isMobile ? 200 : 'auto'"
            popper-class="user-popover">
            <el-menu style="border: none;" class="userinfo-home-popover-menu">
                <el-menu-item index="1" @click="toUserInfo">个人页面</el-menu-item>
                <el-menu-item index="2" @click="toEditPage">编辑信息</el-menu-item>
                <el-popconfirm :hide-icon="true" title="确认注销" confirm-button-text="确认" cancel-button-text="取消"
                    @confirm="unLogin">
                    <template #reference>
                        <el-menu-item index="3">注销</el-menu-item>
                    </template>
                </el-popconfirm>
            </el-menu>
            <template #reference>
                <el-avatar :src="data.image" @click="togglePopover"></el-avatar>
            </template>
        </el-popover>
    </div>
</template>

<script setup>

import coreaxios from '@/functions/coreaxios';
import { ElMessage } from 'element-plus';
import { onMounted, ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref(null);
const visible = ref(false)
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")

// 添加移动设备检测
const isMobile = ref(window.innerWidth <= 768)

// 监听窗口大小变化
window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768
})

function unLogin() {
    localStorage.removeItem("jwt")
    localStorage.removeItem("userId")

    router.push("/login");
}
function toUserInfo() {
    visible.value = false
    router.push("/home/userInfo/" + userId)
}
function toEditPage() {
    visible.value = false
    router.push("/home/edit")
}

function getData() {
    coreaxios.post("/user/getUserProfile", null, {
        headers: {
            token: localStorage.getItem("jwt"),
        },
        params: {
            userId: localStorage.getItem("userId"),
        },
    }).then(res => {
        data.value = res.data;
        if (res.status == 403) {
            router.push("/login")
        }
    }).catch(err => {
        if (err.response.status == 401) {
            ElMessage({
                message: "账号已过期，请重新登录",
                type: "warning",
                duration: 3000
            })
            router.push("/login")
        }
    });
}

// 添加切换 Popover 的方法
const togglePopover = () => {
    visible.value = !visible.value;
}

// 添加点击外部关闭的处理
const handleClickOutside = (event) => {
    const popover = document.querySelector('.user-popover');
    if (popover && !popover.contains(event.target) && !event.target.closest('.el-avatar')) {
        visible.value = false;
    }
}

onMounted(() => {
    getData();
    document.addEventListener('click', handleClickOutside);
});

// 清理事件监听
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.userinfo-container {
    position: relative;
    display: flex;
    align-items: center;
}

.logout-item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.toolButton {
    width: 100%;
}

/* 修改移动端弹出框样式 */
:deep(.user-popover) {
    max-width: 90vw !important;
    width: auto !important;
    position: fixed !important;
    top: 50px !important;
    /* 调整为紧贴header底部 */
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin: 0;
}

:deep(.el-menu) {
    width: 100%;
    min-width: 150px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
}

:deep(.el-menu-item) {
    justify-content: center;
    padding: 0 14px;
    height: 45px;
    line-height: 45px;
    width: 100%;
    text-align: center;
}

@media screen and (max-width: 768px) {
    :deep(.user-popover) {
        position: fixed !important;
        top: 50px !important;
        right: 0 !important;
        /* 确保靠右对齐 */
        left: auto !important;
        transform: none !important;
        margin-right: 10px;
        /* 添加右侧间距 */
        width: 200px !important;
        /* 设置固定宽度 */
    }

    :deep(.el-avatar) {
        width: 32px;
        height: 32px;
    }
}
</style>