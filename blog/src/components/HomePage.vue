<template>

    <el-container class="contianer" v-infinite-scroll="load">

            <el-header class="header">
                <div class="headerone">

                </div>
                <div>
                    <SearchComponent></SearchComponent>
                </div>
                <div>
                    <UserInfoForHome></UserInfoForHome>
                </div>
                <div>
                    <MessageBadgeBar></MessageBadgeBar>
                </div>
            </el-header>


        <el-main class="main">
            <!-- <div class="mainleft">
                

                <div class="tag">

                </div>
            </div> -->
            <div class="mainright">
                <div class="hotbar">
                    <HotBar></HotBar>
                </div>
                <div class="blogrec">
                    <BlogRecommend @loading="handleLoading" :load-more="loadMore" />
                    <div v-if="loadCompleted == false" class="loading" v-loading="loading"
                        element-loading-text="加载中...">

                    </div>
                </div>

            </div>
        </el-main>
    </el-container>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import HotBar from './bar/HotBar.vue';

import SearchComponent from './search/SearchComponent.vue';

import { loginEntity } from '../functions/login'
import BlogRecommend from './blog/BlogRecommend.vue';

import MessageBadgeBar from './message/MessageBadgeBar.vue';
import UserInfoForHome from './user/UserInfoForHome.vue';
const loading = ref(false)
const isLogined = ref(false)
const loadCompleted = ref(false)
const loadMore = ref(false)
function load() {
    if (loadCompleted.value == true) {
        loadMore.value = true;
        loading.value = true;
    }
}

function handleLoading(condition) {
    loadCompleted.value = condition
    if (condition == true) {
        loadMore.value = false
        loading.value = false;
    }
}
onMounted(() => {
    isLogined.value = loginEntity.get()

})

</script>
<style scoped>
.contianer {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    /* 保证子元素能在相对位置上定位 */
}

.loading {
    width: 100%;
    height: 100px;
}

.header {
    display: flex;
    gap: 30px;
    justify-content: center;
    position: fixed;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    background-color: white;

    z-index: 100;

    padding: 10px 0;
    /* 根据需要设置顶部和底部的内边距 */
}

.main {
    display: flex;
    margin-top: 60px;
    /* 让主内容下移，避免被 header 遮挡 */
}

.mainleft {
    width: 150px;
    margin-right: 3%;
    position: fixed;
    /* 固定在左侧 */
    top: 60px;
    /* 距离顶部 60px，避免与 header 重叠 */
    left: 20%;
    bottom: 0;
    /* 固定在页面的底部 */
    padding: 5px;
    background-color: white;
    /* 设置背景色 */
    z-index: 50;
    /* 确保它位于内容区的下方 */
}

.mainright {
    width: 70%;
    margin-left: 30%;

}

.tag {
    margin-top: 20px;
}

.blogrec {
    width: 100%;
    overflow: hidden;
}
</style>