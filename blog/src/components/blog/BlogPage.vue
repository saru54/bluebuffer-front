<template>
    <div class="blog-page-container">
        <div class="blog-page-content">
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



                <el-dialog title="输入回复信息" :width="isMobile ? '90%' : '600px'" v-model="respondDialogVisible"
                    @close="onClose" :modal-class="'respond-dialog'" center>
                    <el-input placeholder="输入回复信息" v-model="respondTextForBlog" type="textarea"
                        :autosize="{ minRows: 6 }">
                    </el-input>
                    <UploadImage v-model="commentImages" @uploaded="getImage" :max-upload="3">
                    </UploadImage>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button size="small" @click="handleCancel">取 消</el-button>
                            <el-button size="small" type="primary" @click="respondBlog">确 定</el-button>
                        </div>
                    </template>
                </el-dialog>



            </div>
            <div class="blog-page-right">
                <div></div>
                <ClubInfo v-if="blog != null" :club-id="blog.club.id"></ClubInfo>
            </div>
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

const isMobile = ref(window.innerWidth <= 768)

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
            location.reload();

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
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768
    })
})
function handleCancel() {
    respondDialogVisible.value = false
}
function onClose() {

}
// }
</script>
<style scoped>
.blog-page-container {
    margin-top: 10px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.blog-page-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.blog-page-left {
    width: 100%;
    min-width: auto;
}

.blog-page-right {
    margin-top: 100px;
}

.blog-page-tools {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
}

.blog-page-sort {
    display: flex;
    width: 150px;
    margin-left: 20px;
}

.blog-page-locate-comment {
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 5%;
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
    border: 1px solid var(--el-border-color);
}

/* 添加媒体查询来处理移动端样式 */
@media screen and (max-width: 768px) {
    .blog-page-container {
        padding: 0 10px;
    }

    .blog-page-content {
        flex-direction: column;
    }

    .blog-page-tools {
        gap: 15px;
    }

    .blog-page-sort {
        width: 100%;
        margin-left: 0;
    }

    .blog-page-right {
        margin-top: 20px;
    }

    :deep(.el-dialog) {
        margin: 5vh auto !important;
    }

    :deep(.el-dialog__body) {
        padding: 15px !important;
    }

    :deep(.el-dialog__footer) {
        padding: 10px !important;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

/* 添加全局样式确保对话框正确显示 */
:deep(.respond-dialog) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20vh !important;
}

@media screen and (max-width: 768px) {


    :deep(.respond-dialog) {
        margin-top: 15vh !important;
    }

    :deep(.el-dialog) {
        margin: 0 auto !important;
        margin-top: 100px !important;
        max-height: 80vh;
        overflow-y: auto;
    }
}
</style>