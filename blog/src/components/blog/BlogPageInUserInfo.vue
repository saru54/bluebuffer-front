<template>
    <div v-if="data">
        <BlogBriefPage v-for="blog of data" :key="blog.id" :blog="blog" :is-home="true"></BlogBriefPage>
    </div>
</template>
<script setup>
import BlogBriefPage from './BlogBriefPage.vue';
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
const { targetUserId } = defineProps(['targetUserId'])
const page = ref(1)
const pageSize = ref(10)
const data = ref(null)
function getData() {
    coreaxios.post("/blog/getByPageWithUserId", {
        page: page.value,
        pageSize: pageSize.value,
        userId: localStorage.getItem("userId"),
        targetUserId: targetUserId
    }, {
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {
        data.value = res.data.records
    })
}
onMounted(() => {
    getData()
})
</script>
<style scoped></style>