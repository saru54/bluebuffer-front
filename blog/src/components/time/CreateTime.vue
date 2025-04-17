<template>
    <el-text type="info">{{ timeShow }}</el-text>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-cn';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { time } = defineProps(['time']);
const timeShow = ref('UnKnown');

function handleTime() {
    if (!time) {
        timeShow.value = 'UnKnown';
        return;
    }
    const targetTime = dayjs.utc(time).utcOffset(8);
    const now = dayjs();

    const diffInDays = now.diff(targetTime, 'day');
    if (diffInDays < 1) {
        timeShow.value = targetTime.fromNow();
    } else if (diffInDays < 30) {
        timeShow.value = `${diffInDays} 天前`;
    } else if (diffInDays < 365) {
        timeShow.value = targetTime.format('MM月DD日');
    } else {
        timeShow.value = targetTime.format('YYYY年MM月DD日');
    }
}


onMounted(handleTime);

watch(() => time, handleTime, { immediate: true });
</script>

<style scoped></style>
