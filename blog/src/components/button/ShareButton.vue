<template>
    <div>
        <el-tooltip effect="dark" content="分享" placement="bottom">
            <el-button @click="copy">
                <el-icon>
                    <Share />
                </el-icon></el-button>
        </el-tooltip>

    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus';

const { url } = defineProps(['url'])
function copy() {
    navigator.clipboard.writeText(url).then(() => {
        ElMessage({
            message: "链接已复制",
            type: "success"
        })
    })

}
</script>