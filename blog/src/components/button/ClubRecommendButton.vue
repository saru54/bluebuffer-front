<template>
    <div @click="toClubRecommend" style="width: 100%;">
        广场
    </div>
</template>
<script setup>
import router from '@/routers/router';

function toClubRecommend() {
    router.push("/clubRecommendPage")
}
</script>