<template>
    <div>
        <el-tooltip effect="dark" content="收藏" placement="bottom">
            <el-button @click="collect" :class="collectCondition ? 'blog-subscrie-btn-avtive' : null">
                <el-icon>
                    <Collection />

                </el-icon>
                <span v-if="collectCondition">
                    取消
                </span>
                <span v-if="!collectCondition">
                    收藏
                </span>
            </el-button>
        </el-tooltip>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
const { blogId, condition } = defineProps(["blogId", "condition"])
const collectCondition = ref(false)
function collect() {
    coreaxios.post("/blog/collect", null, {
        headers: {
            token: localStorage.getItem("jwt")
        },
        params: {
            blogId: blogId
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