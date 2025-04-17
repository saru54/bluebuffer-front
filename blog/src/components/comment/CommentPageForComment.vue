<template>
    <div ref="card" v-if="showComents == true">
        <el-card v-if="commentsForComment.records.length > 0">
            <el-row :gutter="0">
                <!-- 遍历分页后的评论数据 -->
                <el-col :span="24" v-for="(item, index) in comments" :key="index">
                    <div class="commentContainer">
                        <div class="main">
                            <div class="res">
                                <div v-if="item.userId != item.respondUserId">
                                    <UserLink :username="item.userName" :userId="item.userId"
                                        :user-image="item.userImage">
                                    </UserLink>
                                    <el-text size="small">回复: </el-text>
                                    <UserLink :user-image="item.respondUserImage" :username="item.respondUserName"
                                        :userId="item.respondUserId"></UserLink>
                                </div>
                                <div v-if="item.userId == item.respondUserId">
                                    <UserLink :username="item.userName" :userId="item.userId"
                                        :user-image="item.userImage">
                                    </UserLink>
                                </div>
                            </div>
                            <div class="content">
                                <el-text size="large">:{{ item.content }}</el-text>
                            </div>
                        </div>
                        <div class="foot">
                            <el-link type="primary" href="" target="_blank" class="respondButton"
                                @click="handleClick(item.userId)">回复</el-link>
                            <CreateTime :time="item.createTime"></CreateTime>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-dialog title="输入回复信息" width="600px" v-model="respondDialogVisible" @close="onClose" center>
                <el-input placeholder="输入回复信息" v-model="respondTextForComment" type="textarea"></el-input>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button size="small" @click="handleCancel">取 消</el-button>
                        <el-button size="small" type="primary" @click="respondComment">确
                            定</el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 分页组件 -->
            <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize"
                v-model:current-page="currentPage">
            </el-pagination>
        </el-card>
    </div>

</template>

<script setup>

import { ref, onMounted, watch } from 'vue';
import UserLink from '../user/UserLink.vue';

import { ElMessageBox } from 'element-plus';
import CreateTime from '../time/CreateTime.vue';
import axiosInstance from '@/functions/axios';

const { commentsForComment, commentId, showComents, blogId } = defineProps(['commentsForComment', 'commentId', "showComents", 'blogId']);
const card = ref(null)
const token = localStorage.getItem("jwt")

const currentPage = ref(1); // 当前页
const pageSize = ref(10); // 每页显示的评论数量
const total = ref(0);
const respondDialogVisible = ref(false)
const comments = ref([])
const respondUserId = ref(null)
function updateData() {
    axiosInstance.get("/comment/getCommentByPage", {
        headers: {
            token: token
        },
        params: {
            page: currentPage.value,
            commentId: commentId,
            pageSize: pageSize.value
        }
    }).then(res => {
        comments.value = res.data.record.records
        total.value = res.data.record.count
        card.value.scrollIntoView({ behavior: 'smooth', block: 'start' });

    })
}
watch(currentPage, () => {
    axiosInstance.get("/comment/getCommentByPage", {
        headers: {
            token: token
        },
        params: {
            page: currentPage.value,
            commentId: commentId,
            pageSize: pageSize.value
        }
    }).then(res => {
        comments.value = res.data.record.records
        total.value = res.data.record.count
        card.value.scrollIntoView({ behavior: 'smooth', block: 'start' });

    })
})

const respondTextForComment = ref(null)
function handleClick(respondId) {
    respondDialogVisible.value = true
    console.log(respondId);
    respondUserId.value = respondId
}
function handleCancel() {
    respondDialogVisible.value = false
}
function respondComment() {
    const data = {
        content: respondTextForComment.value,
        commentId: commentId,
        respondUserId: respondUserId.value,
        blogId: blogId
    }
    console.log(data);


    axiosInstance.post("/comment/insertComment", data, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.data.code === 201) {
            ElMessageBox.alert("成功")
            location.reload();
        }
    })


    respondDialogVisible.value = false;
}
function onClose() {

}
onMounted(() => {
    comments.value = commentsForComment.records;
    total.value = commentsForComment.count



})
</script>

<style scoped>
.commentContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.main {
    display: flex;
    gap: 10px;
}

.img {
    flex-shrink: 0;
}

.el-image {
    height: 50px;
    width: 50px;
}

.res {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 5px;
}

.content {
    flex-grow: 1;
    font-size: 16px;
    word-wrap: break-word;
    display: flex;
    align-items: center;
}

.foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 5px;
}

.respondButton {
    margin-right: 20px;
}

.time {
    margin-right: 10px;
}
</style>
