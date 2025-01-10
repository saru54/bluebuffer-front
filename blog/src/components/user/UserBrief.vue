<template>
    <el-card>
        <div>
            <h4>个人信息</h4>
        </div>
        <div class="info">
            <div class="infoleft">
                <el-image :src="user.image" lazy loading="lazy" fit=""></el-image>
            </div>
            <div class="inforight">
                <el-link type="primary" href="" target="_blank" :underline="false" @click="toUserInfo"><span>{{
                    user.name
                        }}</span></el-link>
            </div>

        </div>
        <div class="options">
            <el-button type="primary" @click="createBar">创建自己的吧</el-button>
        </div>
    </el-card>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { user } = defineProps(['user'])
const router = useRouter()
const userId = ref(1)
function toUserInfo() {
    // router.push(`/userInfo/${userId.value}`)
    const url = router.resolve({ path: `/userInfo/${userId.value}` }).href
    window.open(url, '_blank')
}
function createBar() {
    router.push('/createBarPage')

}
</script>
<style scoped>
.info {
    width: 100%;
    display: flex;
}

.infoleft {
    width: 50%;
    max-width: 120px;
    max-height: 120px;
}

.inforight {
    width: 47%;
    margin-left: 3%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;

}

.options {
    margin-top: 10px;
}
</style>