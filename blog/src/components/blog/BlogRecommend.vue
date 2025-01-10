<template>
    <div v-show="isShow" class="blog-Container" ref="container">
        <div class="blog-header">
            <h3>热门动态</h3>
        </div>
        <div>
            <BlogBriefPage :is-home="true" v-for="(blog, index) of blogs" :key="index" :blog="blog"></BlogBriefPage>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import BlogBriefPage from './BlogBriefPage.vue';

import { ElMessageBox } from 'element-plus';
import axiosInstance from '@/functions/axios';


const { loadMore } = defineProps(['loadMore']);
// const loadCompleted = defineModel()
const emit = defineEmits(['loading']);
const loading = ref(false)
const container = ref(null);
const userId = localStorage.getItem("userId");
const blogs = ref([]);
const token = localStorage.getItem("jwt");
const clickHistory = JSON.parse(localStorage.getItem(userId + "-" + "clickHistory")) || [];
const count = ref(10);
const loadCondition = ref(false)

function getData() {
    setLoading()
    loadCondition.value = false
    emit('loading', loadCondition.value)
    const data = {
        count: count.value,
        clickHistory: clickHistory
    };

    axiosInstance.post("/blog/recommend", data, {
        headers: { token: token }
    }).then(res => {
        setLoadingCompleted()
        blogs.value = res.data.record;
        loadCondition.value = true
        emit('loading', loadCondition.value);
    });
}

onMounted(() => {
    getData();
});
function setLoading() {
    loading.value = true
}
function setLoadingCompleted() {
    setTimeout(() => {
        loading.value = false
    }, 2000);
}
function loadMoreData() {
    setLoading()
    loadCondition.value = false
    emit('loading', loadCondition.value)
    const data = {
        count: count.value,
        clickHistory: clickHistory
    };

    axiosInstance.post("/blog/recommend", data, {
        headers: { token: token }
    }).then(res => {
   
            if (res.data.record.length === 0) {
                ElMessageBox.alert("暂无更多内容");
            }
            for (const blog of res.data.record) {
                blogs.value.push(blog);
            }

            setLoadingCompleted()
            loadCondition.value = true
            emit('loading', loadCondition.value);
 


    });
}


watch(() => loadMore, (newValue) => {
    if (newValue == true) {
        loadMoreData();
    }
});

const isShow = ref(true);
</script>

<style>
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
