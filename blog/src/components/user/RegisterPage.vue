<template>
    <div class="container">
        <el-card>
            <template #header>
                注册
            </template>
            <div class="show">
                <el-input placeholder="输入用户名" v-model="inputUsername"></el-input><el-text v-if="verifyCondition"
                    ref="existAlter" type="danger">用户名已存在</el-text>
                <el-input type="password" placeholder="输入密码" v-model="inputPasssword"></el-input>
                <el-input type="password" placeholder="再次输入密码" v-model="inputRepeatPassword"></el-input>
                <el-button @click="userRegister">注册</el-button>
            </div>

        </el-card>

    </div>
</template>
<script setup>

import axiosInstance from '@/functions/axios';
import { ElMessageBox } from 'element-plus';
import { ref, watch } from 'vue';
const verifyCondition = ref(null)
const inputUsername = ref()
const inputPasssword = ref()
const inputRepeatPassword = ref()
const tempNameValue = ref(null)
let timeoutIndex = null
function userRegister() {
    if (inputUsername.value == null || inputPasssword.value == null || inputRepeatPassword.value == null) {
        ElMessageBox.alert("账户密码不能为空")
        return
    }
    if (inputPasssword.value != inputRepeatPassword.value) {
        ElMessageBox.alert("两次密码不一致")
        return
    }

}

function floomFilterVerify() {
    axiosInstance.post("/user/verityName", null, {
        params: {
            name: inputUsername.value
        },
        headers: {
            token: localStorage.getItem('jwt')
        }
    }).then(res => {
        verifyCondition.value = res.data.record
    })
}

watch(inputUsername, () => {
    if (timeoutIndex) {
        clearTimeout(timeoutIndex)
    }
    tempNameValue.value = inputUsername.value;
    timeoutIndex = setTimeout(() => {
        if (tempNameValue.value == inputUsername.value) {
            if (inputUsername.value != null && inputUsername.value != "") {
                floomFilterVerify()
            }

        }
    }, 1500);
})
</script>
<style scoped>
.container {
    display: flex;

    justify-content: center;

    align-items: center;


    width: 50%;
    height: 100vh;
    margin: auto auto;
}

.show {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.el-input {
    width: 400px;
}

.el-button {
    width: 100%;
}
</style>