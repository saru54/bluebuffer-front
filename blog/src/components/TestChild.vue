<template>
    <el-text v-loading="loading">{{ saruName }}</el-text>

</template>
<script setup>
import { inject, onMounted, ref } from 'vue';
import { useEventListener } from '@/functions/event';
const loading = ref(true)
const saruName = inject('saruName')

useEventListener(window, "click", (e) => {
    console.log("点击");

})
onMounted((() => {
    if (saruName != null) {
        loading.value = false
    }
}))
</script>
<style scoped></style>