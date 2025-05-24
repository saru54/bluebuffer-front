<template>
    <div class="contianer" v-if="clubInfo">
        <div class="club-header">

            <el-image :src="clubInfo.backgroundImage || getDefualtBackgroundImage()" fit="fill"
                class="club-backgrondImage"></el-image>

            <el-avatar size="large" shape="circle" :src="image" class="club-image"></el-avatar>


            <div class="club-name-btn">
                <div class="club-name">
                    <h2>{{ clubInfo.name }}</h2>

                </div>
                <div class="club-button">
                    <ClubSubscribeButtton :club-id="clubInfo.id" :condition="clubInfo.subscribe"></ClubSubscribeButtton>
                </div>
            </div>


        </div>
        <div class="club-main">
            <div class="club-blog">
                <BlogRecommendInClub :club-id="clubInfo.id"></BlogRecommendInClub>
            </div>
            <div class="club-info">
                <el-card>
                    <div v-if="isEdit">
                        <UploadImage label="头像" v-model="images" @uploaded="getImage"></UploadImage>
                        <el-input v-model="description" type="textarea" :rows="5" placeholder="简介"
                            style="margin-bottom: 10px;" />

                        <div style="display: flex; gap: 10px;">
                            <el-button @click="update">保存</el-button>
                            <el-button @click="isEdit = false">取消</el-button>
                        </div>
                    </div>
                    <div v-if="!isEdit">
                        <div class="info-header">
                            <span class="info-title">{{ clubInfo.name }}</span>
                            <el-button v-if="validate()" @click="isEdit = !isEdit" type="primary" text>编辑</el-button>
                        </div>
                        <div class="info-content">
                            <el-text class="info-description">{{ clubInfo.description }}</el-text>
                            <!-- <div class="info-item">
                                <el-text type="info">创建时间:</el-text>
                                <CreateTime :time="clubInfo.createTime"></CreateTime>
                            </div> -->

                            <div class="info-item">
                                <el-text type="info">订阅数:</el-text>
                                <span>{{ clubInfo.subscribeCount || 0 }}</span>
                            </div>

                            <div class="info-item">
                                <el-text type="info">管理员:</el-text>
                                <div class="club_admin">
                                    <UserLink v-for="user of clubInfo.admins" :key="user.id" :user-id="user.id"
                                        :username="user.name" :user-image="user.image">
                                    </UserLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import coreaxios from '@/functions/coreaxios';
import ClubSubscribeButtton from '../button/ClubSubscribeButtton.vue';
import CreateTime from '../time/CreateTime.vue';
import BlogRecommendInClub from '../blog/BlogRecommendInClub.vue';
import UserLink from '../user/UserLink.vue';
import { getDefualtBackgroundImage } from '@/functions/randomimage';
import UploadImage from '../image/UploadImage.vue';
import { ElNotification } from 'element-plus';
const userId = localStorage.getItem("userId")
const { clubId } = defineProps(['clubId'])
const token = localStorage.getItem("jwt")
const clubInfo = ref(null)
const isEdit = ref(false)
const description = ref(null)
const images = ref([])
const image = ref(null)
function getImage(url) {
    image.value = url
}
onMounted(() => {
    getData()
})
const adminIds = ref([])
function getData() {
    coreaxios.post("/club/getClubInfo", null, {
        headers: {
            token: token
        }, params: {
            userId: userId,
            clubId: clubId
        }
    }).then(res => {
        clubInfo.value = res.data
        adminIds.value = clubInfo.value.admins.map(e => e.id)
        description.value = clubInfo.value.description
        image.value = clubInfo.value.image
    })

}
function validate() {
    if (adminIds.value.some(e => e == userId)) {
        return true
    } else {
        return false
    }
}
function update() {
    coreaxios.post("/club/update", {
        clubId: clubInfo.value.id,
        userId: userId,
        description: description.value,
        image: image.value
    }, {
        headers: {
            token: token
        },
        params: {

            clubId: clubInfo.value.id,
            userId: userId


        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "更新",
                content: "更新成功",
                type: "success"
            })
        } else {
            ElNotification({
                title: "更新",
                content: "更新失败",
                type: "error"
            })
        }
    })
}


</script>
<style scoped>
.contianer {
    margin-top: 10px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

.club-main {
    width: 100%;
    display: flex;
    flex-direction: column;
}

@media screen and (min-width: 768px) {
    .contianer {
        width: 80%;
    }

    .club-main {
        flex-direction: row;
    }
}

.club-blog {
    width: 100%;
    min-width: auto;
}

.club-info {
    width: 100%;
    min-width: auto;
    margin-top: 20px;
}

@media screen and (min-width: 768px) {
    .club-blog {
        min-width: 800px;
    }

    .club-info {
        width: 350px;
        min-width: 350px;
        margin-top: 0;
    }
}

.club-header {
    position: relative;
    height: 250px;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
}

.club-backgrondImage {
    height: 200px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    object-fit: cover;
}

.club-image {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 150px;
    /* 背景图片底部对齐 */
    left: 50px;
    /* 固定头像左侧位置 */
    z-index: 3;
    border-radius: 50%;
    border: 2px solid var(--el-border-color-light);
    /* 添加边框修饰 */
}

.club-name-btn {
    position: absolute;
    top: 200px;
    left: 180px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
}

@media screen and (min-width: 768px) {
    .club-header {
        height: 300px;
    }

    .club-name-btn {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.club-name {
    font-size: 24px;
    font-weight: bold;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    /* 防止文字换行 */
    overflow: hidden;
    /* 防止文字超出 */
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
}

.club-button el-button {
    margin-left: auto;
}

.club_admin {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.club-info::-webkit-scrollbar {
    width: 8px;
}

.club-info::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
}

.club-info:hover::-webkit-scrollbar-thumb {
    background: #888;
}

.info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}

.info-title {
    font-size: 18px;
    font-weight: bold;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.info-description {
    color: var(--el-text-color-secondary);
    line-height: 1.5;
}

.info-item {
    display: flex;

    gap: 8px;
    justify-content: center;
}
</style>