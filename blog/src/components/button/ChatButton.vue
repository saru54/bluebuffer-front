<template>
    <div>
        <el-badge :value="messageCountStore.count" :show-zero="false" :offset="[0, 10]">
            <el-button circle @click="toggle()">
                <el-icon>
                    <ChatLineRound />
                </el-icon>
            </el-button>
        </el-badge>

    </div>
</template>
<script setup>
import { messageCountStore } from '@/functions/badge';
import { chatModelStore } from '@/functions/chat';

function toggle() {
    // chatPageVisible.value = !chatPageVisible.value;
    messageCountStore.clear()
    chatModelStore.toggle()
}
</script>
<style scoped></style>