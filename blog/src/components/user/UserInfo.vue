<template>

    <div class="contianer">
        <div class="info" v-if="userInfo != null">

            <div class="image">
                <el-image :src="userInfo.image" lazy loading="lazy" fit='contain' class="elimg"></el-image>
            </div>
            <div class="infoText">
                <h4>{{ userInfo.name }}</h4>
                <el-text>{{ userInfo.description }}</el-text>
            </div>

            <div class="buttons">
                <div v-if="isSelf == false" class="subscribeButton">
                    <SubscribeButton :is-subscribe="isSubscribe" :user-id="userId"></SubscribeButton>
                </div>
                <div v-if="isSelf == false">
                    <el-button type="primary" @click="sendMessage">发私信</el-button>
                </div>
            </div>

        </div>


        <div class="select">
            <el-segmented v-model="currentComponent" :options="options" block></el-segmented>
        </div>
        <div>
            <component :is="userComponents[currentComponentIndex]"></component>
        </div>

    </div>




</template>
<script setup>
import { onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';



import UserCollectPost from './UserCollectPost.vue';
import UserSubscribeBar from './UserSubscribeBar.vue';
import UserPostBlog from './UserPostBlog.vue';
import UserLikeBlog from './UserLikeBlog.vue';

import SubscribeButton from '../like/SubscribeButton.vue';
import axiosInstance from '@/functions/axios';
const route = useRoute()
const userId = route.params.userId;
provide("userId", userId)
const isSubscribe = ref(false);
const isSelf = ref(false)
const router = useRouter()
const currentComponent = ref(null)
const currentComponentIndex = ref(0)
const options = [
    "个人动态",
    "点赞贴子",
    "收藏贴子",
    "关注的吧"
]


const token = localStorage.getItem("jwt")
const userInfo = ref(null)

const userComponents = [UserPostBlog, UserLikeBlog, UserCollectPost, UserSubscribeBar]
function getData() {
    axiosInstance.get("/user/getUserInfo", {
        headers: {
            token: token
        },
        params: {
            userId: userId
        }
    }).then(res => {
        userInfo.value = res.data.record
        isSelf.value = res.data.record.self
        isSubscribe.value = res.data.record.subscribe
    })
}
watch(currentComponent, () => {
    currentComponentIndex.value = options.indexOf(currentComponent.value)
})
function sendMessage() {
    toMessagePage();
}
function toMessagePage() {
    const url = router.resolve({ path: `/privateMessagePage/${userId}/${userInfo.value.name}` }).href
    window.open(url, '_blank')
}
onMounted(() => {
    getData()



})
</script>
<style scoped>
.contianer {
    height: 30%;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.image {
    width: 30%;
    height: 100%;
    padding: 15px;
}



.buttons {
    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    margin-left: 10px;
    gap: 10px;
}

.info {
    width: 100%;
    display: flex;
    min-height: 200px;
}

.el-image {
    width: 200px;
    height: 200px;
}

.infoText {
    width: 70%;
    height: 100%;
}
</style>