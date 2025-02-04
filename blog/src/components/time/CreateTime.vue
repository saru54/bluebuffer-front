<template>
    <el-text type="info">{{ timeShow }}</el-text>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const { time } = defineProps(['time']);
const timeShow = ref('UnKnown');

function handleTime() {
    if (!time) {
        timeShow.value = 'UnKnown';
        return;
    }

    const targetTime = dayjs(time);
    const now = dayjs();
    const diffInDays = now.diff(targetTime, 'day');

    if (diffInDays < 1) {
        // 24小时内
        timeShow.value = targetTime.fromNow();
    } else if (diffInDays < 30) {
        // 1天到30天之间
        timeShow.value = `${diffInDays} 天前`;
    } else if (diffInDays < 365) {
        // 超过1个月
        timeShow.value = targetTime.format('MM月DD日');
    } else {
        // 超过1年
        timeShow.value = targetTime.format('YYYY年MM月DD日');
    }
}

onMounted(handleTime);

// 如果 `time` 可能会变化，可以监听它
watch(() => time, handleTime, { immediate: true });
</script>

<style scoped></style>
