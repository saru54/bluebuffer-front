<template>
    <el-card class="user-profile-edit" v-if="form">

        <el-form label-width="100px">
            <!-- 用户名 -->
            <el-form-item label="用户名">
                <el-input v-model="name" placeholder="请输入用户名"></el-input>
                <el-text v-if="condition == false" type="error">用户名已存在</el-text>
            </el-form-item>

            <!-- 简介 -->
            <el-form-item label="简介">
                <el-input v-model="description" type="textarea" :rows="3" placeholder="请输入简介"></el-input>
            </el-form-item>

            <!-- 密码 -->
            <el-form-item label="密码">
                <!-- <el-input v-model="password" type="password" placeholder="请输入新密码"></el-input> -->

                <el-input v-model="password" type="password" placeholder="密码" prefix-icon="lock" show-password />

                <el-input v-model="confirmPassword" type="password" placeholder="确认密码" prefix-icon="lock"
                    show-password />

                <div class="password-requirements">
                    <p>密码必须包含:</p>
                    <ul>
                        <li :class="{ active: hasLength }">至少六个字符</li>
                        <li :class="{ active: hasUpper }">一个大写字符</li>
                        <li :class="{ active: hasLower }">一个小写字符</li>
                        <li :class="{ active: hasNumber }">一个数字</li>
                        <li :class="{ active: hasEqual }">两次密码相同</li>
                    </ul>
                </div>
            </el-form-item>

            <!-- 头像 -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <UploadImage @uploaded="upload" label="头像"></UploadImage>
                <el-avatar style="margin-right: 50px;" size="large" :src="image"></el-avatar>
            </div>

            <!-- 提交按钮 -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
            <el-text type="info">创建时间:{{ createTime }}</el-text>
        </el-form>
    </el-card>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { ElNotification } from 'element-plus';

import UploadImage from '../image/UploadImage.vue';
import coreaxios from '@/functions/coreaxios';
const image = ref(null)
// 表单数据
const form = ref(null);
const token = localStorage.getItem("jwt")
const userId = localStorage.getItem("userId")
const confirmPassword = ref('')
const name = ref(null)
const password = ref('')
const description = ref('')
const createTime = ref(null)
const condition = ref(true)
const previousName = ref(null)
const hasLength = computed(() => password.value.length >= 6)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasLower = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasEqual = computed(() => password.value == confirmPassword.value && password.value != '' && confirmPassword.value != '')
function validate() {
    if (hasLength.value == true && hasUpper.value == true && hasLower.value == true && hasNumber.value == true) {
        return true;
    } else {
        return false;
    }
}
// 提交表单
const onSubmit = () => {
    if (hasEqual.value) {
        if (validate()) {
            coreaxios.post("/user/update", {
                id: userId,
                name: name.value,
                password: password.value,
                description: description.value,
                image: image.value
            }, {
                headers: {
                    token: token
                }
            }).then(res => {
                if (res.status == 200) {
                    ElNotification({
                        title: "消息通知",
                        message: "信息更新成功",
                        type: "success"
                    })
                } else {
                    ElNotification({
                        title: "消息通知",
                        message: "信息更新失败",
                        type: "error"
                    })
                }
            })
        } else {
            ElNotification({
                title: "消息通知",
                message: "信息未完整",
                type: "error"
            })
        }
    } else {
        coreaxios.post("/user/update", {
            id: userId,
            name: name.value,
            description: description.value,
            image: image.value
        }, {
            headers: {
                token: token
            }
        }).then(res => {
            if (res.status == 200) {
                ElNotification({
                    title: "消息通知",
                    message: "信息更新成功",
                    type: "success"
                })
            } else {
                ElNotification({
                    title: "消息通知",
                    message: "信息更新失败",
                    type: "error"
                })
            }
        })
    }


};
function upload(url) {
    image.value = url
}

function verifyUserName() {
    coreaxios.post("/user/verifyName", null, {
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
let timeoutIndex = null
watch(name, () => {
    if (timeoutIndex) {
        clearTimeout(timeoutIndex)
    }
    if (name.value != " " && name.value != null && name.value != previousName.value) {
        timeoutIndex = setTimeout(() => {
            verifyUserName()

        }, 2000);
    }


})
function getData() {
    coreaxios.post("/user/getUserProfile", null, {
        headers: {
            token: token
        },
        params: {
            userId: userId
        }
    }).then(res => {
        if (res.status == 200) {

            form.value = res.data
            name.value = res.data.name
            description.value = res.data.description
            createTime.value = res.data.createTime
            image.value = res.data.image
            previousName.value = name.value
        }
    })
}

onMounted(() => {
    getData()
})
</script>

<style scoped>
.user-profile-edit {
    max-width: 600px;
    margin: 20px auto;
}

.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}




.password-requirements li.active {
    color: #6366f1;
}

.password-requirements li.active::before {
    content: "✓";
}
</style>