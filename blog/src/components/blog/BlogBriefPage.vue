<template>
    <div class="container" v-if="blog != null">
        <br>
        <div class="blog-berif-header">
            <div style="display: flex; gap: 10px;">
                <ClubLink v-if="isHome" :club-id="blog.club.id" :club-image="blog.club.image"
                    :club-name="blog.club.name" :disable="false">
                </ClubLink>

                <UserLink v-if="!isHome" :user-id="blog.user.id" :username="blog.user.name"
                    :user-image="blog.user.image">
                </UserLink>
                <CreateTime :time="blog.createTime"></CreateTime>
            </div>

            <el-popover width="50" v-if="blog.canDelete || blog.canEdit" trigger="click" placement="bottom">
                <el-menu style="border: none; ">
                    <el-menu-item v-if="blog.canEdit" @click="isEdit = !isEdit" index="1">
                        修改
                    </el-menu-item>
                    <el-menu-item index="2" v-if="blog.canDelete">

                        <el-popconfirm :icon="null" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="deleteBlog">

                            <template #reference>
                                <div style="width: 100%;">
                                    删除
                                </div>

                            </template>

                        </el-popconfirm>
                    </el-menu-item>
                </el-menu>

                <template #reference>
                    <el-button><el-icon>
                            <Tools />
                        </el-icon></el-button>
                </template>
            </el-popover>

        </div>
        <div v-if="isEdit">
            <el-input v-model="title" placeholder="请输入标题" style="margin-bottom: 10px;margin-top: 10px;" />
            <el-input v-model="content" type="textarea" :rows="5" placeholder="请输入内容" style="margin-bottom: 10px;" />
            <UploadImage v-model="images" @uploaded="getImage"></UploadImage>
            <div style="display: flex; gap: 10px;">
                <el-button @click="update">保存</el-button>
                <el-button @click="isEdit = false">取消</el-button>
            </div>
        </div>


        <div v-if="!isEdit" @click="toBlogPage">
            <h3>{{ title }}</h3>
            <pre v-if="isHome">{{ showContent }}</pre>
            <pre v-else>{{ content }}</pre>
            <el-image v-for="(image, index) of blog.images" :key="index" :src="image" lazy loading="lazy"
                :fit="'contain'" class="blogimage" :preview-src-list="blog.images"></el-image>
        </div>


        <div v-if="!isEdit" class="blog-brief-tools">
            <BlogLikeButton :blog-id="blog.id" :count="blog.likeCount" :condition="blog.like"></BlogLikeButton>
            <div>
                <el-tooltip effect="dark" content="评论数" placement="bottom">
                    <el-button>
                        <el-icon>
                            <ChatLineRound />

                        </el-icon>
                        <span>{{ blog.commentCount }}</span>
                    </el-button>
                </el-tooltip>
            </div>
            <BlogCollectButton :blog-id="blog.id" :condition="blog.collect"></BlogCollectButton>
            <TranslateComponent v-if="!isHome" :content="title + '\n' + content" @translated="translated">
            </TranslateComponent>
            <ShareButton>
            </ShareButton>
        </div>

    </div>



</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserLink from '../user/UserLink.vue';
import ShareButton from '../button/ShareButton.vue';
import BlogLikeButton from '../button/BlogLikeButton.vue';
import BlogCollectButton from '../button/BlogCollectButton.vue';
import CreateTime from '../time/CreateTime.vue';
import ClubLink from '../bar/ClubLink.vue';
import coreaxios from '@/functions/coreaxios';
import { ElNotification } from 'element-plus';
import UploadImage from '../image/UploadImage.vue';
import TranslateComponent from '../TranslateComponent.vue';
const userId = localStorage.getItem('userId')
const token = localStorage.getItem('jwt')
const { blog, isHome } = defineProps(["blog", "isHome"])
const router = useRouter()
const isEdit = ref(false)
const title = ref(null)
const content = ref(null)
const images = ref([])

function translated(result) {
    if (result && result.length > 0) {
        title.value = result[0].dst
        content.value = result.slice(1).map(item => item.dst).join('\n')
    }
}
function toBlogPage() {
    router.push(`/home/blogPage/${blog.id}`)
}
function deleteBlog() {
    coreaxios.post("/blog/delete", {
        userId: userId,
        id: blog.id
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "通知",
                message: "文章删除成功",

            })
        }
    })
}
const showContent = computed(() => {
    if (blog.content.length <= 200) {
        return blog.content
    }
    return blog.content.slice(0, 200) + "..."
})
function getImage(url) {
    images.value.push(url)
}
function update() {
    coreaxios.post("/blog/update", {
        id: blog.id,
        userId: userId,
        title: title.value,
        content: content.value,
        images: images.value
    }, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElNotification({
                title: "更新",
                content: "更新成功",
                type: "success"
            })
        }
    })
}
onMounted(() => {
    title.value = blog.title
    content.value = blog.content
    images.value = blog.images
})
</script>
<style scoped>
.blogimage {
    width: 25%;
    margin-top: 20px;
}

.blog-brief-tools {
    margin-top: 5px;
    display: flex;
    gap: 30px;
}

@media screen and (max-width: 768px) {
    .container {
        padding: 15px;
        margin: 5px;
        border-radius: 8px;
    }

    .blog-brief-tools {
        display: flex;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE and Edge */
        gap: 15px;
        padding-bottom: 5px;
    }

    .blog-brief-tools::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }

    .blog-berif-header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
    }
}

.container {
    /* background-color: #F2F4F7; */
    --el-card-bg-color: var(--el-fill-color-blank);
    padding: 5%;


    /* 添加平滑过渡效果 */
    gap: 10px;

    margin: 10px;
    border-radius: 3%;
    cursor: pointer;
}

.container:hover {
    background-color: var(--el-color-info-light-9);

}

.blog-berif-header {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

pre {
    white-space: pre-wrap;
    /* 保留空格和换行，并在需要时换行 */
    word-wrap: break-word;
    /* 允许长单词换行 */
    overflow-wrap: break-word;
    /* 兼容某些浏览器 */
}
</style>