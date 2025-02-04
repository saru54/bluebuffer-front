<template>
    <div class="subcomment-page-container">
        <div v-for="(comment) of data" :key="comment.id">
            <CommentBerifPage :comment="comment" :show-more="true"></CommentBerifPage>
            <!-- <div class="comment-berif-tools">
                <CommentLikeButtton :comment-id="comment.id" :condition="comment.like" :count="comment.likeCount">
                </CommentLikeButtton>
                <ShareButton></ShareButton>
                <ReplyCommentButton :comment="comment"></ReplyCommentButton>
            </div> -->
        </div>
        <div v-if="total > pageSize" class="comment-page-pagination">
            <el-pagination background :total="total" :page-size="pageSize" layout=" prev, pager, next"
                v-model:current-page="page"></el-pagination>
        </div>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref, watch } from 'vue';
import CommentBerifPage from './CommentBerifPage.vue';
// import CommentLikeButtton from '../button/CommentLikeButtton.vue';
// import ShareButton from '../button/ShareButton.vue';
// import ReplyCommentButton from '../button/ReplyCommentButton.vue';
const { commentId } = defineProps(['commentId'])
const token = localStorage.getItem("jwt")
const userId = localStorage.getItem("userId")
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const data = ref(null)
function getData() {
    coreaxios.post("/comment/getSubCommentByPage", {
        page: page.value,
        pageSize: pageSize.value,
        parentId: commentId,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        data.value = res.data.records;
        total.value = res.data.count;
    })
}
watch(page, () => {
    getData()
})
onMounted(() => {
    getData()
})
</script>
<style scoped>
.comment-berif-tools {
    margin-top: 5px;
    display: flex;
    gap: 30px;
    padding: 8px;
}

.subcomment-page-container {
    border-left: 1px solid var(--el-border-color);
    margin-left: 30px;
    padding: 10px;
}
</style>