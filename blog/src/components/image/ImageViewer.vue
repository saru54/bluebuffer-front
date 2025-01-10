<template>
    <div class="image-viewer">
        <!-- 缩略图 -->
        <img :src="imageUrl" class="thumbnail" @click="showModal = true" alt="缩略图" />

        <!-- 放大图片的模态框 -->
        <div v-if="showModal" class="modal" @click.self="closeModal">
            <div class="modal-content"
                :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${scale})` }"
                @mousedown="onMouseDown" @wheel="onWheel">
                <img :src="imageUrl" alt="大图" class="large-image" />
            </div>
            <button class="close-button" @click="closeModal">关闭</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

// Props：接收图片的 URL
defineProps({
    imageUrl: {
        type: String,
        required: true,
    },
});

// 控制模态框显示状态
const showModal = ref(false);

// 缩放和拖动相关状态
const scale = ref(1); // 缩放比例
const translateX = ref(0); // 水平偏移
const translateY = ref(0); // 垂直偏移

// 记录拖动时的鼠标初始位置
let startX = 0;
let startY = 0;

// 记录初始的位移值
let initialX = 0;
let initialY = 0;

// 拖动图片
const onMouseDown = (event) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
    initialX = translateX.value;
    initialY = translateY.value;

    const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        translateX.value = initialX + deltaX;
        translateY.value = initialY + deltaY;
    };

    const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
};

// 使用鼠标滚轮缩放图片
const onWheel = (event) => {
    event.preventDefault();
    const zoom = event.deltaY > 0 ? 0.9 : 1.1;
    scale.value = Math.max(0.5, Math.min(scale.value * zoom, 3)); // 限制缩放范围 0.5x ~ 3x
};

// 关闭模态框并重置状态
const closeModal = () => {
    showModal.value = false;
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
};
</script>

<style scoped>
.image-viewer {
    display: flex;
    justify-content: center;
    align-items: center;
}

.thumbnail {
    width: 100px;
    height: auto;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.thumbnail:hover {
    transform: scale(1.1);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    position: relative;
    cursor: grab;
    transition: transform 0.3s ease;
}

.large-image {
    max-width: 80%;
    max-height: 80%;
    display: block;
}

.close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: #fff;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.close-button:hover {
    background: #f0f0f0;
}
</style>