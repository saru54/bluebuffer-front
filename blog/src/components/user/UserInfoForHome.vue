<template>
    <div v-if="data != null" class="container">
        <el-dropdown :hide-on-click="false" @visible-change="handleDropdownVisibility" trigger="click">
            <el-avatar size="default" :src="data.image"></el-avatar>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>
                        <el-text type="info" size="large" @click="toUserInfo">用户名:{{ data.name }}</el-text>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button type="info" @click="toChangeInfoPage" class="toolButton">修改个人信息</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item class="logout-item">
                        <el-button type="danger" @click="confirmUnLogin" class="toolButton">注销</el-button>
                        <el-dialog v-model="showLogoutConfirm" title="确认注销">
                            <span>确定要注销吗？</span>
                            <template v-slot:footer>
                                <span>
                                    <el-button @click="showLogoutConfirm = false">取消</el-button>
                                    <el-button type="danger" @click="unLogin">确定</el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>

import axiosInstance from '@/functions/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref(null);
const showLogoutConfirm = ref(false);

function unLogin() {
    localStorage.setItem("jwt", null);
    localStorage.setItem("userId", null);
    router.push("/loginPage");
}
function toUserInfo() {
    const url = router.resolve({ path: `/userInfo/${localStorage.getItem("userId")}` }).href
    window.open(url, '_blank')
}
function handleDropdownVisibility(isVisible) {
    if (!isVisible) {
        document.activeElement?.blur(); // 移除焦点
    }
}

function confirmUnLogin() {
    showLogoutConfirm.value = true;
}

function toChangeInfoPage() {
    const url = router.resolve({ path: `/userEdit` }).href;
    window.open(url, '_blank');
}

function getData() {
    axiosInstance.get("/user/getUserInfo", {
        headers: {
            token: localStorage.getItem("jwt"),
        },
        params: {
            userId: localStorage.getItem("userId"),
        },
    }).then(res => {
        data.value = res.data.record;

    });
}

onMounted(() => {
    getData();
});
</script>

<style scoped>
.container {
    z-index: 100;
}

/* 在el-dropdown-item内，给注销按钮的父容器添加 flexbox */
.logout-item {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 确保按钮宽度适应 */
.toolButton {
    width: 100%;
}
</style>
