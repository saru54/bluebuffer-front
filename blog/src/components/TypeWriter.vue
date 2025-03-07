<template>
    <span>{{ displayText }}</span>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    speed: {
        type: Number,
        default: 50
    }
})

const displayText = ref('')
const currentIndex = ref(0)

const typeText = () => {
    if (currentIndex.value < props.text.length) {
        displayText.value += props.text[currentIndex.value]
        currentIndex.value++
        setTimeout(typeText, props.speed)
    }
}

watch(() => props.text, (newText) => {
    displayText.value = ''
    currentIndex.value = 0
    if (newText) {
        setTimeout(typeText, props.speed)
    }
}, { immediate: true })
</script>