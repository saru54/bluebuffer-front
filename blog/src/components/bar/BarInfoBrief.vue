<template>
    <div class="container">
        <h5>本吧信息</h5>

        <el-text type="info">吧主:
        </el-text>
        <UserLink :user-id="barInfo.admin.id" :username="barInfo.admin.name"></UserLink>
        <el-text type="info">类别:</el-text>
        <el-tag type="primary" v-for="(item, index) of barInfo.tags" :key="index" size="large">{{
            item.name }}</el-tag>
    </div>


</template>
<script setup>
import UserLink from '../user/UserLink.vue';


const { barInfo } = defineProps(['barInfo'])
</script>
<style scoped>
.container {
    border: 1px solid var(--el-border-color);

    display: flex;
    flex-direction: column;
}
</style>