<template>
    <div class="board">
        <div>
            <h3>热门俱乐部</h3>
        </div>
        <div>
            <!-- <BarBrief v-for="(bar, index) of bars" :key="index" :hotbar="bar"></BarBrief> -->
            <el-row :gutter="10">
                <el-col :span="6" v-for="(bar, index) of bars" :key="index">
                    <BarBrief :hotbar="bar"></BarBrief>
                </el-col>
            </el-row>
        </div>

    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import BarBrief from './BarBrief.vue';
import axiosInstance from '@/functions/axios';


const token = localStorage.getItem("jwt")
const bars = ref([]);
function updata() {
    axiosInstance.get('/club/recommend', {
        params: {
            count: 16
        },
        headers: {
            token: token
        }
    }).then(res => {
        bars.value = res.data.record
    })
}
onMounted(() => {
    updata()
})
</script>
<style>
.bar-card {
    height: 150px;
    margin-bottom: 5px;
}

.bar-bottom {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    height: 80%;
}

.bar-image {
    height: 50px;
    /* 固定高度 */
    width: 50px;
    /* 固定宽度 */
    margin-right: 10px;
    /* 右侧留白 */
}

.bar-content {
    width: auto;
    /* 自动宽度，适应内容 */
    font-size: 12px;
    /* 可以稍微增大字体以增强可读性 */
}
</style>
