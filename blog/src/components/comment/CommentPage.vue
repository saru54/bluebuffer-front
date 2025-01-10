<template>
    <el-card>
        <div class="commentShow" v-if="comment != null" :id="`comment-${comment.id}`">
            <div class="main">
                <div class="info">
                    <div class="infoShow">


                        <UserLink :username="comment.userName" :userId="comment.userId" :user-image="comment.userImage">
                        </UserLink>
                    </div>

                </div>

                <div class="content">
                    <p>: {{ comment.content }}</p>
                    <el-image class="commentImg" v-for="(image, index) of comment.images" :key="index" :src="image" lazy
                        loading="lazy" fit="contain"></el-image>
                </div>
            </div>
            <div class="tool">
                <LikeButton :comment-id="comment.id" :like-condition="comment.likeCondition"
                    :like-count="comment.likeCount"></LikeButton>
                <el-link v-if="comment.comments.records.length > 0" type="primary" @click="showComments = !showComments"
                    :underline="false">{{ commentCondition
                    }}</el-link>
                <el-link type="primary" @click="respond" :underline="false">回复</el-link>
                <CreateTime :time="comment.createTime"></CreateTime>
                <!-- <el-text type="info">{{ comment.createTime }}</el-text> -->
            </div>
        </div>
        <Transition name="slide-fade">
            <CommentPageForComment :showComents="showComments" :commentsForComment="comment.comments"
                :commentId="comment.id" :blog-id="blogId"></CommentPageForComment>
        </Transition>


    </el-card>
    <el-dialog title="输入回复信息" width="600px" v-model="respondDialogVisible" center>
        <el-input ref="myInput" placeholder="输入回复信息" v-model="respondText" type="textarea"></el-input>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="small" @click="handleCancel">取 消</el-button>
                <el-button size="small" type="primary" @click="respondComfirm" :loading="confirmLoading">确
                    定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import CommentPageForComment from './CommentPageForComment.vue';
import UserLink from '../user/UserLink.vue';

import { ElMessageBox } from 'element-plus';
import LikeButton from '../like/LikeButton.vue';
import CreateTime from '../time/CreateTime.vue';
import axiosInstance from '@/functions/axios';
const respondDialogVisible = ref(false)
const { comment, blogId } = defineProps(["comment", "blogId"])
const showComments = ref(true)
const myInput = ref(null)
const commentCondition = computed(() => {
    return showComments.value ? "收起" : "展开"
})
const respondText = ref(null)
const token = localStorage.getItem("jwt")
function respond() {
    respondDialogVisible.value = true
    setTimeout(() => {
        myInput.value.focus();
    }, 300);

}
function handleCancel() {
    respondDialogVisible.value = false
}
function respondComfirm() {

    const data = {
        content: respondText.value,
        commentId: comment.id,
        respondUserId: comment.userId,
        blogId: blogId

    }
    axiosInstance.post("/comment/insertComment", data, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.data.code === 201) {
            ElMessageBox.alert("成功")
            respondDialogVisible.value = false
            location.reload()

        }
    })
}
onMounted(() => {

})
</script>
<style scoped>
.main {
    width: 100%;
    display: flex;
}

.commentImg {
    width: auto;
    height: auto;
}

.tool {
    display: flex;
    justify-content: flex-end;
    height: 50px;
    padding-right: 10px;
    gap: 10px;
}

.commentShow {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.userImage {
    width: 50px;
    height: 50px;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 5px;
    width: 90%;
}

.info {
    display: flex;
    width: 10%;

}

.infoShow {
    width: 100%;
    height: 50px;
    display: flex;
    gap: 10px;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>