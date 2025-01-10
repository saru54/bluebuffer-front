<template>
    <div class="container">
        <div class="head">
            <div class="search">
                <el-autocomplete v-model="input" placeholder="输入搜索内容" :fetch-suggestions="querySearch" clearable
                    @keyup.enter="search" />
            </div>

            <el-button type="primary" circle @click="search">
                <el-icon>
                    <Search />
                </el-icon>
            </el-button>

            <div>
                <el-segmented v-model="currentOption" :options="options"></el-segmented>
            </div>
        </div>

        <div class="left">
            <div v-for="(item, index) of data" :key="index">
                <div v-if="item.type == 'club'" class="show">
                    <div class="bottom">
                        <BarLink :bar-id="item.id" :barname="item.name" :bar-image="item.image"></BarLink>
                    </div>
                    <div>
                        <el-text>{{ item.description }}</el-text>
                    </div>

                </div>
                <div v-if="item.type != 'club'">
                    <div v-if="item.title != null" class="show">
                        <div>
                            <el-link type="primary" href="" target="_blank" @click="toBlogPage(item.id)">主题帖:{{
                                item.title }}</el-link>
                        </div>
                        <div>
                            <el-text style="width: 200px;"> {{ item.text }}</el-text>
                        </div>
                        <div class="bottom">
                            贴吧:<BarLink :bar-id="item.clubId" :barname="item.clubName"></BarLink>
                            用户:<UserLink :user-id="item.userId" :username="item.userName"></UserLink>
                            <CreateTime :time="item.createTime"></CreateTime>
                        </div>
                    </div>
                    <div v-if="item.title == null" class="show">
                        <div>
                            <el-link type="primary" href="" target="_blank"
                                @click="toBlogPageWithLocation(item.blogId, item.commentId != null ? item.commentId : item.id)">回复:{{
                                    item.content }}</el-link>
                        </div>
                        <div>
                            <el-text>{{ item.respondContent }}</el-text>
                        </div>
                        <div class="bottom">
                            贴吧:<BarLink :bar-id="item.clubId" :barname="item.clubName"></BarLink>
                            用户:<UserLink :user-id="item.userId" :username="item.userName"></UserLink>
                            <CreateTime :time="item.createTime"></CreateTime>
                        </div>
                    </div>
                </div>
                <div v-if="data == null || data == ''">
                    无内容
                </div>



            </div>
        </div>
        <div class="right"></div>
        <div class="page">
            <el-pagination v-model:current-page="page" background :total="total" :page-size="pageSize"
                layout=" prev, pager, next"></el-pagination>
        </div>
    </div>
</template>

<script setup>

import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BarLink from "../bar/BarLink.vue";
import UserLink from "../user/UserLink.vue";
import CreateTime from "../time/CreateTime.vue";
import { ElText } from "element-plus";
import axiosInstance from "@/functions/axios";
const router = useRouter()
const route = useRoute();

const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const options = ["搜贴或回复", "搜吧","搜主题帖", "搜回复"]

const currentOption = ref(options[0])
const data = ref([]);
const input = ref("");
const searchHistory = ref([]);
const userId = localStorage.getItem("userId");
const key = userId + "-" + "searchHistory";
const token = localStorage.getItem("jwt")
watch(page, () => {
    const query = route.params.query;
    const type = route.params.type;
    router.push(`/searchPage/${type}/${query}/${page.value}`);

})

function initData() {
    const storedHistory = localStorage.getItem(key);
    try {
        const parsedHistory = JSON.parse(storedHistory);
        searchHistory.value = Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (e) {
        searchHistory.value = [];
    }
}
function toBlogPageWithLocation(blogId, commentId, commentForCommentId) {
    if (commentForCommentId) {
        const url = router.resolve({ path: `/blogPage/${blogId}/${commentId}/${commentForCommentId}` }).href
        window.open(url, '_blank')
    } else {
        const url = router.resolve({ path: `/blogPage/${blogId}/${commentId}` }).href
        window.open(url, '_blank')
    }

}
function toBlogPage(id) {
    const url = router.resolve({ path: `/blogPage/${id}` }).href
    window.open(url, '_blank')
}
function search() {
    if (input.value) {

        insertHistory();
        router.push(`/searchPage/${options.indexOf(currentOption.value)}/${input.value}/${page.value}`);

    }
}

// 更新搜索历史
function insertHistory() {
    if (input.value && !searchHistory.value.includes(input.value)) {
        searchHistory.value.unshift(input.value);
        searchHistory.value = Array.from(new Set(searchHistory.value)); // 去重
        searchHistory.value = searchHistory.value.filter(
            (item) => item.length < 20
        ); // 保证每个历史条目的长度小于 20
        localStorage.setItem(key, JSON.stringify(searchHistory.value)); // 更新 localStorage
    }
}


function initSearch() {
    console.log(route.params.type);


    switch (route.params.type) {
        case '0':


            queryBlogAndComment()
            break;
        case '1':


            queryClub()

            break;
        case '2':
            queryBlog()
            break;
        case '3':


            queryComment()

            break;
        default:
            console.log("无匹配");

    }
}
function queryBlogAndComment(){
    const query = route.params.query;
    page.value = route.params.page;
    const dto =  {
        "content":query
    }
    axiosInstance.post('/search/multiSearchBlogAndComment',dto,{
        headers:{
            token:token
        },
        params:{
            page:page.value,
            pageSize: pageSize.value
        }
    }).then(res=>{
        total.value = parseInt(res.data.record.count)
        

        data.value = JSON.parse(res.data.record.record)

        
    })
}
function queryBlog() {
    const query = route.params.query;
    page.value = route.params.page;
    const dto =  {
        "content":query
    }
    axiosInstance.post('/search/blog',dto,{
        headers:{
            token:token
        },
        params:{
            page:page.value,
            pageSize: pageSize.value
        }
    }).then(res=>{
        total.value = parseInt(res.data.record.count)
        

        data.value = JSON.parse(res.data.record.record)

        
    })
}
function queryClub() {
    const query = route.params.query;
    page.value = route.params.page;
    const dto =  {
        "content":query
    }
    axiosInstance.post('/search/club',dto,{
        headers:{
            token:token
        },
        params:{
            page:page.value,
            pageSize: pageSize.value
        }
    }).then(res=>{
        total.value = parseInt(res.data.record.count)
        
  
        data.value = JSON.parse(res.data.record.record)

        
    })
}
function queryComment() {
    const query = route.params.query;
    page.value = route.params.page;
    const dto =  {
        "content":query
    }
    axiosInstance.post('/search/comment',dto,{
        headers:{
            token:token
        },
        params:{
            page:page.value,
            pageSize: pageSize.value
        }
    }).then(res=>{
        total.value = parseInt(res.data.record.count)
        data.value = JSON.parse(res.data.record.record)

        
    })

}




function querySearch(queryString, cb) {
    const results = searchHistory.value
        .filter((item) => item.toLowerCase().includes(queryString.toLowerCase()))
        .map((item) => ({ value: item }));
    cb(results);
}




// watch(
//     () => route.params.query,
//     () => {
//         initSearch();
//     }
// );
// watch(
//     () => route.params.page,
//     () => {
//         initSearch();
//     }
// );
// watch(() => route.params.type, () => {
//     () => {
//         initSearch();
//     }
// })
watch(
    () => route.params,
    () => {
        initSearch();
    }
);

onMounted(() => {
    initData();
    initSearch();
});
</script>

<style scoped>
.show {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    gap: 10px;

}

.left {
    border-right: 3px solid var(--el-border-color);
}

.bottom {
    display: flex;
    gap: 10px;
}

.container {
    width: 80%;
    margin: auto;
}

.head {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.search {
    width: 500px;
}
</style>