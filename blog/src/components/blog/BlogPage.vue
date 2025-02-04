<template>
    <div class="blog-page-container">
        <div class="blog-page-left">
            <div class="blog-page-header" v-if="blog != null">
                <BlogBriefPage :blog="blog" :is-home="false"></BlogBriefPage>

            </div>
            <div class="blog-page-tools">
                <div class="blog-page-sort">
                    <el-text type="info">排序:</el-text>
                    <el-select v-model="sortRule" placeholder="">
                        <el-option v-for="rule in sortRules" :key="rule" :label="rule" :value="rule"></el-option>
                    </el-select>
                </div>
                <div>
                    <el-input placeholder="搜索评论"></el-input>
                </div>
                <div>
                    <el-button style="width: 100px;" @click="respondDialogVisible = true">回复</el-button>
                </div>
            </div>
            <div class="blog-page-locate-comment" v-if="commentId != '' && commentId != null">

                <LocateComment :comment-id="commentId"></LocateComment>
            </div>
            <CommentPage :blog-id="blogId">
            </CommentPage>



            <el-dialog title="输入回复信息" width="600px" v-model="respondDialogVisible" @close="onClose" center>
                <el-input placeholder="输入回复信息" v-model="respondTextForBlog" type="textarea"
                    :autosize="{ minRows: 8 }"></el-input>
                <UploadImage v-model="commentImages" @uploaded="getImage" :max-upload="3"></UploadImage>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button size="small" @click="handleCancel">取 消</el-button>
                        <el-button size="small" type="primary" @click="respondBlog">确
                            定</el-button>
                    </div>
                </template>
            </el-dialog>



        </div>
        <div class="blog-page-right">
            <div></div>
            <ClubInfo v-if="blog != null" :club-id="blog.club.id"></ClubInfo>
        </div>


    </div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import CommentPage from '../comment/CommentPage.vue';
import { ElNotification } from 'element-plus';
import { useRoute } from 'vue-router';

import UploadImage from '../image/UploadImage.vue';

import coreaxios from '@/functions/coreaxios';
import BlogBriefPage from './BlogBriefPage.vue';
import ClubInfo from '../bar/ClubInfo.vue';
import LocateComment from '../comment/LocateComment.vue';
const respondTextForBlog = ref(null)
const route = useRoute()
const blog = ref(null)
const respondDialogVisible = ref(false)
const blogId = route.params.blogId
const commentId = route.params.commentId
const commentImages = ref([])
const token = localStorage.getItem('jwt')
const userId = localStorage.getItem("userId")


const sortRule = ref("时间升序")
const sortRules = ref(["时间降序", "时间升序", "热门"])

function getImage(url) {
    commentImages.value.push(url)
}
function respondBlog() {
    const data = {
        content: respondTextForBlog.value,
        userId: userId,
        parentId: blogId,
        respondUserId: blog.value.user.id,
        images: commentImages.value,
        blogId: blogId

    }
    coreaxios.post("/comment/insert", data, {
        headers: {
            token: token
        }
    }
    ).then(res => {
        if (res.status === 200) {

            ElNotification({
                title: "通知",
                message: "评论成功",

            })

        } else {
            ElNotification({
                title: "通知",
                message: "评论失败",
                type: "error"
            })
        }
    })
    respondDialogVisible.value = false
}
function getBlog() {
    coreaxios.post('/blog/getBlogInfo', {
        blogId: blogId,
        userId: userId
    }, {
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {

        blog.value = res.data;


    })
}
let clickHitsory = JSON.parse(localStorage.getItem(userId + "-" + "clickHistory")) || [];
function recordClick(id) {
    clickHitsory.push(id)
    clickHitsory = clickHitsory.filter((value, index) =>
        clickHitsory.indexOf(value) === index
    )
    localStorage.setItem(userId + "-" + "clickHistory", JSON.stringify(clickHitsory))


}


onMounted(() => {
    getBlog()
    recordClick(blogId)
})
function handleCancel() {
    respondDialogVisible.value = false
}
function onClose() {

}
// }
</script>
<style scoped>
.blog-page-sort {
    display: flex;
    width: 150px;
    margin-left: 20px;
}

.blog-page-container {
    margin-top: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
}

.blog-page-left {
    width: 80%;
    min-width: 800px;
}

.blog-page-right {
    margin-top: 100px;
}

.blog-page-tools {
    display: flex;
    gap: 30px;
}

.blog-page-locate-comment {
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 5%;
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
    border: 1px solid var(--el-border-color);
}
</style>