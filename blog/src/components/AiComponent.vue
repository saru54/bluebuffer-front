<template>
    <div class="ai-chat-wrapper" :style="wrapperStyle">

        <div class="chat-bubble" v-if="!isExpanded" @mousedown="handleMouseDown" @touchstart="handleTouchStart"
            @click="handleClick" ref="chatBubble">
            <div class="bubble-icon"><el-icon>
                    <ChatSquare />
                </el-icon></div>
        </div>


        <div class="ai-chat-container" v-if="isExpanded">
            <div class="chat-header">
                <h3>AI 助手</h3>
                <button class="close-button" @click="toggleChat">×</button>
            </div>
            <div class="chat-messages" ref="messageContainer">
                <div v-for="(message, index) in messages" :key="index"
                    :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
                    <div class="message-content">
                        <template v-if="message.role === 'user'">
                            {{ message.content }}
                        </template>
                        <TypeWriter v-else :text="message.content" :speed="writeSpeed" />
                    </div>
                </div>
            </div>
            <div class="input-area">
                <textarea v-model="userInput" @keyup.enter.exact.prevent="sendMessage" placeholder="输入您的问题..."
                    rows="3"></textarea>
                <button @click="sendMessage" :disabled="isLoading">
                    {{ isLoading ? '发送中...' : '发送' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import TypeWriter from './TypeWriter.vue'

const writeSpeed = ref(30)
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const isExpanded = ref(false)
const messageContainer = ref(null)
const chatBubble = ref(null)
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const position = ref({ x: 20, y: 20 })
const userId = localStorage.getItem('userId');

const mouseDownTime = ref(0)
const mouseDownPos = ref({ x: 0, y: 0 })
const dragThreshold = 5


const wrapperStyle = ref({
    position: 'fixed',
    bottom: position.value.y + 'px',
    right: position.value.x + 'px',
    zIndex: 1000
})


const handleMouseDown = (event) => {
    if (isExpanded.value) return

    mouseDownTime.value = Date.now()
    mouseDownPos.value = {
        x: event.clientX,
        y: event.clientY
    }

    isDragging.value = false
    startPos.value = {
        x: event.clientX,
        y: event.clientY
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}

const handleTouchStart = (event) => {
    if (isExpanded.value) return

    mouseDownTime.value = Date.now()
    mouseDownPos.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    }

    isDragging.value = false
    startPos.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', stopTouchDrag, { passive: true })
}

const handleClick = (event) => {

    const moveDistance = Math.sqrt(
        Math.pow(event.clientX - mouseDownPos.value.x, 2) +
        Math.pow(event.clientY - mouseDownPos.value.y, 2)
    )

    if (moveDistance < dragThreshold) {
        toggleChat()
    }
}

const onDrag = (event) => {
    const moveDistance = Math.sqrt(
        Math.pow(event.clientX - mouseDownPos.value.x, 2) +
        Math.pow(event.clientY - mouseDownPos.value.y, 2)
    )


    if (moveDistance > dragThreshold) {
        isDragging.value = true
    }

    if (!isDragging.value) return

    const deltaX = startPos.value.x - event.clientX
    const deltaY = startPos.value.y - event.clientY

    startPos.value = {
        x: event.clientX,
        y: event.clientY
    }

    position.value = {
        x: Math.max(20, Math.min(window.innerWidth - 80, position.value.x + deltaX)),
        y: Math.max(20, Math.min(window.innerHeight - 80, position.value.y + deltaY))
    }

    wrapperStyle.value = {
        position: 'fixed',
        bottom: position.value.y + 'px',
        right: position.value.x + 'px',
        zIndex: 1000
    }


    localStorage.setItem(userId + "-" + 'aiChatPosition', JSON.stringify(position.value))
}

const onTouchMove = (event) => {
    if (!isDragging.value) {
        const moveDistance = Math.sqrt(
            Math.pow(event.touches[0].clientX - mouseDownPos.value.x, 2) +
            Math.pow(event.touches[0].clientY - mouseDownPos.value.y, 2)
        )

        if (moveDistance > dragThreshold) {
            isDragging.value = true
        }
    }

    if (isDragging.value) {
        event.preventDefault()
        const deltaX = startPos.value.x - event.touches[0].clientX
        const deltaY = startPos.value.y - event.touches[0].clientY

        startPos.value = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        }

        position.value = {
            x: Math.max(20, Math.min(window.innerWidth - 80, position.value.x + deltaX)),
            y: Math.max(20, Math.min(window.innerHeight - 80, position.value.y + deltaY))
        }

        wrapperStyle.value = {
            position: 'fixed',
            bottom: position.value.y + 'px',
            right: position.value.x + 'px',
            zIndex: 1000
        }

        localStorage.setItem(userId + "-" + 'aiChatPosition', JSON.stringify(position.value))
    }
}

const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.body.style.overflow = ''
}

const stopTouchDrag = () => {
    isDragging.value = false
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', stopTouchDrag)
    document.body.style.overflow = ''
}

const toggleChat = () => {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value == true) {
        writeSpeed.value = 5;
    }
    if (isExpanded.value) {
        nextTick(() => {
            scrollToBottom()
        })
    }
}


const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return


    messages.value.push({
        role: 'user',
        content: userInput.value
    })

    const userQuestion = userInput.value
    userInput.value = ''
    isLoading.value = true

    try {
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
                messages: [
                    ...messages.value,
                    { role: "user", content: "回复中文" + userQuestion }
                ],
                stream: false,
                max_tokens: 512,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                frequency_penalty: 0.5,
                n: 1,
                response_format: { type: "text" }
            })
        };

        const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', options);
        const data = await response.json();

        if (!response.ok) {
            console.log(data);

            throw new Error(data.message || '请求失败');
        }
        writeSpeed.value = 30;
        messages.value.push({
            role: 'assistant',
            content: data.choices[0].message.content
        });
    } catch (error) {
        console.error('发送消息失败:', error);
        messages.value.push({
            role: 'assistant',
            content: '抱歉，发生了一些错误，请稍后重试。'
        });
    } finally {
        isLoading.value = false;
    }

    // 滚动到最新消息
    await nextTick()
    scrollToBottom()
}


const scrollToBottom = () => {
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
}

onMounted(() => {

    const savedPosition = localStorage.getItem(userId + "-" + 'aiChatPosition')
    if (savedPosition) {
        position.value = JSON.parse(savedPosition)
        wrapperStyle.value = {
            position: 'fixed',
            bottom: position.value.y + 'px',
            right: position.value.x + 'px',
            zIndex: 1000
        }
    }

    scrollToBottom()
})
</script>

<style scoped>
.ai-chat-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-bubble {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--el-color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
    user-select: none;
}

.chat-bubble:hover {
    transform: scale(1.05);
    background: var(--el-color-primary-light-3);
}

.bubble-icon {
    color: var(--el-color-white);
    font-size: 20px;
    font-weight: bold;
}

.ai-chat-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 90%;
    max-width: 380px;
    height: 80vh;
    max-height: 600px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 12px;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
}

.chat-header {
    padding: 16px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--el-bg-color);
    border-radius: 12px 12px 0 0;
}

.chat-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--el-text-color-primary);
}

.close-button {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    padding: 0 8px;
}

.close-button:hover {
    color: var(--el-text-color-primary);
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: var(--el-bg-color-page);
}

.message {
    margin-bottom: 20px;
    max-width: 80%;
}

.user-message {
    margin-left: auto;
}

.ai-message {
    margin-right: auto;
}

.message-content {
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-lighter);
}

.user-message .message-content {
    background: var(--el-color-primary);
    color: var(--el-color-white);
}

.ai-message .message-content {
    color: var(--el-text-color-primary);
    border: 1px solid var(--el-border-color-lighter);
}

.input-area {
    padding: 16px;
    border-top: 1px solid var(--el-border-color);
    display: flex;
    gap: 10px;
    background: var(--el-bg-color);
    border-radius: 0 0 12px 12px;
}

textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    resize: none;
    font-size: 14px;
    background: var(--el-input-bg-color);
    color: var(--el-text-color-primary);
}

textarea:focus {
    border-color: var(--el-color-primary);
    outline: none;
}

textarea::placeholder {
    color: var(--el-text-color-placeholder);
}

button {
    padding: 0 20px;
    background: var(--el-color-primary);
    color: var(--el-color-white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

button:hover {
    background: var(--el-color-primary-light-3);
}

button:disabled {
    background: var(--el-disabled-bg-color);
    cursor: not-allowed;
    color: var(--el-disabled-text-color);
}

/* 自定义滚动条样式 */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: var(--el-border-color-darker);
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
}

@keyframes slideIn {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
