<template>
    <div>
        <el-tooltip effect="dark" content="点赞数" placement="bottom">
            <el-button @click="like" :class="likeCondition ? 'blog-like-btn-active' : ''">
                <el-icon>
                    <Coffee />
                </el-icon>
                <span>
                    {{ likeCount }}
                </span>
            </el-button>
        </el-tooltip>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
const { commentId, count, condition } = defineProps(['count', "commentId", "condition"])
const likeCount = ref(null)
const likeCondition = ref(false)
function like() {
    coreaxios.post("/comment/like", null, {
        headers: {
            token: localStorage.getItem("jwt")
        },
        params: {
            commentId: commentId
        }
    }).then(() => {
        if (likeCondition.value) {
            likeCount.value--;
        } else {
            likeCount.value++;
        }
        likeCondition.value = !likeCondition.value
    })
}
onMounted(() => {
    likeCount.value = count
    likeCondition.value = condition


})
</script>
<style scoped>
.blog-like-btn-active {
    background-color: var(--el-color-primary-light-5);
}
</style>