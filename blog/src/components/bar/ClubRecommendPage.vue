<template>
    <div v-if="data" class="club-rec-container">
        <h1>广场</h1>
        <el-row :gutter="10">
            <el-col v-for="(club, index) of data" :key="index" :xs="24" :sm="12" :md="8" class="club-rec-item">
                <ClubBriefPage :club="club"></ClubBriefPage>
            </el-col>
        </el-row>
        <div class="club-rec-bottom">
            <el-button @click="showMore">显示更多</el-button>
        </div>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
import ClubBriefPage from './ClubBriefPage.vue';
const page = ref(1)
const pageSize = ref(9)
const total = ref(0)
const data = ref(null)
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")
function getData() {
    coreaxios.post("/club/getByPage", {
        page: page.value,
        pageSize: pageSize.value,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        data.value = res.data.records
        total.value = res.data.count
    })
}
function showMore() {

}
onMounted(() => {
    getData()
})
</script>
<style scoped>
.club-rec-container {
    width: 95%;
    max-width: 1200px;
    margin: auto;
    padding: 0 10px;
}

.club-rec-bottom {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}

.club-rec-item {
    margin-bottom: 20px;
}
</style>