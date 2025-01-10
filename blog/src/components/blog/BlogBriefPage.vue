<template>


    <div class="container" v-if="blog != null">
        <el-link v-if="isHome" type="info" href="" target="_blank" @click="toBarPage">{{ blog.clubName }}</el-link>
        <br>

        <el-link type="primary" href="" target="_blank" class="title" @click="toBlogPage">{{ blog.title }}</el-link>

        <p class="content">{{ showContent }}</p>
        <el-image v-for="(image, index) of blog.images" :key="index" :src="image" lazy loading="lazy" :fit="'contain'"
            class="blogimage" :preview-src-list="blog.images"></el-image>

    </div>



</template>
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { blog, isHome } = defineProps(["blog", "isHome"])


const router = useRouter()
function toBlogPage() {

    const url = router.resolve({ path: `/blogPage/${blog.id}` }).href
    window.open(url, '_blank')
    // router.push(`/blogPage/${blog.id}`)
}
function toBarPage() {
    const url = router.resolve({ path: `/barPage/${blog.clubId}` }).href
    window.open(url, '_blank')
    // router.push(`/barPage/${blog.clubId}`)
}
const showContent = computed(() => {
    if (blog.content.length <= 200) {
        return blog.content
    }
    return blog.content.slice(0, 200) + "..."
})
</script>
<style scoped>
.blogimage {
    width: 25%;
    margin-top: 20px;
}

.container {
    /* background-color: #F2F4F7; */
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 5%;
    border: 1px solid var(--el-border-color);
    transition: background-color 0.3s ease;
    /* 添加平滑过渡效果 */
    gap: 10px;
    min-height: 100px;
}

.container:hover {
    background-color: #E0E4EA;
    /* 鼠标悬浮时背景颜色变深 */
}
</style>