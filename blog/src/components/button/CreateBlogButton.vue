<template>
    <div>
        <el-button class="create_blog_btn" @click="toCreateBlogPage"><el-icon>
                <Plus />
            </el-icon><span></span> <span class="create_blog_btn_text">发布</span> </el-button>
    </div>
</template>
<script setup>
import router from '@/routers/router';

function toCreateBlogPage() {
    router.push("/home/createBlogPage")
}
</script>
<style scoped>
@media screen and (max-width: 768px) {
    .create_blog_btn_text {
        display: none;
    }
}
</style>
