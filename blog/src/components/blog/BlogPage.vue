<template>
    <div v-if="blog != null" class="container">
        <el-card>
            <el-page-header :content="blog.title" @back="$router.back()">
                <template #content>
                    <UserLink :user-id="authorUserId" :username="userName" :user-image="userImage"></UserLink>

                </template>
                <h3>{{ blog.title }}</h3>
                <template #extra>
                    <div class="bar">
                        <el-text>{{ blog.clubName }}</el-text>
                        <el-image :src="blog.clubImage" lazy loading="lazy" fit="contain" class="barImage"></el-image>
                    </div>
                </template>
            </el-page-header>
            <div style="margin-bottom: 50px;">
                <el-image v-for="(image, index) of blog.images" :key="index" :src="image" lazy loading="lazy"
                    :fit="'contain'" class="blogimage"></el-image>
                <p>{{ blog.content }}</p>
            </div>
            <div class="tool">
                <LikeButton :blog-id="blogId" :like-condition="likeCondition" :like-count="likeCount"></LikeButton>
                <CreateTime :time="blog.createTime"></CreateTime>
            </div>

            <CommentPage v-for="(comment, index) of comments" :key="index" :comment="comment" :blog-id="blogId">
            </CommentPage>
            <el-pagination background :total="total" :page-size="pageSize" layout=" prev, pager, next"
                v-model:current-page="currentPage"></el-pagination>
            <el-tooltip effect="dark" content="回复" placement="right">
                <el-button type="primary" circle @click="respondDialogVisible = true" class="respondBlog">
                    <el-icon>
                        <CirclePlus />
                    </el-icon>
                </el-button>
            </el-tooltip>

            <el-dialog title="输入回复信息" width="600px" v-model="respondDialogVisible" @close="onClose" center>
                <el-input placeholder="输入回复信息" v-model="respondTextForBlog" type="textarea"></el-input>
                <UploadImage @uploaded="getImage" :max-upload="3"></UploadImage>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button size="small" @click="handleCancel">取 消</el-button>
                        <el-button size="small" type="primary" @click="respondBlog">确
                            定</el-button>
                    </div>
                </template>
            </el-dialog>

            <el-tooltip effect="dark" content="收藏" placement="right">
                <el-button circle @click="collectBlog" class="colletButton">
                    <img src="../../assets/image/collect.png" v-if="!collectConditon" style="height: 30px;">
                    <img src="../../assets/image/collected.png" v-if="collectConditon" style="height: 25px;">

                </el-button>

            </el-tooltip>
            <el-backtop :right="100" :bottom="100" />
        </el-card>
    </div>

</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import CommentPage from '../comment/CommentPage.vue';
import { ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';

import UploadImage from '../image/UploadImage.vue';
import LikeButton from '../like/LikeButton.vue';
import CreateTime from '../time/CreateTime.vue';
import UserLink from '../user/UserLink.vue';
import router from '@/routers/router';
import axiosInstance from '@/functions/axios';
const respondTextForBlog = ref(null)
const route = useRoute()
const blog = ref(null)
const respondDialogVisible = ref(false)
const blogId = parseInt(route.params.blogId)
const comments = ref(null)
const currentPage = ref(1)
const total = ref(null)
const commentImages = ref([])
const token = localStorage.getItem('jwt')
const userId = localStorage.getItem("userId")
const likeCondition = ref(false)
const likeCount = ref(0)
const pageSize = ref(20)
const collectConditon = ref(false)
const userName = ref(null)
const userImage = ref(null)
const authorUserId = ref(null)

// const commentForCommentLocationId = route.params.commentForComment
function getImage(url) {


    commentImages.value.push(url)
}
function collectBlog() {
    collectConditon.value = !collectConditon.value
    axiosInstance.post("/blog/collect", null, {
        headers: {
            token: token
        },
        params: {
            blogId: blogId
        }
    })
}
watch(currentPage, () => {


    axiosInstance.get('/comment/getByPageWithLocate', {
        params: {
            page: currentPage.value,
            pageSize: pageSize.value,
            blogId: blogId
        },
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {
        comments.value = res.data.record.records;

    })
})
function respondBlog() {
    const data = {
        content: respondTextForBlog.value,
        blogId: blogId,
        images: commentImages.value

    }
    axiosInstance.post("/comment/insert", data, {
        headers: {
            token: token
        }
    }
    ).then(res => {
        if (res.data.code === 201) {
            ElMessageBox.alert("成功")

            location.reload();
        }
    }).catch(e => {
        console.log(e);

    })


    respondDialogVisible.value = false
}
function getBlog() {
    axiosInstance.get('/blog/getById', {
        params: {
            blogId: blogId,

        },
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {

        blog.value = res.data.record;
        likeCondition.value = res.data.record.likeCondition
        likeCount.value = res.data.record.likeCount
        collectConditon.value = res.data.record.collectCondition
        userName.value = res.data.record.userName;
        userImage.value = res.data.record.userImage;
        authorUserId.value = res.data.record.userId;
    })
}
function getComments() {
    const commentLocationId = route.params.commentId
    axiosInstance.get('/comment/getByPageWithLocate', {
        params: {
            page: currentPage.value,
            pageSize: pageSize.value,
            blogId: blogId,
            commentId: commentLocationId
        },
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {


        comments.value = res.data.record.records;
        total.value = res.data.record.count;

        if (commentLocationId != null) {
            if (res.data.record.currentPage) {
                currentPage.value = res.data.record.currentPage;

            }


            setTimeout(() => {
                locate()
                router.push(`/blogPage/${blogId}`)
            }, 500);
        }



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

function locate() {
    const commentLocationId = route.params.commentId
    if (commentLocationId) {

        const item = document.getElementById(`comment-${commentLocationId}`);
        if (item) {

            item.scrollIntoView({ behavior: "smooth", block: "center" });
            item.style.borderBottom = "3px solid var(--el-color-primary)"
        }
    }
}
onMounted(() => {
    //获取blog数据
    getBlog()
    getComments()
    recordClick(blogId)
    // nextTick(() => {
    //     locate();
    // })
    // locateWithRetry()
})
function handleCancel() {
    respondDialogVisible.value = false
}
function onClose() {

}
// }
</script>
<style scoped>
.container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.blogimage {
    width: 50%;
    margin-top: 20px;
    margin-right: 20px;

}

.changecommentpagestyle {

    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.fontsizeslider {
    position: fixed;
    /* 固定在页面的某个位置 */
    right: 5px;
    /* 让它紧贴右侧滚动条 */
    top: 50%;
    /* 使其垂直居中，或根据需要调整 */
    transform: translateY(-50%);
    /* 垂直居中 */
    z-index: 1000;
    /* 确保它显示在其他元素上 */
}

.colletButton {
    position: fixed;
    right: 105px;
    bottom: 150px;
    z-index: 1000;
}

.respondBlog {
    position: fixed;
    right: 105px;
    bottom: 200px;
    z-index: 1000;
}

.barImage {
    width: 50px;
    height: 50px;
}

.bar {
    width: 50px;
    display: flex;
    flex-direction: column;
}

.tool {
    display: flex;
    justify-content: flex-end;
    height: 50px;
    padding-right: 10px;
    gap: 10px;
}
</style>