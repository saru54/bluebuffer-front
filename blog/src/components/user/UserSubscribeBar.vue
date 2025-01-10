<template>
    <div class="contianer">
        <BarInfoForUserInfo v-for="(item, index) of subscribeClub" :key="index" :bar-info="item"></BarInfoForUserInfo>
        <el-pagination background :total="total" :page-size="pageSize" v-model:current-page="page"
            layout="total, sizes, prev, pager, next"></el-pagination>
    </div>
</template>
<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import BarInfoForUserInfo from '../bar/BarInfoForUserInfo.vue';
import axiosInstance from '@/functions/axios';

const page = ref(1)
const pageSize = ref(10)
const total = ref(null)
const userId = inject('userId')
const token = localStorage.getItem("jwt")
const subscribeClub = ref([])
watch(page, () => {
    getData()
})
function getData() {
    const data = {
        userId: userId,
        subscribe: true
    }
    axiosInstance.post("/club/getSubscribeClub", data, {
        headers: {
            token: token
        },
        params: {
            page: page.value,
            pageSize: pageSize.value
        }
    }).then(res => {
        subscribeClub.value = res.data.record.records
        total.value = res.data.record.count
    })
}
onMounted(() => {
    getData()
})
</script>
<style scoped>

</style>