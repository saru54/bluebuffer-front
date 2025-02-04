<template>
    <div @click="toBarPage">
        <el-avatar :size="50" :src="clubImage" shape="circle" v-if="clubImage != null"></el-avatar>
        <el-link type="default" href="" target="_blank" :underline="false" v-if="clubName != null">{{
            clubName }}</el-link>
    </div>

</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { clubName, clubId, clubImage, disable } = defineProps(["clubName", 'clubId', 'clubImage', 'disable'])


const router = useRouter()
function toBarPage() {
    if (disable == false) {
        router.push(`/home/clubPage/${clubId}`)
    }

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