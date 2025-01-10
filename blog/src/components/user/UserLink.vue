<template>
    <div @click="toUserPage">
        <el-avatar :size="50" :src="userImage" shape="square" v-if="userImage != null"></el-avatar>
        <el-link style="font-size: large;" type="primary" href="" target="_blank" :underline="false"
            v-if="username != null">{{
                username }}</el-link>
    </div>

</template>
<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const { username, userId, userImage } = defineProps(["username", 'userId', 'userImage'])


const router = useRouter()
function toUserPage() {
    const url = router.resolve({ path: `/userInfo/${userId}` }).href
    window.open(url, '_blank')
    // router.push(`/userInfo/${userId}`)
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