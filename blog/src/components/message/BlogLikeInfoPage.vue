<template>
    <div class="container">
        <div class="commentLikeInfo" v-for="(item, index) of data" :key="index">
            <!-- 用户信息 -->
            <div class="userInfo">
                <UserLink :user-id="item.likerId" :username="item.likerName" :user-image="item.likerImage"></UserLink>
                <CreateTime :time="item.createTime" />
            </div>

            <!-- 评论信息 -->
            <div class="commentInfo">
                <el-text>赞了你的动态</el-text> <br>
            </div>

            <!-- 相关博客信息 -->
            <div class="blogInfo">
                <el-image :src="item.images[0]" lazy loading="lazy" class="blogImage" :preview-src-list="item.images"
                    :initial-index="0"></el-image>
                <div class="blogTitle" @click="toBlogPage(item.blogId)">{{ item.blogTitle }}</div>
            </div>

            <div class="clubInfo">
                <el-text type="info" @click="toClubPage(item.clubId)">{{ item.clubName }}</el-text>
            </div>
        </div>
        <div class="pagination">
            <el-pagination background :total="total" :page-size="pageSize" layout="prev, pager, next"
                v-model:current-page="page"></el-pagination>
        </div>
    </div>

</template>

<script setup>

import axiosInstance from '@/functions/axios';
import CreateTime from '../time/CreateTime.vue';
import UserLink from '../user/UserLink.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const router = useRouter()

const data = ref([])
watch(page, () => {
    getData()
})
function getData() {
    axiosInstance.get("/info/getBlogLikedInfoByOthers", {
        headers: {
            token: localStorage.getItem("jwt")
        },
        params: {
            page: page.value,
            pageSize: pageSize.value
        }
    }).then(res => {
        data.value = res.data.record.records
        total.value = res.data.record.count;

    })
}
function toBlogPage(blogId) {


    const url = router.resolve({ path: `/blogPage/${blogId}` }).href
    window.open(url, '_blank')


}
function toClubPage(clubId) {
    const url = router.resolve({ path: `/barPage/${clubId}` }).href
    window.open(url, '_blank')
}
onMounted(() => {
    getData()
})
</script>

<style scoped>
.commentLikeInfo {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    border-bottom: 1px solid #f0f0f0;
    width: 60%;
    margin: auto;
}

.userInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.commentInfo {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
}

.commentInfo .commentContent {
    margin-top: 5px;
    padding-left: 10px;
    color: #666;
    font-size: 15px;
    font-weight: bold;
}

.blogInfo {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.blogImage {
    width: 150px;
    height: 150px;
    border-radius: 5px;
    margin-right: 10px;
}

.blogTitle {
    font-size: 20px;
    color: #333;
    cursor: pointer;
}

.clubInfo {
    left: 0;
    cursor: pointer;
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>