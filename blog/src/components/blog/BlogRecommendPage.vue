<template>

    <div class="rec-blog-container">
        <div v-if="data" class="rec-blog">
            <div>
                <BlogBriefPage v-for="(blog, index) of data" :is-home="true" :key="index" :blog="blog"
                    @clicked="toBlogPage(blog)">
                </BlogBriefPage>

            </div>
            <div v-if="loading" class="loading-container">
                <svg class="circular-loader" viewBox="25 25 50 50">
                    <circle class="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#007bff" stroke-width="4" />
                </svg>
                加载中...
            </div>
        </div>


    </div>
</template>
<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import BlogBriefPage from './BlogBriefPage.vue';
import coreaxios from '@/functions/coreaxios';
import recommendaxios from '@/functions/recommendaxois';

const router = useRouter();
const data = ref([])
const recommendSize = ref(5)
const token = localStorage.getItem("jwt")

const loading = ref(false)
const ids = ref([])
// const ids = ref(["abc1dc61-288d-467a-9256-619bac16d412", "14d16297-6ddf-4cca-94ec-4b92fc24e7a4", "6547337e-63e4-47e1-9447-906719984d22"])
function getData() {
    loading.value = true
    recommendaxios.post("/recommend/getBlogRecommend", null, {
        headers: {
            token: token
        },
        params: {
            count: recommendSize.value
        }
    }).then(res => {
        ids.value = res.data
        if (res.status == 200) {
            coreaxios.post("/blog/getByIds", ids.value, {
                headers: {
                    token: token
                }
            }).then(res => {
                for (var item of res.data) {
                    data.value.push(item)
                }
            })
        }
        loading.value = false

    })

}
const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!loading.value) {
            getData();
        }

    }
};

function toBlogPage(blog) {
    // const url = router.resolve({ path: `/blogPage/${blog.id}` }).href
    // window.open(url, '_blank')
    router.push(`/blogPage/${blog.id}`);


}
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});



onMounted(() => {
    getData()

});


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

.rec-blog-container {
    margin-top: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    overflow: hidden;
}

.rec-blog {
    width: 80%;
    min-width: 800px;
}

.loading-container {
    min-width: 800px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.circular-loader {
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;

}

.loader-path {
    stroke-dasharray: 150, 200;
    stroke-dashoffset: -10;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }

    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}
</style>
