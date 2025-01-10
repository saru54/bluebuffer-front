<template>
    <div style="position: relative;" class="likecontainer">
        <el-button @click="like" circle>
            <img v-if="!likeConditionInner" src="../../assets/image/like.png" alt="like">
            <img v-if="likeConditionInner" src="../../assets/image/liked.png" alt="liked">
        </el-button>
        <div v-if="likeCountInner > 0"
            style="position: absolute; top: -5px; right: -10px; background-color: var(--el-color-primary);; color: white; border-radius: 50%; padding: 3px 6px; font-size: 10px;  text-align: center;">
            {{ likeCountShow }}
        </div>
    </div>
</template>

<script setup>

import axiosInstance from '@/functions/axios';
import { onMounted, ref, watch } from 'vue';

const { blogId, commentId, likeCondition, likeCount } = defineProps(['likeCondition', 'likeCount', 'blogId', "commentId"]);
const likeConditionInner = ref(false);
const likeCountInner = ref(null);
const likeCountShow = ref(null)
const token = localStorage.getItem("jwt");
watch(likeCountInner, () => {
    handleLike()
})
function handleLike() {
    if (likeCountInner.value > 1000) {
        likeCountShow.value = "1000+"
    } else {
        likeCountShow.value = likeCountInner.value
    }
}
function like() {
    likeConditionInner.value = !likeConditionInner.value;
    if (likeConditionInner.value) {
        likeCountInner.value += 1
    } else {
        likeCountInner.value -= 1
    }
    if (blogId != null) {
        axiosInstance.post("/blog/like", null, {
            params: {
                blogId: blogId,
                condition: likeConditionInner.value
            },
            headers: {
                token: token
            }
        });
    } else if (commentId != null) {
        axiosInstance.post("/comment/like", null, {
            params: {
                commentId: commentId,
                condition: likeConditionInner.value
            },
            headers: {
                token: token
            }
        });
    }
}
onMounted(() => {
    handleLike()
    likeCountInner.value = likeCount;
    likeConditionInner.value = likeCondition

})
</script>

<style scoped>
.active {
    background-color: var(--el-color-primary);
}

img {
    width: 25px;
}

.likecontainer {
    display: flex;
    align-items: center;
    width: 30px;
}
</style>
