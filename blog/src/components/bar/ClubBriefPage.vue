<template>
    <div class="club-brief-container">
        <div class="club-brief-header">
            <div class="club-brief-info">

                <ClubLink :club-id="club.id" :club-name="club.name" :club-image="club.image" :disable="false">
                </ClubLink>
                <el-text type="info">成员数:{{ club.count }}</el-text>
            </div>

            <ClubSubscribeButtton :club-id="club.id" :condition="club.subscribe"></ClubSubscribeButtton>
        </div>
        <div class="club-brief-bottom">
            <el-text type="info">{{ club.description }}</el-text>
        </div>
    </div>
</template>
<script setup>
import ClubSubscribeButtton from '../button/ClubSubscribeButtton.vue';
import ClubLink from './ClubLink.vue';

const { club } = defineProps(['club'])
</script>
<style scoped>
.club-brief-header {
    display: flex;

    align-items: center;
    justify-content: space-between;
}

.club-brief-bottom {}

.club-brief-container {
    max-width: 400px;
    min-width: 300px;
    border: 0.5px solid var(--el-border-color);
    padding: 10px;
    border-radius: 15px;
}

.club-brief-info {
    display: flex;
    gap: 10px;
    align-items: center;
}

.club-brief-container:hover {
    background-color: var(--el-color-info-light-9);
}
</style>