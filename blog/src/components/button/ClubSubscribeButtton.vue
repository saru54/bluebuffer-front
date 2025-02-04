<template>
    <div>
        <el-button @click="subscribe">
            <div v-if="innerCondition == false">
                订阅
            </div>
            <div v-if="innerCondition == true">
                取消订阅
            </div>
        </el-button>
    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref } from 'vue';
const { condition, clubId } = defineProps(["condition", "clubId"])
const innerCondition = ref(null)
function subscribe() {
    coreaxios.post("/club/subscribe", null, {
        headers: {
            token: localStorage.getItem("jwt")
        }, params: {
            clubId: clubId
        }
    })
    innerCondition.value = !innerCondition.value

}
onMounted(() => {
    innerCondition.value = condition
})
</script>