<template>
    <div v-if="comment">

        <CommentBerifPage :comment="comment" :show-more="false"></CommentBerifPage>

        <div class="subcomment-page-container" v-for="(comment) of subcomments" :key="comment.id" :id="comment.id">
            <CommentBerifPage :comment="comment"></CommentBerifPage>
        </div>

        <div v-if="total > pageSize" class="comment-page-pagination">
            <el-pagination background :total="total" :page-size="pageSize" layout=" prev, pager, next"
                v-model:current-page="page"></el-pagination>
        </div>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import CommentBerifPage from './CommentBerifPage.vue';
import { onMounted, ref, watch } from 'vue';
const page = ref(1)
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('jwt')
const pageSize = ref(10)
const { commentId } = defineProps(['commentId'])
const comment = ref(null)
const subcomments = ref(null)
const total = ref(0)
function scrollTo() {
    const commentElement = document.getElementById(commentId);
    if (commentElement) {
        console.log("滑动");

        commentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
        console.log("没拿到");

    }
}
function getData() {
    coreaxios.post("comment/getCommentInfoWithLocate", {
        pageSize: pageSize.value,
        userId: userId,
        commentId: commentId
    },
        {
            headers: {
                token: token
            }
        }).then(res => {
            if (res.status == 200) {
                console.log(res.data);

                comment.value = res.data.comment

                if (res.data.subComments != null) {

                    subcomments.value = res.data.subComments.records
                    total.value = res.data.subComments.count
                    setTimeout(() => {
                        scrollTo()
                    }, 1000);
                }

            }
        })
}
function changePage() {
    coreaxios.post("/comment/getSubCommentByPage", {
        page: page.value,
        pageSize: pageSize.value,
        parentId: commentId,
        userId: userId
    })
}
watch(page, () => {
    changePage()
})
onMounted(() => {
    getData()
})
</script>
<style scoped>
.subcomment-page-container {
    border-left: 1px solid var(--el-border-color);
    margin-left: 30px;
    padding: 10px;
    display: flex;
}

.comment-page-pagination {
    display: flex;
    justify-content: center;
}
</style>