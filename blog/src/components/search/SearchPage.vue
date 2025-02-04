<template>
    <div class="search-container">
        <div class="head">
            <div class="search-tools">
                <el-segmented size="large" v-model="currentOption" :options="options" block></el-segmented>
            </div>
        </div>
        <div style="display: flex;">
            <div class="search-left">
                <div class="search-main">
                    <div v-for="(item, index) of data" :key="index">
                        <div v-if="type == 0">
                            <div class="search-item">
                                <div style="display: flex; align-items: center; gap: 10px; "
                                    @click="toClubPage(item.clubId)">
                                    <el-avatar :src="item.clubImage"></el-avatar>
                                    <el-text type="info">{{ item.clubName }}</el-text>

                                    <CreateTime :time="item.createTime"></CreateTime>
                                </div>
                                <div style="display: flex; justify-content: space-between;"
                                    @click="toBlogPage(item.id)">
                                    <div>
                                        <h3>{{ item.title }}</h3>
                                        <pre>{{ item.content }}</pre>
                                    </div>
                                    <div v-if="item.images.length > 0" style="max-width: 350px; height: auto;">
                                        <el-image :src="item.images[0]"></el-image>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="type == 1">
                            <div class="search-item" @click="toClubPage(item.id)">
                                <div style="display: flex; align-items: center; gap: 10px; ">
                                    <el-avatar :src="item.image"></el-avatar>
                                    <el-text type="info">{{ item.name }}</el-text>

                                </div>
                                <div style="margin-top: 10px;">
                                    <el-text type="info">{{ item.description }}</el-text>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="page" v-if="total > pageSize">
                    <el-pagination v-model:current-page="page" background :total="total" :page-size="pageSize"
                        layout=" prev, pager, next"></el-pagination>
                </div>
            </div>
            <div class="search-right">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <h3>历史记录</h3>
                    <el-button round size="small" @click="removeAllHistroy">全部清除</el-button>
                </div>
                <el-tag size="large" effect="plain" v-for="(item, index) in searchHistory" :key="index" closable
                    @close="removeHistory(index)">
                    {{ item }}
                </el-tag>
            </div>
        </div>



    </div>
</template>

<script setup>

import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import searchaxios from "@/functions/searchaxios";
import CreateTime from "../time/CreateTime.vue";
const router = useRouter()
const route = useRoute();
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const options = ["文章", "俱乐部", "评论"]
const currentOption = ref(options[0])
const data = ref([]);
const searchHistory = ref([]);
const userId = localStorage.getItem("userId");
const key = "searchHistory" + "-" + userId;
const token = localStorage.getItem("jwt")
const type = computed(() => options.indexOf(currentOption.value))
const decodeQuery = computed(() => decodeURIComponent(route.params.query))
const encodeQuery = computed(() => encodeURIComponent(route.params.query))

watch(page, () => {
    router.push(`/home/search/${type.value}/${encodeQuery.value}/${page.value}`);
})
watch(type, () => {

    const page = route.params.page;
    console.log(encodeQuery.value);
    router.push(`/home/search/${type.value}/${encodeQuery.value}/${page}`)
})
function removeHistory(index) {
    searchHistory.value = searchHistory.value.filter(e => e != searchHistory.value[index])
    localStorage.setItem(key, JSON.stringify(searchHistory.value))
}
function removeAllHistroy() {
    localStorage.setItem(key, null)
    searchHistory.value = null
}
function initData() {
    currentOption.value = options[route.params.type]

    const storedHistory = localStorage.getItem(key);
    try {
        const parsedHistory = JSON.parse(storedHistory);
        searchHistory.value = Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (e) {
        searchHistory.value = [];
    }
}
function toBlogPage(id) {
    router.push(`/home/blogPage/${id}`)
}
function toClubPage(id) {
    router.push(`/home/clubPage/${id}`)
}



function initSearch() {
    switch (type.value) {
        case 0:
            queryBlog()
            break;
        case 1:
            queryClub()
            break;
        case 2:
            queryComment()
            break;
        default:
            console.log("无匹配");

    }
}

function queryBlog() {

    page.value = route.params.page;
    const dto = {
        "content": decodeQuery.value,
        "page": page.value,
        "pageSize": pageSize.value
    }
    searchaxios.post('/search/blog', dto, {
        headers: {
            token: token
        },
        params: {
            page: page.value,
            pageSize: pageSize.value
        }
    }).then(res => {
        total.value = parseInt(res.data.count)


        data.value = JSON.parse(res.data.record)


    })
}
function queryClub() {

    page.value = route.params.page;
    const dto = {
        "content": decodeQuery.value,
        "page": page.value,
        "pageSize": pageSize.value
    }
    searchaxios.post('/search/club', dto, {
        headers: {
            token: token
        },
        params: {
            page: page.value,
            pageSize: pageSize.value
        }
    }).then(res => {
        total.value = parseInt(res.data.count)


        data.value = JSON.parse(res.data.record)


    })
}
function queryComment() {
    // const query = route.params.query;
    // page.value = route.params.page;
    // const dto = {
    //     "content": query
    // }
    // searchaxios.post('/search/comment', dto, {
    //     headers: {
    //         token: token
    //     },
    //     params: {
    //         page: page.value,
    //         pageSize: pageSize.value
    //     }
    // }).then(res => {
    //     total.value = parseInt(res.data.record.count)
    //     data.value = JSON.parse(res.data.record.record)


    // })

}
onMounted(() => {
    initData();
    initSearch();
});
</script>

<style scoped>
.search-item {
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 2%;


    /* 添加平滑过渡效果 */
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
    cursor: pointer;
}

.search-item:hover {
    background-color: var(--el-color-info-light-9);

}


.search-left {
    width: 70%;


}

.search-right {
    width: 30%;
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 2%;


    /* 添加平滑过渡效果 */
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
    cursor: pointer;
}

.search-container {
    width: 90%;
    margin: auto;
}


.search-tools {
    width: 80%;
}

.search-tools .el-segmented {
    --el-segmented-item-selected-color: var(--el-text-color-primary);
    --el-segmented-item-selected-bg-color: var(--el-color-info-light-5);
    --el-border-radius-base: 16px;
}

pre {
    white-space: pre-wrap;
    /* 保留空格和换行，并在需要时换行 */
    word-wrap: break-word;
    /* 允许长单词换行 */
    overflow-wrap: break-word;
    /* 兼容某些浏览器 */
}
</style>