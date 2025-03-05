<template>
    <div class="comment-page-container" v-if="data">
        <div v-for="(comment) of data" :key="comment.id">
            <CommentBerifPage :comment="comment" :show-more="true">
            </CommentBerifPage>
            <!-- <div class="comment-berif-tools">
                <CommentLikeButtton :comment-id="comment.id" :condition="comment.like" :count="comment.likeCount">
                </CommentLikeButtton>
                <ShareButton></ShareButton>
                <ReplyCommentButton :comment="comment"></ReplyCommentButton>
                <el-button @click="subCommentVisible = !subCommentVisible">展开回复</el-button>
            </div>
            <div>
                <SubCommentPage v-if="subCommentVisible" :comment-id="comment.id"></SubCommentPage>
            </div> -->
        </div>

        <div v-if="total > pageSize" class="comment-page-pagination">
            <el-pagination background :total="total" :page-size="pageSize" layout=" prev, pager, next"
                v-model:current-page="page"></el-pagination>
        </div>

    </div>
</template>
<script setup>

import { onMounted, ref, watch } from 'vue';
import coreaxios from '@/functions/coreaxios';
import CommentBerifPage from './CommentBerifPage.vue';
// import CommentLikeButtton from '../button/CommentLikeButtton.vue';
// import ShareButton from '../button/ShareButton.vue';
// import ReplyCommentButton from '../button/ReplyCommentButton.vue';
// import SubCommentPage from './SubCommentPage.vue';
const { blogId } = defineProps(["blogId"])
const pageSize = ref(10)
const page = ref(1)
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")
const total = ref(null)
const data = ref(null)
// const subCommentVisible = ref(false)
function getData() {
    coreaxios.post("/comment/getByPage", {
        page: page.value,
        pageSize: pageSize.value,
        parentId: blogId,
        userId: userId
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        data.value = res.data.records
        total.value = res.data.count;
        console.log(res.data);

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
.comment-page-container {
    border-radius: 3%;
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 5%;
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
}

.comment-page-container:hover {
    background-color: var(--el-color-info-light-9);



}

.comment-page-pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.comment-berif-tools {
    margin-top: 5px;
    display: flex;
    gap: 30px;
    padding: 8px;
}
</style>