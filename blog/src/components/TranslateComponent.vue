<template>
    <div class="translate-contianer">
        <el-button @click="translate">
            <el-icon>
                <Edit />
            </el-icon>
            翻译
        </el-button>
        <el-select style="width: 100px;" v-model="language">
            <el-option label="中文" value="zh"></el-option>
            <el-option label="英文" value="en"></el-option>
            <el-option label="波兰语" value="pl"></el-option>
            <el-option label="丹麦语" value="dan"></el-option>
            <el-option label="德语" value="de"></el-option>
            <el-option label="法语" value="fra"></el-option>
            <el-option label="菲律宾语" value="fil"></el-option>
            <el-option label="芬兰语" value="fin"></el-option>
            <el-option label="韩语" value="kor"></el-option>
            <el-option label="荷兰语" value="nl"></el-option>
            <el-option label="挪威语" value="nor"></el-option>
            <el-option label="日语" value="jp"></el-option>
            <el-option label="瑞典语" value="swe"></el-option>
            <el-option label="泰语" value="th"></el-option>
            <el-option label="西班牙语" value="spa"></el-option>
            <el-option label="希伯来语" value="heb"></el-option>
            <el-option label="希腊语" value="el"></el-option>
            <el-option label="匈牙利语" value="hu"></el-option>
            <el-option label="意大利语" value="it"></el-option>
        </el-select>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { MD5 } from '@/functions/md5';
import { ElNotification } from 'element-plus';
const emit = defineEmits(["translated"])
const language = ref("zh")
const content = defineProps(["content"])
const token = import.meta.env.VITE_TranslateToken
const appid = import.meta.env.VITE_TransLateAppID
const url = import.meta.env.VITE_TransLateUrl

function translate() {
    const salt = Math.floor(new Date().getTime() / 1000).toString();
    const signStr = appid + content.content + salt + token;
    const sign = MD5(signStr);

    console.log(content.content)
    axios.get(url, {
        params: {
            q: content.content,
            from: "auto",
            to: language.value,
            appid: appid,
            salt: salt,
            sign: sign
        }
    }).then(res => {
        console.log(res.data)

        emit("translated", res.data.trans_result)
    }).catch(e => {
        console.log(e)
        ElNotification({
            title: '翻译失败',
            message: '请检查网络连接',
            type: 'error'
        })
    })
}

</script>
<style scoped>
.translate-contianer {
    display: flex;
    gap: 10px;

}
</style>
