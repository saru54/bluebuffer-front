<template>
    <div @click="visible = true" v-if="data" style="display: flex; align-items: center; cursor: pointer; ">

        <el-popover :visible="visible" trigger="click" :auto-close="3000">
            <el-menu style="border: none;">
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
                <el-avatar :src="data.image"></el-avatar>
            </template>
        </el-popover>
    </div>
</template>

<script setup>

import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref(null);
const visible = ref(false)
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")
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
    });
}

onMounted(() => {
    getData();
});
</script>

<style scoped>
.container {
    z-index: 100;
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
</style>
