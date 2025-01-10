<template>
    <!-- <el-button type="primary" @click="subscribe">{{ subscribeCondition ? "取消订阅" : "订阅" }}</el-button> -->
    <el-button v-if="!subscribeCondition" type="primary" @click="subscribe">关注</el-button>
    <el-button v-if="subscribeCondition" type="danger" @click="subscribe">取消关注</el-button>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const { isSubscribe, userId } = defineProps(["isSubscribe", "userId"])
const subscribeCondition = ref(false)
function subscribe() {

    axios.post("http://localhost:8080/user/subscribe", null, {
        headers: {
            token: localStorage.getItem("jwt")
        },
        params: {
            userId: userId
        }
    }).then(() => {
        subscribeCondition.value = !subscribeCondition.value
    })
}
onMounted(() => {
    subscribeCondition.value = isSubscribe
})
</script>
<style scoped></style>