<template>
    <div class="comment-berif-container" v-if="comment">
        <div class="comment-berif-header">
            <div class="comment-berif-header-left">
                <UserLink :user-id="comment.user.id" :user-image="comment.user.image" :username="comment.user.name">
                </UserLink>
                <div v-if="(comment.parentType == parentType.COMMENT) && (comment.respondUser.id != comment.user.id)"
                    style="display: flex;">
                    <el-text type="info">回复: </el-text>
                    <UserLink :user-id="comment.respondUser.id" :username="comment.respondUser.name"></UserLink>
                </div>
                <CreateTime :time="comment.createTime"></CreateTime>
            </div>


            <el-popover width="50" v-if="userId == comment.user.id" trigger="click" placement="bottom">
                <el-menu style="border: none; ">
                    <el-menu-item @click="isEdit = !isEdit" index="1">
                        修改
                    </el-menu-item>
                    <el-menu-item index="2">

                        <el-popconfirm :icon="null" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="deleteComment">

                            <template #reference>
                                <div style="width: 100%;">
                                    删除
                                </div>

                            </template>

                        </el-popconfirm>
                    </el-menu-item>
                </el-menu>

                <template #reference>
                    <el-button><el-icon>
                            <Tools />
                        </el-icon></el-button>
                </template>
            </el-popover>
        </div>
        <div v-if="isEdit">
            <el-input v-model="content" type="textarea" :rows="5" placeholder="请输入内容" style="margin-bottom: 10px;" />
            <UploadImage v-model="images" @uploaded="getImage"></UploadImage>
            <div style="display: flex; gap: 10px;">
                <el-button @click="update">保存</el-button>
                <el-button @click="isEdit = false">取消</el-button>
            </div>
        </div>
        <div v-if="!isEdit">
            <pre>{{ content }}</pre>
            <el-image :hide-on-click-modal="true" v-for="(image, index) of comment.images" :key="index" :src="image"
                lazy loading="lazy" :fit="'contain'" class="comment-berif-images"
                :preview-src-list="comment.images"></el-image>
        </div>


        <div v-if="!isEdit" class="comment-berif-tools">
            <CommentLikeButtton :comment-id="comment.id" :condition="comment.like" :count="comment.likeCount">
            </CommentLikeButtton>
            <div v-if="(comment.parentType == parentType.BLOG) && (comment)">
                <el-tooltip effect="dark" content="评论数" placement="bottom">
                    <el-button>
                        <el-icon>
                            <ChatLineRound />

                        </el-icon>
                        <span>{{ comment.commentCount }}</span>
                    </el-button>
                </el-tooltip>
            </div>

            <ReplyCommentButton :comment="comment"></ReplyCommentButton>
            <el-button
                v-if="(comment.parentType == parentType.BLOG) && (comment.commentCount > 0) && (showMore == true)"
                @click="subCommentVisible = !subCommentVisible">展开回复</el-button>
            <TranslateComponent :content="comment.content" @translated="translated"></TranslateComponent>
        </div>
        <div>
            <SubCommentPage v-if="subCommentVisible" :comment-id="comment.id"></SubCommentPage>
        </div>
    </div>
</template>
<script setup>
import CommentLikeButtton from '../button/CommentLikeButtton.vue';
import ShareButton from '../button/ShareButton.vue';
import ReplyCommentButton from '../button/ReplyCommentButton.vue';
import SubCommentPage from './SubCommentPage.vue';
import CreateTime from '../time/CreateTime.vue';
import UserLink from '../user/UserLink.vue';
import { onMounted, ref } from 'vue';
import coreaxios from '@/functions/coreaxios';
import { ElNotification } from 'element-plus';
import UploadImage from '../image/UploadImage.vue';
import TranslateComponent from '../TranslateComponent.vue';
const parentType = {
    BLOG: "BLOG",
    COMMENT: "COMMENT",
}
const isEdit = ref(false)
const subCommentVisible = ref(false)
const { comment, showMore } = defineProps(["comment", "showMore"])
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")
const images = ref([])
const content = ref(null)
// const respondText = ref(null)
// const respondDialogVisible = ref(false)
function getImage(url) {
    images.value.push(url)
}
function translated(result) {
    content.value = result.map(item => item.dst).join("\n")
}
function deleteComment() {
    coreaxios.post("/comment/delete", {
        id: comment.id,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "通知",
                message: "评论删除成功",

            })
        }
    })
}
function update() {
    coreaxios.post("/comment/update", {
        id: comment.id,
        userId: userId,
        content: content.value,
        images: images.value,

    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "更新",
                content: "更新成功",
                type: "success"
            })
        } else {
            ElNotification({
                title: "更新",
                content: "更新失败",
                type: "error"
            })
        }
    })
}
onMounted(() => {
    content.value = comment.content
    images.value = comment.images
})
</script>
<style scoped>
.comment-berif-images {
    max-width: 100%;
    height: auto;
}

.comment-berif-container {
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 10px;
    gap: 10px;
    border-radius: 3%;

}

.comment-berif-header {
    display: flex;
    justify-content: space-between;
}

.comment-berif-header-left {
    display: flex;
    gap: 10px;
}

.comment-berif-tools {
    margin-top: 5px;
    display: flex;
    gap: 30px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.comment-berif-tools::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

@media screen and (max-width: 768px) {
    .comment-berif-tools {
        padding-bottom: 5px;
    }
}
</style>