<template>
    <div class="collect-container" ref="container">
        <BlogBriefPage v-for="blog of blogs" :key="blog.id" :blog="blog"></BlogBriefPage>
    </div>

    <el-pagination class="collect-page" v-if="total > pageSize" background :total="total" :page-size="pageSize"
        layout="prev, pager, next" v-model:current-page="page"></el-pagination>
</template>
<script setup>

import { onMounted, ref, watch } from 'vue';
import BlogBriefPage from '../blog/BlogBriefPage.vue';

import coreaxios from '@/functions/coreaxios';

const token = localStorage.getItem("jwt")
const page = ref(1)
const pageSize = ref(10)
const total = ref(null)
const blogs = ref([])

const userId = localStorage.getItem("userId")
const container = ref()
watch(page, () => {
    getData()
})
function getData() {
    const data = {
        page: page.value,
        pageSize: pageSize.value,
        userId: userId
    };
    coreaxios.post(`/blog/getCollectBlogByPage`, data, {
        headers: {
            token: token
        }

    })
        .then(res => {
            blogs.value = res.data.records || [];
            total.value = res.data.count || 0;

            container.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })

}

onMounted(() => {
    getData()
})

</script>
<style scoped>
.collect-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.collect-page {
    display: flex;
    justify-content: center;
}
</style>