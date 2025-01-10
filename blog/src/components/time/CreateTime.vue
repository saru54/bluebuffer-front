<template>
    <el-text type="info">{{ timeShow }}</el-text>
</template>
<script setup>
import { onMounted, ref } from 'vue';


const { time } = defineProps(['time'])
const timeShow = ref(null)

function handleTime() {
    if (time != null) {
        const arr = time.split("T")
        timeShow.value = arr[0] + " " + arr[1]
    } else {
        timeShow.value = "UnKnown"
    }


}

onMounted(() => {

    handleTime();
})
</script>
<style scoped></style>