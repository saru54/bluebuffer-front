<template>
    <div class="contianeruser">
        <div class="show">

            <el-text type="primary">用户名</el-text>
            <el-input v-model="username"></el-input>
            <el-text type="primary">简介</el-text>
            <el-input v-model="description" type="textarea"></el-input>
            <el-text type="primary">邮箱</el-text>
            <el-input v-model="email"></el-input>
            <el-text type="primary">密码</el-text>
            <el-input placeholder="" v-model="password" type="password"></el-input>
            <el-text type="primary">确认密码</el-text>
            <el-input placeholder="" v-model="passwordRepeat" type="password"></el-input>

            <el-text type="primary">上传头像</el-text>
            <UploadImage @uploaded="getImage" :max-upload="1" :default-image="image"></UploadImage>
            <el-text type="primary">提交</el-text>
            <el-button type="primary" @click="submitChange">提交</el-button>
        </div>
    </div>
</template>
<script setup>

import { onMounted } from 'vue';
import { ref } from 'vue'
import UploadImage from '../image/UploadImage.vue';
import { ElMessageBox } from 'element-plus';
import axiosInstance from '@/functions/axios';

const password = ref('')
const passwordRepeat = ref('')
const username = ref('')
const description = ref(null)
const image = ref(null)
const email = ref(null)
const token = localStorage.getItem("jwt")
function getData() {
    axiosInstance.get("/user/getUserProfile", {
        headers: {
            token: localStorage.getItem("jwt"),

        }
    }).then(res => {
        const record = res.data.record;
        username.value = record.name;
        description.value = record.description
        image.value = record.image;
        email.value = record.email;
    })
}

function getImage(path) {
    image.value = path
}
function submitChange() {
    const data = {
        name: username.value,
        password: password.value,
        image: image.value,
        email: email.value,
        description: description.value,

    }
    console.log(data);

    axiosInstance.put("http://localhost:8080/user/update", data, {
        headers: {
            token: token
        }
    }).then(() => {
        ElMessageBox.alert("提交完成")
    })
}
onMounted(() => {
    getData()
})

</script>
<style scoped>
.contianeruser {
    display: flex;
    justify-content: center;
    align-items: center;

}

.show {
    width: 50%;
    display: flex;
    flex-direction: column;
    float: left;
}

.avatar-uploader .el-upload {
    border: 3px dashed red;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #131415;
    width: 178px;
    height: 178px;
    text-align: center;
    border: 3px dashed rgb(228, 228, 228);
}
</style>