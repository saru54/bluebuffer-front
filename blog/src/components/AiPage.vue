<template>
    <div class="ai-chat-container">
        <div class="chat-messages" ref="messageContainer">
            <div v-for="(message, index) in messages" :key="index"
                :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
                <div class="message-content">
                    {{ message.content }}
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
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// 消息类型定义
interface Message {
    role: 'user' | 'assistant'
    content: string
}

// 状态管理
const messages = ref<Message[]>([])
const userInput = ref('')
const isLoading = ref(false)
const messageContainer = ref<HTMLElement | null>(null)

// TODO: 在这里导入和配置AI API客户端

// 发送消息
const sendMessage = async () => {
    if (!userInput.value.trim() || isLoading.value) return

    // 添加用户消息
    messages.value.push({
        role: 'user',
        content: userInput.value
    })

    const userQuestion = userInput.value
    userInput.value = ''
    isLoading.value = true

    try {
        // TODO: 实现API调用逻辑
        // const response = await aiApi.sendMessage(userQuestion)

        // 模拟AI响应
        setTimeout(() => {
            messages.value.push({
                role: 'assistant',
                content: '这里是AI的回复示例'
            })
            isLoading.value = false
        }, 1000)

    } catch (error) {
        console.error('发送消息失败:', error)
        isLoading.value = false
    }

    // 滚动到最新消息
    await nextTick()
    scrollToBottom()
}

// 滚动到底部
const scrollToBottom = () => {
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
}

// 组件挂载时滚动到底部
onMounted(() => {
    scrollToBottom()
})
</script>

<style scoped>
.ai-chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
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
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
    background: #007AFF;
    color: white;
}

.input-area {
    display: flex;
    gap: 10px;
}

textarea {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: none;
    font-size: 14px;
}

button {
    padding: 0 20px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

button:hover {
    background: #0056b3;
}

button:disabled {
    background: #cccccc;
    cursor: not-allowed;
}
</style>
