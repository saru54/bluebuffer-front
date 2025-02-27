<template>
    <div class="container">
        <div class="form-content">
            <el-input placeholder="输入创建吧名" maxlength="10" minlength="1" v-model="inputBarName"></el-input>
            <el-input placeholder="输入简介" v-model="description"></el-input>
            <el-form-item prop="image" label="上传图片" v-model="form.image">
                <el-upload :action="'http://localhost:8080/image/upload'" list-type="picture-card" :limit="maxCount"
                    :on-exceed="limitError" :on-success="imgSuccess" :on-error="imgError"
                    :before-upload="handleBeforeUpload" :headers="uploadHeaders">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-button @click="createBar">创建</el-button><br>
        </div>
    </div>
</template>
<script setup>

import axiosInstance from '@/functions/axios';
import { ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const inputBarName = ref(null)

const imageUrl = ref(null)
const router = useRouter()
const description = ref(null)
const maxCount = ref(1)
const form = ref({
    image: ''
})

const token = localStorage.getItem("jwt");
const uploadHeaders = ref({
    token: token
})

const imgError = () => {
    // 上传失败后的处理
    alert('上传失败');
};
const limitError = () => {
    // 超过文件数量限制时的处理
    alert('上传文件数量超过限制');
};
const imgSuccess = (response) => {
    // 上传成功后的处理
    alert('上传成功');
    form.value.image = response.message; // 假设后端返回的 URL

    imageUrl.value = response.message;
};

function handleBeforeUpload() {


}
function createBar() {
    // 校验吧名是否为空或太短
    if (!inputBarName.value || inputBarName.value.trim().length < 1) {
        ElMessageBox.alert("请输入有效的吧名")
        return;
    }

    // 校验是否已上传头像
    if (!imageUrl.value) {
        ElMessageBox.alert("请上传吧头像")
        return;
    }

    // 发起请求创建
    axiosInstance.post("/club/insert", {
        name: inputBarName.value,
        userid: localStorage.getItem("userId"),
        imageUrl: imageUrl.value,
        description: description.value
    },
        {
            headers: {
                "token": localStorage.getItem("jwt")
            }
        }).then(res => {
            if (res.status === 200) {
                ElMessageBox.alert("创建成功");
                router.push(`barPage/${res.data.message}`)
            } else {
                ElMessageBox.alert("创建失败，请重试");
            }
        }).catch(error => {
            console.error(error);
            ElMessageBox.alert("创建失败，请重试");
        });
}


</script>
<style scoped>
.container {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-direction: column;
    width: 90%;
    height: 100vh;
    margin: auto;
    padding: 20px;
}

@media screen and (min-width: 768px) {
    .container {
        width: 50%;
    }
}

.form-content {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

:deep(.el-upload--picture-card) {
    width: 100%;
    max-width: 178px;
}

:deep(.el-input) {
    width: 100%;
}
</style>