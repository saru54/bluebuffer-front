<template>
    <div>
        <el-tooltip effect="dark" content="关注" placement="bottom">
            <el-button size="large" round @click="collect"
                :class="collectCondition ? 'blog-subscrie-btn-avtive' : null">
                <el-icon>
                    <Collection />

                </el-icon>
                <span v-if="collectCondition">
                    取消关注
                </span>
                <span v-if="!collectCondition">
                    关注
                </span>
            </el-button>
        </el-tooltip>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
const { userId, condition } = defineProps(["userId", "condition"])
const collectCondition = ref(false)
function collect() {
    coreaxios.post("/user/subscribe", null, {
        headers: {
            token: localStorage.getItem("jwt")
        },
        params: {
            userId: userId
        }
    }).then(() => {
        collectCondition.value = !collectCondition.value
    })
}
onMounted(() => {
    collectCondition.value = condition
})
</script>
<style scoped>
.blog-subscrie-btn-avtive {
    background-color: var(--el-color-primary-light-5);
}
</style>