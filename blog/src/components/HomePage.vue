<template>
    <div class="app">
        <ChatPage :visible="chatModelStore.visible"></ChatPage>
        <el-header class="header">
            <div class="left">
                <h2>BlueBuffer</h2>
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
                        <el-menu-item index="1" @click="toBlogRecommend">首页</el-menu-item>
                        <el-menu-item index="2" @click="toClubRecommend">
                            广场
                        </el-menu-item>
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
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    line-height: 50px;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    background-color: var(--el-bg-color);
    box-sizing: border-box;
}

.left {
    margin-right: auto;
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
    padding-top: 50px;
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

    .header {
        padding: 0 10px;
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        left: 0;
        right: 0;
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