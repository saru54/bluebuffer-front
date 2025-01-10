<template>


    <div class="contianer" @click="toBarPage">
        <div class="left">
            <el-image :src="hotbar.image" lazy loading="lazy" fit="cover" class="img"></el-image>
        </div>
        <div class="right">
            <p>{{ hotbar.name }}</p>
            <el-text class="text">订阅数:{{ hotbar.subscribeCount }}</el-text>
        </div>
    </div>


</template>
<script setup>
import { useRouter } from 'vue-router';

const { hotbar } = defineProps(['hotbar'])
const router = useRouter()
const barId = hotbar.id
function toBarPage() {
    const url = router.resolve({ path: `/barPage/${barId}` }).href
    window.open(url, '_blank')
    // router.push(`/barPage/${blog.clubId}`)
}
</script>
<style scoped>
.contianer {
    display: flex;
    width: 140px;
    height: 80px;
    margin-bottom: 10px;
    background-color: #fff;
    /* 默认白色背景 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* 默认的阴影 */
    border-radius: 4px;
    /* 默认的圆角 */
    cursor: pointer;
}

.left {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 100%;
    margin-right: 10px;
    margin-left: 10px;
}

.img {
    width: 60px;
    height: 60px;
}

.right {
    width: 60px;
    height: 60px;
}

.text {
    font-size: 10px;
}
</style>