<template>
    <div class="app">
        <ChatPage :visible="chatModelStore.visible"></ChatPage>
        <AiComponent />
        <div class="header-mask"></div>
        <el-header class="header">

            <div class="left" @mouseover="highlight = true" @mouseleave="highlight = false">
                <div v-for="(char, index) in text" :key="index" class="char"
                    :class="{ 'highlight': charHighlight[index] }" @mouseenter="setHighlight(index, true)"
                    @mouseleave="setHighlight(index, false)">
                    {{ char }}
                </div>
            </div>
            <div class="middle">
                <SearchComponent></SearchComponent>
            </div>
            <div class="right">
                <CreateBlogButton class="is-only-pc"></CreateBlogButton>
                <ChatButton></ChatButton>
                <InfoButton></InfoButton>
                <ToggleButton></ToggleButton>
                <UserInfoForHome></UserInfoForHome>
            </div>
        </el-header>
        <el-container class="content">
            <el-aside width="200px" :class="['desktop-only', 'aside']">
                <div class="menu">
                    <el-menu>
                        <el-menu-item index="0" @click="toCreateBlogPage">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            发布贴子
                        </el-menu-item>
                        <el-menu-item index="1" @click="toBlogRecommend">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                            </svg>
                            首页
                        </el-menu-item>
                        <el-menu-item index="2" @click="toClubRecommend">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                            广场
                        </el-menu-item>
                        <el-menu-item index="3" @click="toCreateClubPage">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
                            </svg>
                            创建俱乐部
                        </el-menu-item>
                        <el-menu-item index="4" @click="toCollectPage">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                <path
                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                            </svg>
                            我的收藏
                        </el-menu-item>
                    </el-menu>
                </div>
                <div class="adminclub">
                    <AdminClubMenu></AdminClubMenu>
                </div>
                <div class="subscribeclub">
                    <SubscribedClubMenu></SubscribedClubMenu>
                </div>
            </el-aside>
            <el-main class="main">
                <div class="mainleft">
                    <!-- <RouterView :key="$route.path"></RouterView> -->
                    <!-- <router-view v-slot="{ Component }">
                        <keep-alive>
                            <component :is="Component" :key="$route.path" />
                        </keep-alive>
                    </router-view> -->
                    <RouterView v-slot="{ Component }">
                        <KeepAlive include="BlogRecommendPage,ClubRecommendPage,ClubPage">
                            <component :is="Component" :key="$route.path" />
                        </KeepAlive>
                    </RouterView>
                </div>
                <div class="mainright">

                </div>
            </el-main>

        </el-container>

        <!-- 修改移动端底部导航 -->
        <div class="mobile-nav">
            <el-menu class="mobile-menu" mode="horizontal" :ellipsis="false">
                <el-menu-item index="1" @click="toggleMobileMenu">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    菜单
                </el-menu-item>
                <el-menu-item index="2" @click="toBlogRecommend">首页</el-menu-item>
                <el-menu-item index="3" @click="toClubRecommend">广场</el-menu-item>

            </el-menu>
        </div>

        <!-- 移动端菜单抽屉 -->
        <el-drawer v-model="mobileMenuVisible" direction="ltr" size="80%" class="mobile-drawer">
            <div class="mobile-menu-content">
                <div class="menu">
                    <el-menu>

                        <el-menu-item index="0" @click="toCreateBlogPage">
                            发布贴子
                        </el-menu-item>
                        <el-menu-item index="1" @click="toBlogRecommend">首页</el-menu-item>
                        <el-menu-item index="2" @click="toClubRecommend">广场</el-menu-item>
                        <el-menu-item index="3" @click="toCreateClubPage">创建俱乐部</el-menu-item>
                        <el-menu-item index="4" @click="toCollectPage">我的收藏</el-menu-item>
                    </el-menu>
                </div>
                <div class="adminclub">
                    <AdminClubMenu></AdminClubMenu>
                </div>
                <div class="subscribeclub">
                    <SubscribedClubMenu></SubscribedClubMenu>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import SearchComponent from './search/SearchComponent.vue';
import UserInfoForHome from './user/UserInfoForHome.vue';
import ToggleButton from './button/ToggleButton.vue';
import ChatPage from './message/ChatPage.vue';
import InfoButton from './button/InfoButton.vue';
import ChatButton from './button/ChatButton.vue';
import SubscribedClubMenu from './menu/SubscribedClubMenu.vue';
import AdminClubMenu from './menu/AdminClubMenu.vue';
import CreateBlogButton from './button/CreateBlogButton.vue';
import AiComponent from './AiComponent.vue';
import { Menu } from '@element-plus/icons-vue'
import { ref } from 'vue'

import router from '@/routers/router';
import { chatModelStore } from '@/functions/chat';

const mobileMenuVisible = ref(false)

function toClubRecommend() {
    mobileMenuVisible.value = false
    router.push("/home/clubRecommendPage")
}
function toBlogRecommend() {
    mobileMenuVisible.value = false
    router.push("/home/blogRecommendPage")
}
function toCreateClubPage() {
    mobileMenuVisible.value = false
    router.push("/home/clubCreatePage")
}
function toCollectPage() {
    mobileMenuVisible.value = false
    router.push("/home/collect")
}

function toggleMobileMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value
}
function toCreateBlogPage() {
    mobileMenuVisible.value = false
    router.push("/home/createBlogPage")
}
const text = ref('BlueBuffer');
const charHighlight = ref(new Array(text.value.length).fill(false));

const setHighlight = (index, highlight) => {
    charHighlight.value[index] = highlight;
};
</script>

<style>
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, sans-serif;
    position: relative;

}

body {
    overflow-y: auto;
}

.app {
    min-height: 100vh;
    position: relative;
    /* 防止水平滚动 */
    width: 100%;
    /* 添加顶部安全区域的内边距 */
    padding-top: env(safe-area-inset-top, 20px);
}

.header-mask {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background-color: var(--el-bg-color);
    z-index: 99;
}

.header {
    padding: 0 10px;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    right: 0;

    background-color: var(--el-bg-color);
    z-index: 100;
    line-height: 50px;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
}

.left {
    margin-right: auto;
    color: #2c8fff;
    font-family: 'MyFont', sans-serif;
    cursor: pointer;
    user-select: none;
}

@font-face {
    font-family: 'MyFont';
    src: url('@/assets/font/GravitasOne-Regular.ttf');
    font-style: normal;
}

.char {
    display: inline-block;
    font-weight: 400;
    font-size: 2em;
}

.highlight {
    filter: blur(2px);
    animation: animate 16s linear infinite;
}

@keyframes animate {

    0%,
    100% {
        filter: blur(2px);
        color: #fff;
        text-shadow: 0 0 5px rgba(30, 144, 255, 0.6),
            0 0 10px rgba(30, 144, 255, 0.4),
            0 0 15px rgba(30, 144, 255, 0.2),
            0 0 20px rgba(30, 144, 255, 0.1);
    }

    5%,
    95% {
        filter: blur(0px);
        color: #666;
        text-shadow: none;
    }
}

.icon {
    height: 16px;
    width: 16px;
    padding: 5px;
}


.right {
    margin-left: auto;
    display: flex;
    gap: 15px;

}

.middle {
    text-align: center;
}

.content {
    padding-top: calc(50px + env(safe-area-inset-top, 20px));
    min-height: calc(100vh - 50px);
}

.aside {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 200px !important;
    overflow: hidden;
    border-right: 1px solid var(--el-border-color);
    ;
}

.aside-content {
    height: 100%;
    overflow-y: auto;
    padding: 0 10px;
}

.aside ul {
    padding: 10px 0;
    margin: 0;
}

.main {
    margin-left: 200px;
    padding: 20px;
    min-height: calc(100vh - 50px);

    z-index: 1;

}

.main-content {
    max-width: 800px;
    margin: 0 auto;
}


.aside-content::-webkit-scrollbar {
    width: 8px;
}

.aside-content::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
}

.aside-content:hover::-webkit-scrollbar-thumb {
    background: #888;
}

.aside .el-menu {
    border-bottom: 1px solid var(--el-border-color);
}

.is-only-pc {
    display: none;
}

/* 添加响应式样式 */
@media screen and (max-width: 768px) {

    html,
    body {
        /* 隐藏移动端滚动条 */
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;

        /* IE and Edge */
        &::-webkit-scrollbar {
            display: none;
            /* Chrome, Safari, Opera */
        }
    }

    .app {
        padding-top: env(safe-area-inset-top, 20px);
    }

    .header-mask {
        display: block;
    }

    .header {
        padding: 0 10px;
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        left: 0;
        right: 0;
        margin-top: 20px;
        background-color: var(--el-bg-color);
        height: 50px;
        z-index: 100;
    }

    .content {
        padding-top: calc(50px + env(safe-area-inset-top, 20px));
    }

    .mainleft::-webkit-scrollbar,
    .content::-webkit-scrollbar,
    .main::-webkit-scrollbar {
        display: none;
    }

    .mainleft,
    .content,
    .main {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .left {
        display: none;
        /* 在移动端隐藏搜索框 */
    }

    .desktop-only {
        display: none;
        /* 隐藏部分桌面端按钮 */
    }

    .aside {
        display: none;
        /* 默认隐藏侧边栏 */
    }

    .main {
        margin-left: 0;
        padding: 10px;
        padding-top: calc(10px + env(safe-area-inset-top, 20px));
    }

    .right {
        gap: 10px;
    }

    h2 {
        font-size: 1.2em;
    }
}

/* 添加侧边栏响应式控制 */
.aside.mobile-visible {
    display: block;
    width: 80% !important;
    z-index: 1000;
}

/* 确保内容区域在移动端正确显示 */
.content {
    display: flex;
    flex-direction: column;
}

.mainleft {
    width: 100%;
    overflow-x: hidden;
}

.mainright {
    width: 100%;
}

/* 修改移动端底部导航样式 */
.mobile-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    z-index: 100;
}

.mobile-menu {
    display: flex;
    justify-content: space-around;
}

.mobile-menu .el-menu-item {
    flex: 1;
    text-align: center;
    padding: 0 !important;
    min-width: auto !important;
    font-size: 12px;
}

/* 移动端抽屉菜单样式 */
.mobile-drawer {
    padding-bottom: 60px;
}

.mobile-menu-content {
    height: 100%;
    overflow-y: auto;
}

.mobile-menu-content .el-menu {
    border-right: none;
}

@media screen and (max-width: 768px) {
    .mobile-nav {
        display: block;
    }

    .main {
        margin-bottom: 60px;
        /* 为底部导航留出空间 */
    }


}
</style>