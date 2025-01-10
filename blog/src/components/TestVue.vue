<template>
    <!-- <ul v-for="(item, index) of sets" :key="index">
        <li v-for="(item2, index2) of even(item)" :key="index2">
            {{ item2 }}
        </li>
    </ul> -->
    <!-- <el-button type="default" @click="update">{{ num }}</el-button>
    <el-input placeholder="输入" v-model="text" v-on:keyup.enter="update"></el-input>
    <el-input placeholder="输入" v-model="text"></el-input>
    <el-checkbox v-model="isChecked">{{ isChecked }}</el-checkbox>


    {{ checkeds }}
    <el-checkbox label="one" value="one" id="one" v-model="checkeds">
    </el-checkbox>

    <el-checkbox label="two" value="two" id="two" v-model="checkeds">
    </el-checkbox>
    <el-radio v-model="checkeds" label="one" value="one"></el-radio>
    <el-radio v-model="checkeds" label="two" value="two"></el-radio>
    <el-select v-model="checkeds" placeholder="选择字母" clearable>
        <el-option v-for="(item, index) in arr" :key="index" :label="item" :value="item"></el-option>
    </el-select>
    <p>{{ number * 9 }}</p>
    <el-input placeholder="输入数字" v-model.number.trim="source"></el-input>
    <component :is="tabs[currentTab]"></component>
    <el-button type="default" @click="changeComponent">切换</el-button>
    <ErrorBox>这是一些话</ErrorBox>
    <el-button type="default" @click="() => isShowComment = !isShowComment">{{ !isShowComment }}</el-button>
    <p>{{ refP }}</p> -->
    <!-- <div :style="{ fontSize: blogFontSize + 'em' }">

        <BlogPage v-for="(blog, index) of resultBlogs" :key="index" :blog="blog" @enlarge-text="enlargeText"
            :is-show-comment="isShowComment"></BlogPage>
    </div> -->
    <div>
        <TestChild></TestChild>
    </div>

</template>
<script setup>

import { defaultNamespace, ElButton } from 'element-plus';
import { onMounted, provide, readonly, ref, useTemplateRef, watch } from 'vue';
import BlogPage from './blog/BlogPage.vue';
import ErrorBox from './ErrorBox.vue';
import LoginPage from './user/LoginPage.vue';
import RegisterPage from './user/RegisterPage.vue';
import TestChild from './TestChild.vue';
provide("saruName", readonly("5494"))
const isShowComment = ref(true)
const tabs = ref([LoginPage, RegisterPage])
const currentTab = ref(0)
const num = ref()
const sets = ref([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10]
])
function changeComponent() {
    currentTab.value = (currentTab.value + 1) % tabs.value.length;
}
const resultBlogs = ref([
    {
        id: 1,
        title: "这是我拍的风景", content: ":fit= 属性用于控制图片在其容器内的填充方式。<el-image> 组件中的 fit 属性可以设定图片的显示模式，例如是否拉伸、裁剪或包含等。常用的取值包括：:fit= 属性用于控制图片在其容器内的填充方式。<el-image> 组件中的 fit 属性可以设定图片的显示模式，例如是否拉伸、裁剪或包含等。常用的取值包括：:fit= 属性用于控制图片在其容器内的填充方式。<el-image> 组件中的 fit 属性可以设定图片的显示模式，例如是否拉伸、裁剪或包含等。常用的取值包括：:fit= 属性用于控制图片在其容器内的填充方式。<el-image> 组件中的 fit 属性可以设定图片的显示模式，例如是否拉伸、裁剪或包含等。常用的取值包括：", images: ["https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0", "https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0", "https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0"], comments: [
            { user: "用户 1", content: "评论内容 1", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 2", content: "评论内容 2" },
            { user: "用户 5", content: "评论内容 1", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 6", content: "评论内容 3", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 1", content: "评论内容 245", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 1", content: "评论内容 24", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 1", content: "评论内容 5", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 1", content: "评论内容 6", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },
            { user: "用户 1", content: "评论内容 7", comments: [{ user: "用户 2", content: "评论内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] }] },]
    },
    { id: 2, title: "标题 2", content: "这是内容 2", comments: [{ user: "用户 2", content: "评论内容 2" }] },
    { id: 3, title: "标题 3", content: "这是内容 3", comments: [{ user: "用户 3", content: "评论内容 3" }] },
    { id: 4, title: "标题 4", content: "这是内容 4", comments: [{ user: "用户 4", content: "评论内容 4" }] },
    { id: 5, title: "标题 5", content: "这是内容 5", comments: [{ user: "用户 5", content: "评论内容 5" }] },
]
);
const blogFontSize = ref(1)
function enlargeText(fontSize) {
    blogFontSize.value = fontSize
    console.log("父组件接收");

}
const source = ref("hi ")
const number = ref(0)
const arr = ref(["A", "B", "C"])
const checkedNames = ref([])
const checkeds = ref([])
const isChecked = ref(false)
const text = ref()

function even(numbers) {
    return numbers.filter((number) => number % 2 === 0)
}
function update(event) {
    num.value++

}
const refP = ref()
onMounted(() => {
    refP.value = "新的文本内容"
})
watch(source, (newSocre, oldSoucre) => {
    console.log(newSocre);
    console.log(oldSoucre);


},
    { immediate: true })


</script>