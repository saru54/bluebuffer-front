<template>
    <el-text type="info">{{ timeShow }}</el-text>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 注册插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { time } = defineProps(['time']);
const timeShow = ref('UnKnown');

function handleTime() {
    if (!time) {
        timeShow.value = 'UnKnown';
        return;
    }

    // 假设 time 是服务器本地时间（例如：America/Los_Angeles）
    const targetTime = dayjs.tz(time, 'America/Los_Angeles').tz('Asia/Shanghai');  // 转换为北京时间
    const now = dayjs().tz('Asia/Shanghai');

    if (!targetTime.isValid()) {
        timeShow.value = 'UnKnown';
        return;
    }

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