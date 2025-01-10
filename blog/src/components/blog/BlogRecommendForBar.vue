<template>
    <div v-show="isShow" class="blog-Container" ref="blogContainer">
        <div>
            <BlogBriefPage v-for="(blog, index) of resultBlogs" :key="index" :blog="blog" @clicked="toBlogPage(blog)">
            </BlogBriefPage>
        </div>

        <div class="pagination">

            <el-pagination background :total="resBlogCount" :page-size="pageSize" layout="prev, pager, next, jumper"
                @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>
<script setup>

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BlogBriefPage from './BlogBriefPage.vue';
import axiosInstance from '@/functions/axios';


const { clubId } = defineProps(['clubId'])
const router = useRouter();
const currentPage = ref(1);
const pageSize = 10;
const resultBlogs = ref([])
const resBlogCount = ref(0)
const blogContainer = ref(null)
function getBlogs(page) {
    axiosInstance.get("/blog/getBlogForClubByPage", {
        params: {
            page: page,
            clubId: clubId
        },
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {
        resultBlogs.value = res.data.record.records
        resBlogCount.value = res.data.record.count
    })


}
function toBlogPage(blog) {
    const url = router.resolve({ path: `/blogPage/${blog.id}` }).href
    window.open(url, '_blank')
    // router.push(`/blogPage/${blog.id}`);


}
function handleCurrentChange(num) {
    currentPage.value = num;
    getBlogs(currentPage.value)
    blogContainer.value.scrollIntoView({ behavior: 'smooth', block: 'start' });




}

// 在 onMounted 生命周期中访问 DOM 并添加事件
onMounted(() => {
    getBlogs(currentPage.value)

});

const isShow = ref(true)
</script>
<style>
.pagination {
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
}

.blog-item {
    width: 100%;
}

.blog-image {
    width: 30%;
    height: auto;
    margin-bottom: 10px;
}

.blog-loadButton {
    text-align: center;
    margin-top: 20px;
}
</style>
