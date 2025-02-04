<template>
    <div v-if="data.length > 0">
        <el-menu :default-openeds="['1']">
            <el-sub-menu index="1">
                <template #title>
                    <el-text>管理</el-text>
                </template>
                <el-menu-item v-for="(club, index) in data" :key="club.id" :index="index.toString()" class="clubmenu">
                    <ClubLink :club-id="club.id" :club-image="club.image" :club-name="club.name" :disable="false">
                    </ClubLink>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
<script setup>
import coreaxios from "@/functions/coreaxios";
import { onMounted, ref } from "vue";
import ClubLink from "../bar/ClubLink.vue";

const data = ref([]);

function getData() {
    coreaxios
        .post("/club/getAdminClub", null, {
            headers: {
                token: localStorage.getItem("jwt"),
            },
        })
        .then((res) => {

            data.value = res.data;
        });
}

onMounted(() => {
    getData();
});
</script>

<style scoped>
.clubmenu {
    text-align: left;
    width: 100%;

}

.el-menu-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 8px;
}
</style>