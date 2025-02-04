<template>
    <div>
        <el-button type="" @click="clearSearchData">清空search数据库</el-button>
        <el-button type="" @click="reloadBlogSearchData">重载blog搜索数据</el-button>
        <el-button type="" @click="reloadClubSearchData">重载club搜索数据</el-button>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import searchaxios from '@/functions/searchaxios';
import { ElNotification } from 'element-plus';
const token = localStorage.getItem("jwt")
function clearSearchData() {
    searchaxios.post("/admin/search/clearSearchData", null, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                content: "删除成功"
            })
        }
    })
}
function reloadBlogSearchData() {
    coreaxios.post("/admin/blog/reloadSearchData", null, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "成功"
            })
        }
    })
}
function reloadClubSearchData() {
    coreaxios.post("/admin/club/reloadSearchData", null, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "成功"
            })
        }
    })
}
</script>
<style scoped></style>