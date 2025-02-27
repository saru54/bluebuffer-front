<template>
    <div class="container">

        <div class="search">
            <el-autocomplete v-model="input" placeholder="输入搜索内容" :fetch-suggestions="querySearch" clearable
                @select="handleSelect" @keyup.enter="search">
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
                <template #default="{ item }">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <el-avatar shape="circle" :src="item.image"></el-avatar>
                        {{ item.name }}
                    </div>
                </template>
            </el-autocomplete>
        </div>



    </div>
</template>

<script setup>


import searchaxios from '@/functions/searchaxios';
import { searchStore } from '@/functions/searchstore';
import { ElMessageBox } from 'element-plus';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const input = ref('');
const userId = localStorage.getItem("userId")
const searchHistory = ref([]);
const key = "searchHistory" + "-" + userId;
const token = localStorage.getItem("jwt")
watch(input, () => {
    searchStore.query = input.value
})
function search() {

    if (input.value == null || input.value == "") {
        ElMessageBox.alert("搜索内容不能为空")

    }
    insertHistory()
    toSearchPage()

}
function initData() {
    const storedHistory = localStorage.getItem(key);
    try {
        const parsedHistory = JSON.parse(storedHistory);
        searchHistory.value = Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (e) {
        searchHistory.value = []
    }
}
onMounted(() => {

    initData()



});

function toSearchPage() {
    // const url = router.resolve({ path: `/searchPage/0/${input.value}/1` }).href
    // window.open(url, '_blank')
    const encodeSearchQuery = encodeURIComponent(input.value)
    console.log(encodeSearchQuery);

    router.push(`/home/search/0/${encodeSearchQuery}/1`)
}




function querySearch(queryString, cb) {
    if (queryString == null || queryString == "") {
        return
    }
    searchaxios.post("/search/club", {
        page: 1,
        pageSize: 5,
        content: input.value
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            const data = JSON.parse(res.data.record);
            cb(data)
        }
    })

}
function insertHistory() {
    searchHistory.value.unshift(input.value);

    searchHistory.value = Array.from(new Set(searchHistory.value));
    searchHistory.value = searchHistory.value.filter(item => item.length < 20)

    localStorage.setItem(key, JSON.stringify(searchHistory.value));


}



function handleSelect(item) {
    router.push("/home/clubPage/" + item.id)
}
// function clearHistory() {
//     searchHistory.value = []
//     localStorage.setItem("searchHistory", null)
// }
</script>

<style scoped>
.search {
    width: 500px;
    /* 电脑端固定宽度 */
    padding: 0 15px;
}

.container {
    display: flex;
    justify-content: center;
    width: 100%;
}

/* 添加媒体查询以适配移动设备 */
@media screen and (max-width: 768px) {
    .search {
        width: 100%;
        /* 移动端采用百分比宽度 */
        max-width: 500px;
        padding: 0 10px;
    }
}
</style>
