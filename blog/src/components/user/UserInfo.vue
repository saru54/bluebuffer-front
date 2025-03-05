<template>
    <div class="user-info-contianer" v-if="data">
        <div class="user-info-mobile-header">
            <div class="user-info-header">
                <el-avatar style="width: 150px; height: 150px; margin-right: 20px;" size="large"
                    :src="data.image"></el-avatar>
                <h1 style="font-size: 50px; color: var(--el-color-info-dark-2); margin: 0;">{{
                    data.name }}</h1>
            </div>
            <div class="user-info-right-mobile">
                <div v-if="!isSelf"
                    style="display: flex; gap: 10px; align-items: center; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <el-button round size="large" @click="toChat">私信</el-button>
                    <UserSubscribeButton :user-id="targetUserId" :condition="data.subscribe"></UserSubscribeButton>
                </div>
                <div
                    style="display: flex; gap: 10px; align-items: center; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <el-text type="info">{{ data.description }}</el-text>
                </div>
                <div style="display: flex; gap: 15px; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <p>{{ data.blogCount }}</p>
                        <el-text type="info">动态数</el-text>
                    </div>
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <p>{{ data.fansCount }}</p>
                        <el-text type="info">粉丝数</el-text>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-info-left">
            <div class="user-info-header desktop-only">
                <el-avatar style="width: 150px; height: 150px; margin-right: 20px;" size="large"
                    :src="data.image"></el-avatar>
                <h1 style="font-size: 50px; color: var(--el-color-info-dark-2); margin: 0;">{{
                    data.name }}</h1>
            </div>
            <div class="user-info-tools">
                <el-segmented style="width: 100%;" v-model="current" :options="options" block />
            </div>
            <div class="user-info-show">
                <div v-if="current == options[0]">
                    <BlogPageInUserInfo :target-user-id="targetUserId"></BlogPageInUserInfo>

                </div>
                <div v-if="current == options[1]">


                </div>
            </div>
        </div>

        <div class="user-info-right" ref="userInfoRef" :style="[stickyStyle]">
            <div>
                <h2 style="padding: 8px;">{{ data.name }}</h2>
                <div v-if="!isSelf"
                    style="display: flex; gap: 10px; align-items: center; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <el-button round size="large" @click="toChat">私信</el-button>
                    <UserSubscribeButton :user-id="targetUserId" :condition="data.subscribe"></UserSubscribeButton>
                </div>
                <div
                    style="display: flex; gap: 10px; align-items: center; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <el-text type="info">{{ data.description }}</el-text>
                </div>
                <div style="display: flex; gap: 15px; border-bottom: 0.5px solid var(--el-border-color); padding: 8px;">
                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <p>{{ data.blogCount }}</p>
                        <el-text type="info">动态数</el-text>
                    </div>

                    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <p>{{ data.fansCount }}</p>
                        <el-text type="info">粉丝数</el-text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import UserSubscribeButton from '../button/UserSubscribeButton.vue';
import BlogPageInUserInfo from '../blog/BlogPageInUserInfo.vue';
import { chatModelStore } from '@/functions/chat';
import router from '@/routers/router';
import { ElMessage } from 'element-plus';
const data = ref(null)
const route = useRoute()
const targetUserId = route.params.userId
const userId = localStorage.getItem("userId")
const token = localStorage.getItem("jwt")
const current = ref('动态')
const options = ['动态', '评论']
const userInfoRef = ref(null);
const initialOffsetTop = ref(0);
const stickyStyle = ref({});
const isSelf = computed(() => userId == targetUserId)
function toChat() {
    chatModelStore.send({ name: data.value.name, image: data.value.image, id: data.value.id })
    chatModelStore.toggle()
}
function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > initialOffsetTop.value) {
        stickyStyle.value = {
            transform: `translateY(${scrollY * 1.2 - initialOffsetTop.value}px)`,
            position: 'relative',
            transition: 'transform 0.3s ease-out ',


        };
    } else {
        stickyStyle.value = {};
    }
}
function getData() {
    coreaxios.post("/user/getUserInfo", {
        userId: userId,
        targetUserId: targetUserId,
    }, {

        headers: {
            token: token
        }
    }).then(res => {
        data.value = res.data
        nextTick(() => {
            if (userInfoRef.value) {
                initialOffsetTop.value = userInfoRef.value.offsetTop;
            }
        });
    })

}

onMounted(() => {

    getData()
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 100);
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>
<style scoped>
.user-info-contianer {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    overflow: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 20px;
}

.user-info-mobile-header {
    display: none;
}

.user-info-left {
    width: 70%;
    min-width: auto;
}

.user-info-right {
    max-width: 30%;
    min-width: 300px;
}

.user-info-header {
    flex-wrap: wrap;
    gap: 20px;
}

.user-info-right-mobile {
    display: none;
}

@media screen and (max-width: 768px) {
    .user-info-contianer {
        flex-direction: column;
        padding: 10px;
    }

    .user-info-mobile-header {
        display: block;
        margin-bottom: 20px;
    }

    .user-info-left {
        width: 100%;
    }

    .user-info-right {
        display: none;
    }

    .user-info-right-mobile {
        display: block;
    }

    .user-info-header {
        height: auto;
        padding: 20px 0;
    }

    .user-info-header h1 {
        font-size: 30px !important;
    }

    .user-info-tools {
        width: 100%;
        margin-top: 15px;
        padding: 0 10px;
    }

    .user-info-tools .el-segmented {
        width: 100% !important;
    }

    .el-avatar {
        width: 100px !important;
        height: 100px !important;
    }

    .desktop-only {
        display: none;
    }
}

.user-info-tools {
    width: 80%;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
}

.user-info-tools .el-segmented {
    --el-segmented-item-selected-color: var(--el-text-color-primary);
    --el-segmented-item-selected-bg-color: var(--el-color-info-light-5);
    --el-border-radius-base: 16px;
}
</style>