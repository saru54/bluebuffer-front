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
                <CreateBlogButton></CreateBlogButton>
                <ChatButton></ChatButton>
                <InfoButton></InfoButton>
                <ToggleButton></ToggleButton>
                <UserInfoForHome></UserInfoForHome>
            </div>


        </el-header>
        <el-container class="content">
            <el-aside class="aside" width="200px">
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


import router from '@/routers/router';
import { chatModelStore } from '@/functions/chat';

function toClubRecommend() {
    router.push("/home/clubRecommendPage")
}
function toBlogRecommend() {
    router.push("/home/blogRecommendPage")
}
function toCreateClubPage() {
    router.push("/home/clubCreatePage")
}
function toCollectPage() {
    router.push("/home/collect")
}
</script>

<style>
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: Arial, sans-serif;
}

body {
    overflow-y: auto;
}

.app {
    min-height: 100vh;
    position: relative;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    line-height: 50px;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    background-color: var(--el-bg-color);
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
</style>