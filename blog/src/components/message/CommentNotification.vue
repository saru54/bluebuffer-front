<template>
    <div v-if="data" class="c-n-container">
        <div v-for="comment of data" :key="comment.id">
            <div v-if="comment.targetType == 'BLOG'" class="c-n-item"
                @click="toBlogWithLocate(comment.targetId, comment.id)">
                <div class="c-n-content">
                    <div class="c-n-header">
                        <UserLink :user-id="comment.user.id" :user-image="comment.user.image"
                            :username="comment.user.name">
                        </UserLink>
                        <el-text type="info">回复了我的文章</el-text>
                        <CreateTime :time="comment.createTime"></CreateTime>
                    </div>

                    <p>回复内容: {{ comment.content }}</p>
                    <p>标题: {{ comment.targetContent }}</p>
                </div>
                <div v-if="comment.images.length > 0" class="c-n-image">
                    <el-image :src="comment.images[0]" lazy loading="lazy" :fit="'contain'"
                        :preview-src-list="comment.images"></el-image>
                </div>
            </div>
            <div v-if="comment.targetType == 'COMMENT'" class="c-n-item"
                @click="toBlogWithLocateSubComment(comment.blogId, comment.id)">
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; gap: 20px;">
                        <UserLink :user-id="comment.user.id" :user-image="comment.user.image"
                            :username="comment.user.name">
                        </UserLink>
                        <el-text type="info">回复了我的评论</el-text>

                        <CreateTime :time="comment.createTime"></CreateTime>
                    </div>

                    <p>回复内容: {{ comment.content }}</p>
                    <p>原文: {{ comment.targetContent }}</p>
                </div>
                <div v-if="comment.images.length > 0">
                    <el-image :src="comment.images[0]" lazy loading="lazy" :fit="'contain'"
                        :preview-src-list="comment.images"></el-image>
                </div>
            </div>

        </div>
        <el-pagination v-model="page" v-if="total > pageSize" background :total="total"
            layout="prev, pager, next"></el-pagination>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref, watch } from 'vue';
import UserLink from '../user/UserLink.vue';
import CreateTime from '../time/CreateTime.vue';
import router from '@/routers/router';

const userId = localStorage.getItem('userId')
const token = localStorage.getItem('jwt')
const page = ref(1)
const pageSize = ref(20)
const data = ref(null)
const total = ref(0)
function getData() {
    coreaxios.post("/notification/getCommentNotification", {
        page: page.value,
        pageSize: pageSize.value,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        data.value = res.data.records
        total.value = res.data.count
    })
}
function toBlogWithLocate(blogId, commentId) {
    router.push(`/home/blogPage/${blogId}/${commentId}`);
}
function toBlogWithLocateSubComment(blogId, commentId) {
    router.push(`/home/blogPage/${blogId}/${commentId}`)
}
watch(page, () => {
    getData()
})
onMounted(() => {
    getData()
})
</script>
<style scoped>
.c-n-container {
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 100%;
}

.c-n-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-bottom: 1px solid var(--el-border-color);
    cursor: pointer;
    padding: 10px 0;
}

.c-n-content {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.c-n-header {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
}

.c-n-image {
    width: 100%;
    max-width: 300px;
    margin-top: 10px;
}

@media screen and (max-width: 768px) {
    .c-n-container {
        padding: 10px;
    }

    .c-n-header {
        gap: 5px;
    }

    p {
        margin: 5px 0;
        word-break: break-word;
    }
}
</style>