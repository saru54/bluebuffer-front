<template>
    <div class="errorbox">
        <el-text type="danger">出错了</el-text>
        <el-text type="default">
            <slot></slot>
        </el-text>
    </div>
</template>
<script setup>

</script>
<style scoped>
.errorbox {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
}
</style>