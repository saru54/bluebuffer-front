<template>
    <div class="container">
        <el-text>吧名:</el-text>
        <BarLink :bar-id="barInfo.id" :barname="barInfo.name"></BarLink>
        <el-text type="info"></el-text>
        <SubscribeButtonForClub :club-id="barInfo.id" :is-subscribe="true"></SubscribeButtonForClub>
    </div>
</template>
<script setup>

import SubscribeButtonForClub from '../like/SubscribeButtonForClub.vue';
import BarLink from './BarLink.vue';

const { barInfo } = defineProps(['barInfo'])

</script>
<style scoped>
.container {
    margin-top: 20px;
    gap: 20px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    justify-content: center;
}
</style>