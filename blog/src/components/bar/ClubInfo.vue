<template>
    <div v-if="clubInfo" ref="clubInfoRef" class="club-info" :style="stickyStyle">
        <el-text type="info">{{ clubInfo.description }}</el-text>
        <div>
            <!-- <el-text type="info" size="large">创建时间:</el-text>
            <CreateTime :time="clubInfo.createTime"></CreateTime> -->

            <el-text type="info" size="large">俱乐部:</el-text>

        </div>
        <div class="club_admin">
            <ClubLink :club-name="clubInfo.name" :club-id="clubInfo.id" :club-image="clubInfo.image" :disable="false">
            </ClubLink>
        </div>
        <!-- <div>
            <el-text type="info" size="large">订阅数:</el-text>
        </div> -->

        <div>
            <el-text type="info" size="large">管理员:</el-text>
        </div>
        <div class="club_admin">
            <UserLink v-for="(user) in clubInfo.admins" :key="user.id" :user-id="user.id" :username="user.name"
                :user-image="user.image">
            </UserLink>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue';
import coreaxios from '@/functions/coreaxios';
import UserLink from '../user/UserLink.vue';
import CreateTime from '../time/CreateTime.vue';
import ClubLink from './ClubLink.vue';
const userId = localStorage.getItem("userId");
const { clubId } = defineProps(['clubId']);
const token = localStorage.getItem("jwt");
const clubInfo = ref(null);

const clubInfoRef = ref(null);
const initialOffsetTop = ref(0);
const stickyStyle = ref({});

function getData() {
    coreaxios.post("/club/getClubInfo", null, {
        headers: { token },
        params: { userId, clubId }
    }).then(res => {
        clubInfo.value = res.data;
        nextTick(() => {
            if (clubInfoRef.value) {
                initialOffsetTop.value = clubInfoRef.value.offsetTop;
            }
        });
    });
}

function handleScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > initialOffsetTop.value) {
        stickyStyle.value = {
            transform: `translateY(${scrollY * 1.2 - initialOffsetTop.value}px)`,
            position: 'relative',
            transition: 'transform 0.3s ease-out '

        };
    } else {
        stickyStyle.value = {};
    }
}

onMounted(() => {
    getData();
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.club-info {
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 2%;
    background-color: var(--el-color-info-light-9);
    padding: 20px;
    gap: 5px;


}

.club_admin {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}
</style>
