<template>
    <div class="container">

        <div class="search">
            <el-autocomplete v-model="input" placeholder="输入搜索内容" :fetch-suggestions="querySearch" clearable
                @select="handleSelect" @keyup.enter="search" />
        </div>


        <el-button type="primary" circle @click="search">
            <el-icon>
                <Search />
            </el-icon>
        </el-button>
        <!-- <el-button circle type="primary" @click="clearHistory"><el-icon>
                <CloseBold />
            </el-icon></el-button> -->
    </div>
</template>

<script setup>


import { ElMessageBox } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const input = ref('');
const userId = localStorage.getItem("userId")
const searchHistory = ref([]);
const key = userId + "-" + "searchHistory";


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
    const url = router.resolve({ path: `/searchPage/0/${input.value}/1` }).href
    window.open(url, '_blank')
}




function querySearch(queryString, cb) {
    const results = searchHistory.value
        .filter(item => item.toLowerCase().includes(queryString.toLowerCase()))
        .map(item => ({ value: item }));
    cb(results);
}
function insertHistory() {
    searchHistory.value.unshift(input.value);

    searchHistory.value = Array.from(new Set(searchHistory.value));
    searchHistory.value = searchHistory.value.filter(item => item.length < 20)

    localStorage.setItem(key, JSON.stringify(searchHistory.value));


}


function handleSelect() {

}
// function clearHistory() {
//     searchHistory.value = []
//     localStorage.setItem("searchHistory", null)
// }
</script>

<style scoped>
.search {
    width: 500px;
}

.container {
    display: flex;
}
</style>
