<template>
    <el-form-item prop="image" label="上传图片" v-model="form.image">
        <el-upload :action="'/api/image/upload'" list-type="picture-card" :limit="maxUpload"
            :on-exceed="limitError" :on-success="imgSuccess" :on-error="imgError" :before-upload="handleBeforeUpload"
            :headers="uploadHeaders">
            <i class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const { maxUpload, defaultImage } = defineProps(['maxUpload', 'defaultImage'])
const emit = defineEmits(["uploaded"])
const token = localStorage.getItem('jwt')

const form = ref({
    image: ''
})
const url = ref(null)
const uploadHeaders = ref({
    token: token
})

const imgError = () => {
    alert('上传失败');
};

const limitError = () => {
    alert('上传文件数量超过限制');
};

const imgSuccess = (response) => {
    alert('上传成功');
    url.value = response.message;
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
