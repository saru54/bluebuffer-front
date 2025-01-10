<template>
    <p ref="top"></p>
    <BlogBriefPage v-for="(blog, index) of blogs" :key="index" :blog="blog" @clicked="toBlogPage(blog)"></BlogBriefPage>
    <el-pagination background :total="total" :page-size="pageSize" layout="prev, pager, next"
        v-model:current-page="page"></el-pagination>
</template>
<script setup>

import { inject, onMounted, ref, watch } from 'vue';
import BlogBriefPage from '../blog/BlogBriefPage.vue';
import { useRouter } from 'vue-router';
import axiosInstance from '@/functions/axios';
const token = localStorage.getItem("jwt")
const page = ref(1)
const pageSize = ref(10)
const total = ref(null)
const blogs = ref([])
const router = useRouter()
const top = ref(null)
const userId = inject("userId")
watch(page, () => {
    getData()
})
// function handleCurrentChange(num) {
//     page.value = num
//     getData()
// }
function getData() {
    const data = {
        userId: userId
    };
    axiosInstance.post(`/blog/getOwnBlog`, data, {
        headers: {
            token: token
        },
        params: {
            page: page.value,
            pageSize: pageSize.value
        }
    })
        .then(res => {
            blogs.value = res.data.record.records || [];
            total.value = res.data.record.count || 0;
            top.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error("数据请求出错：", error);

        });
}
function toBlogPage(blog) {
    const url = router.resolve({ path: `/blogPage/${blog.id}` }).href
    window.open(url, '_blank')


}
onMounted(() => {
    getData()
})

</script>
<style scoped></style>