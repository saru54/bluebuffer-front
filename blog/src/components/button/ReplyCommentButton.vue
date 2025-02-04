<template>
    <div>
        <el-button @click="respondDialogVisible = true">回复</el-button>
        <el-dialog title="输入回复信息" width="600px" v-model="respondDialogVisible" center>
            <el-input placeholder="输入回复信息" v-model="respondText" type="textarea" :autosize="{ minRows: 8 }"></el-input>
            <UploadImage v-model="images" @uploaded="getImage" :max-upload="3"></UploadImage>
            <template #footer>
                <div class="dialog-footer">
                    <el-button size="small" @click="handleCancel">取 消</el-button>
                    <el-button size="small" type="primary" @click="respond">确
                        定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import UploadImage from '../image/UploadImage.vue';
import { ref } from 'vue';
import coreaxios from '@/functions/coreaxios';
import { ElNotification } from 'element-plus';
const { comment } = defineProps(["comment"])
const token = localStorage.getItem("jwt")
const userId = localStorage.getItem("userId")
const images = ref([])
const respondDialogVisible = ref(false)
const respondText = ref(null)
function getImage(url) {
    images.value.push(url)
}
function respond() {
    coreaxios.post("/comment/insertSubComment", {
        content: respondText.value,
        userId: userId,
        parentId: comment.id,
        respondUserId: comment.user.id,
        images: images.value,
        blogId: comment.blogId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "通知",
                message: "评论成功"
            })
        } else {
            ElNotification({
                title: "通知",
                message: "评论失败",
                type: "error"
            })
        }
    })
    handleCancel()
}
function handleCancel() {
    respondDialogVisible.value = false
}
</script>