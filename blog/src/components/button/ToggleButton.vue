<template>
    <div>
        <el-button circle @click="toggleDark()">
            <el-icon v-if="!isDark">
                <Moon />
            </el-icon>
            <el-icon v-if="isDark">
                <Sunny />
            </el-icon>
        </el-button>
    </div>
</template>
<script setup>
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark({
  // 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
  storageKey: 'useDarkKEY',
  // 暗黑class名字
  valueDark: 'dark',
  // 高亮class名字
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
</script>
<style scoped></style>