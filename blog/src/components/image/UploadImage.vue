<template>
    <el-form-item prop="image" :label="label" v-model="form.image">
        <el-upload v-model:file-list="fileList" :action="baseURL" list-type="picture-card" :limit="maxUpload"
            :on-exceed="limitError" :on-success="imgSuccess" :on-error="imgError" :before-upload="handleBeforeUpload"
            :headers="uploadHeaders">
            <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
</template>

<script setup>
import { ElNotification } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
const baseURL = import.meta.env.VITE_BaseUrl + "/file/image/upload";
const { maxUpload, defaultImage, label } = defineProps(['maxUpload', 'defaultImage', 'label'])
const emit = defineEmits(["uploaded"])
const images = defineModel()
const fileList = computed(() => images.value.map(e =>
({
    url: e
})))



const token = localStorage.getItem('jwt')
const form = ref({
    image: ''
})
const url = ref(null)
const uploadHeaders = ref({
    token: token
})

const imgError = () => {

    ElNotification({
        title: "图片上传",
        content: "图片上传失败",
        type: "error"
    })
};

const limitError = () => {
    alert('上传文件数量超过限制');
};

const imgSuccess = (response) => {
    ElNotification({
        title: "图片上传",
        content: "图片上传成功",
        type: "success"
    })
    url.value = response;
    form.value.image = url.value;
    emit("uploaded", url.value);


};

function handleBeforeUpload() {
    // 在上传前做一些处理（如果需要）
}
onMounted(() => {
    if (defaultImage != null) {
        form.value.image = defaultImage
    }
})
</script>

<style scoped></style>
