<template>
    <div class="club-create-container">
        <el-steps direction="horizontal" :active="active">
            <el-step title="第一步" description="填写信息"></el-step>
            <el-step title="第二步" description="上传图片"></el-step>
            <el-step title="第三步" description="验证身份"></el-step>
        </el-steps>

        <div class="club-create-content">
            <div class="club-create-image" v-if="active == 2">
                <UploadImage :max-upload="1" :label="'上传图标'" @uploaded="(url) => { image = url }"></UploadImage>
                <UploadImage :max-upload="1" :label="'上传背景'" @uploaded="(url) => { backgroundImage = url }">
                </UploadImage>
            </div>
            <div class="club-create-identity" v-if="active == 3">
                <el-text type="info">暂不进行身份校验</el-text>
                <el-button @click="submit">创建</el-button>
            </div>
            <div class="club-create-name" v-if="active == 1">
                <el-input :class="condition == false ? 'club-name-repeat' : null" placeholder="输入名称" v-model="name">
                </el-input>
                <el-text type="danger" v-if="condition == false">名称重复</el-text>
                <el-input style="margin-top: 30px;" :autosize="{ minRows: 4 }" type="textarea" placeholder="输入简介"
                    v-model="description"></el-input>
            </div>

        </div>
        <div class="club-create-btn">
            <el-button @click="lastStep">上一步</el-button>
            <el-button :disabled="!condition" @click="nextStep">下一步</el-button>
        </div>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { ref, watch } from 'vue';
import UploadImage from '../image/UploadImage.vue';
import { ElMessage } from 'element-plus';
const token = localStorage.getItem('jwt')
const userId = localStorage.getItem("userId")
const active = ref(1)
const name = ref(null)
const description = ref(null)
const condition = ref(null)
const image = ref(null)
const backgroundImage = ref(null)
function verifyContainName() {
    coreaxios.post("/club/verifyName", null, {
        headers: {
            token: token
        },
        params: {
            name: name.value
        }
    }).then(res => {
        if (res.data == false && res.status == 200) {
            condition.value = true
        } else {
            condition.value = false
        }
    })
}
function submit() {
    coreaxios.post("/club/register", {
        name: name.value,
        description: description.value,
        image: image.value,
        backgroundImage: backgroundImage.value,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElMessage({
                message: "创建成功"
            })
        } else {
            ElMessage({
                message: "创建失败"
            })
        }
    })
}
let timeoutIndex = null
watch(name, () => {
    if (timeoutIndex) {
        clearTimeout(timeoutIndex)
    }
    if (name.value != " " && name.value != null) {
        timeoutIndex = setTimeout(() => {
            verifyContainName()

        }, 2000);
    }


})
function lastStep() {
    active.value = --active.value >= 1 ? active.value : 1
}
function nextStep() {
    if (condition.value) {
        active.value = ++active.value <= 3 ? active.value : 3
    }

}
</script>
<style scoped>
.club-create-container {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5%;
    background-color: var(--el-color-info-light-9);
    padding: 20px;
    border-radius: 3%;
}

.club-create-btn {
    margin-top: 30px;
    display: flex;
    justify-content: right;
}

.club-create-content {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;

}

.club-name-repeat {
    border: 1px solid red;
}

.club-create-identity {
    display: flex;
    flex-direction: column;
}
</style>