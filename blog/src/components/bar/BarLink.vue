<template>
    <div @click="toBarPage">
        <el-avatar :size="50" :src="barImage" shape="square" v-if="barImage != null"></el-avatar>
        <el-link type="primary" href="" target="_blank" :underline="false" v-if="barname != null">{{
            barname }}</el-link>
    </div>

</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { barname, barId, barImage } = defineProps(["barname", 'barId', 'barImage'])


const router = useRouter()
function toBarPage() {
    const url = router.resolve({ path: `/barPage/${barId}` }).href
    window.open(url, '_blank')
    // router.push(`/barPage/${barId}`)
}
onMounted(() => {

})
</script>
<style scoped>
div {
    display: flex;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
}
</style>