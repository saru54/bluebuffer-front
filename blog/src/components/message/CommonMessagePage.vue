<template>
  <div class="container">
    <div class="select">
      <el-segmented v-model="currentComponent" :options="options" block></el-segmented>
    </div>
    <div>
      <component :is="components[currentComponentIndex]"></component>
    </div>
  </div>
</template>
<script setup>
import CommentLikeInfoPage from './CommentLikeInfoPage.vue';
import BlogLikeInfoPage from './BlogLikeInfoPage.vue';
import CommentMessagePage from './CommentMessagePage.vue';
import SubscribeInfoPage from './SubscribeInfoPage.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const currentComponent = ref(null)
const components = [CommentLikeInfoPage, BlogLikeInfoPage, CommentMessagePage, SubscribeInfoPage]
const options = ["回复点赞信息", "动态点赞信息", "回复信息", "关注信息", "系统通知"]
const currentComponentIndex = ref(0)
const route = useRoute()
const pageIndex = parseInt(route.params.index)
watch(currentComponent, () => {
  currentComponentIndex.value = options.indexOf(currentComponent.value)
})
onMounted(() => {
  currentComponentIndex.value = pageIndex
})
</script>
<style scoped>
.container {
  width: 80%;
  margin: auto;
}
</style>