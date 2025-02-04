<template>
    <div>
        <el-button class="create_blog_btn" @click="toCreateBlogPage"><el-icon>
                <Plus />
            </el-icon><span></span> 创建</el-button>
    </div>
</template>
<script setup>
import router from '@/routers/router';

function toCreateBlogPage() {
    router.push("/home/createBlogPage")
}
</script>
<style scoped></style>
