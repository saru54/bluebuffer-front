<template>
    <div class="contianer">
        <div class="header">
            <div class="img">
                <div class="barImg">
                    <el-image :src="barImage" lazy loading="lazy" fit="contain"></el-image>
                </div>

            </div>
            <div class="barInfoShow">
                <p>{{ barName }}</p>
                <el-text type="info" style="text-align: left;">{{ barDescription }}</el-text>
            </div>
            <div class="toolButtons">
                <div>
                    <p>关注数:{{ barSubscribeCount }}</p>
                    <el-button v-if="!subscribeCondition" type="primary" @click="subscribeBar">关注</el-button>
                    <el-button v-if="subscribeCondition" type="danger" @click="unSubscribeBar">取消关注</el-button>
                </div>
            </div>
        </div>
        <div class="main">
            <div class="left">
                <BarInfoBrief :bar-info="barInfo"></BarInfoBrief>
            </div>
            <div class="right">
                <BlogRecommendForBar :club-id="barId"></BlogRecommendForBar>
            </div>
        </div>
        <el-tooltip effect="dark" content="创建贴子" placement="right">
            <el-button type="primary" circle @click="createBlog" class="colletButton">
                <el-icon>
                    <CirclePlus />
                </el-icon>
            </el-button>

        </el-tooltip>
        <el-dialog title="输入贴子信息" width="600px" v-model="createBlogVisible" center>
            <el-input placeholder="输入贴子标题" v-model="createBlogTitle"></el-input>
            <el-input placeholder="输入贴子信息" v-model="createBlogContent" type="textarea"></el-input>
            <UploadImage @uploaded="getImageUrls" :max-upload="3"></UploadImage>
            <template #footer>
                <div class="dialog-footer">
                    <el-button size="small" @click="handleCancel">取 消</el-button>
                    <el-button size="small" type="primary" @click="comfrimcreateBlog" :loading="confirmLoading">确
                        定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import BarInfoBrief from './BarInfoBrief.vue';
import BlogRecommendForBar from '../blog/BlogRecommendForBar.vue';

import UploadImage from '../image/UploadImage.vue';
import axiosInstance from '@/functions/axios';
const barImage = ref(null);
const barName = ref(null);
const barDescription = ref(null)
const barSubscribeCount = ref(null)
const createBlogVisible = ref(false)
const createBlogTitle = ref(null)
const createBlogContent = ref(null)
const { barId } = defineProps(['barId'])
const subscribeCondition = ref(false)
const createBlogImageUrls = ref([])
const barInfo = ref({
    admin: {
        id: null,
        name: null
    },
    tags: [
        {
            id: 1,
            name: "游戏"
        }, {
            id: 2,
            name: "时尚"
        }
    ]
})
const token = localStorage.getItem("jwt")
const confirmLoading = ref(false)

onMounted(() => {
    getData()
})

function getImageUrls(url) {
    console.log(url);

    createBlogImageUrls.value.push(url)


}

function getData() {
    axiosInstance.get(`/club/getById?id=${barId}`, {
        headers: {
            token: localStorage.getItem("jwt")
        }
    }).then(res => {
        const data = res.data.record;
        barInfo.value.admin.id = data.adminId;
        barInfo.value.admin.name = data.adminName;
        barImage.value = data.imageUrl;
        barName.value = data.name;
        barDescription.value = data.description;
        subscribeCondition.value = data.subscribe
        barSubscribeCount.value = data.subscribeCount
    }).catch(e => {
        console.log(e);

    })
}
function subscribeBar() {
    axiosInstance.post("/club/subscribe", null, {
        params: {
            clubId: barId
        }, headers: {
            token: token
        }
    }).then(res => {
        if (res.data.code === 201) {
            subscribeCondition.value = !subscribeCondition.value
        }
    })
}
function unSubscribeBar() {
    axiosInstance.post("/club/unSubscribe", null, {
        params: {
            clubId: barId
        }, headers: {
            token: token
        }
    }).then(res => {
        if (res.data.code === 201) {
            subscribeCondition.value = !subscribeCondition.value
        }
    })

}
function createBlog() {
    createBlogVisible.value = true
}
function handleCancel() {
    createBlogVisible.value = false
}
async function comfrimcreateBlog() {
    const data = {
        title: createBlogTitle.value,
        text: createBlogContent.value,
        images: createBlogImageUrls.value,
        clubId: barId

    }
    console.log(data.images);

    const res = await axiosInstance.post("/blog/insert", data, {
        headers: {
            token: localStorage.getItem("jwt")
        }
    })

    if (res != null) {
        confirmLoading.value = true;
        createBlogVisible.value = false

        window.location.reload()
    }


}
</script>
<style scoped>
.contianer {
    margin-top: 20px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid var(--el-border-color);

}

.header {
    height: 300px;
    display: flex;
    border: 1px solid var(--el-border-color);
    gap: 20px;
    padding-left: 50px;
    --el-card-bg-color: var(--el-fill-color-blank);
}

.img {
    height: 100%;
    width: 200px;
    display: flex;
    align-items: center;

}

.barImg {
    width: 200px;
    height: 200px;
    border: 1px solid var(--el-border-color);
}

.barInfoShow {
    padding: 20px;
    justify-content: center;
    height: 100%;
    font-size: 40px;
    width: 50%;

    /* 设置文本左对齐 */
}

.colletButton {
    position: fixed;
    right: 80px;
    bottom: 150px;
    z-index: 1000;
}

.toolButtons {
    display: flex;
    align-items: center;

    justify-content: center;

    height: 100%;
}

.main {
    display: flex;
}

.left {
    width: 28%;
    margin-right: 2%;
    --el-card-bg-color: var(--el-fill-color-blank);
}

.right {
    width: 70%;


}
</style>