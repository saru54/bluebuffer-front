<template>
    <el-button v-if="!loginEntity.get()" type="primary" @click="toLoginPage">登录</el-button>
    <el-button v-if="loginEntity.get()" type="danger" @click="unLogin">注销</el-button>
</template>
<script setup>
import { loginEntity } from '@/functions/login';
import { useRouter } from 'vue-router';

const router = useRouter()
function toLoginPage() {
    router.push(`/loginPage`)
}
function unLogin() {
    localStorage.setItem("userId", null)
    localStorage.setItem("jwt", null)
    loginEntity.unLogin()
    window.location.reload();

}
</script>
<style scoped></style>