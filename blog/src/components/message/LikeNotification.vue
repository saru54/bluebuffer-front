<template>
    <div v-if="data" class="c-n-container">
        <div v-for="notification of data" :key="notification.id">
            <div v-if="notification.targetType == 'BLOG'" class="c-n-item" @click="toBlog(notification.targetId)">
                <div style="display: flex; flex-direction: column; ">
                    <div style="display: flex; gap: 20px;">
                        <UserLink :user-id="notification.user.id" :user-image="notification.user.image"
                            :username="notification.user.name">
                        </UserLink>
                        <el-text type="info">点赞了我的文章</el-text>

                        <CreateTime :time="notification.createTime"></CreateTime>
                    </div>


                    <p>标题: {{ notification.targetContent }}</p>
                </div>

            </div>
            <div v-if="notification.targetType == 'COMMENT'" class="c-n-item"
                @click="toBlogWithLocate(notification.targetParentId, notification.targetId)">
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; gap: 20px;">
                        <UserLink :user-id="notification.user.id" :user-image="notification.user.image"
                            :username="notification.user.name">
                        </UserLink>
                        <el-text type="info">点赞了我的评论</el-text>

                        <CreateTime :time="notification.createTime"></CreateTime>
                    </div>


                    <p>原文: {{ notification.targetContent }}</p>
                </div>

            </div>
        </div>
        <el-pagination v-model="page" v-if="total > pageSize" background :total="total"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
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
    coreaxios.post("/notification/getLikeNotification", {
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
    router.push(`/home/blogPage/${blogId}/${commentId}`)

}
function toBlog(id) {
    router.push(`/home/blogPage/${id}`)
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

    margin-left: auto;
    margin-right: auto;
    padding: 30px;
    width: 100%;
}

.c-n-item {
    display: flex;
    justify-content: space-between;
    min-width: 700px;
    width: 100%;
    border-bottom: 1px solid var(--el-border-color);
    cursor: pointer;
}
</style>