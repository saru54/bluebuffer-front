<template>
    <div class="create_blog_container">
        <h2>创建贴子</h2>
        <div class="create_blog_select">
            <h4>选择发布俱乐部</h4>
            <el-autocomplete v-model="clubName" :fetch-suggestions="querySearch" clearable @select="handleSelect">
                <template #default="{ item }">
                    <div class="create_blog_select_club">
                        <ClubLink :club-id="item.id" :club-image="item.image" :club-name="item.name"></ClubLink>
                    </div>

                </template></el-autocomplete>
        </div>
        <div class="create_blog_title">
            <el-input placeholder="标题*" v-model="title"></el-input>
        </div>
        <div class="create_blog_content">
            <el-input :autosize="{ minRows: 8 }" placeholder="内容" type="textarea" v-model="content"></el-input>
        </div>
        <div class="create_blog_image">
            <UploadImage v-model="images" :max-upload="3" @uploaded="receiveImage"></UploadImage>
        </div>
        <div class="create_blog_btn">
            <el-button size="large" :disabled="disabledCondition" @click="post">发布</el-button>
        </div>



    </div>
</template>
<script setup>
import coreaxios from '@/functions/coreaxios';
import { onMounted, ref, watch } from 'vue';
import UploadImage from '../image/UploadImage.vue';
import ClubLink from '../bar/ClubLink.vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const title = ref(null)
const disabledCondition = ref(true)
const content = ref(null)
const images = ref([])
const token = localStorage.getItem("jwt")
const userId = localStorage.getItem('userId')
const club = ref(null)
const subscribedClub = ref([])
const clubName = ref("")
const router = useRouter()
watch(title, () => {
    if (title.value.length > 0) {
        disabledCondition.value = false
    } else {
        disabledCondition.value = true
    }

})

const querySearch = (queryString, cb) => {
    if (queryString == null || querySearch == "") {
        cb(subscribedClub.value)
    } else {
        const results = queryString
            ? subscribedClub.value.filter(createFilter(queryString))
            : subscribedClub.value

        cb(results)
    }

}
const createFilter = (queryString) => {
    return (club) => {
        return (
            club.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}
function getSubscribedClub() {
    coreaxios.post("/club/getSubscribedClub", null, {
        headers: {
            token: token
        },
        params: {
            userId: userId
        }
    }).then(res => {
        subscribedClub.value = res.data


    })
}
function receiveImage(url) {
    images.value.push(url)
}
function handleSelect(data) {
    club.value = data
    clubName.value = data.name

}
function post() {
    const data = {
        userId: userId,
        clubId: club.value.id,
        title: title.value,
        content: content.value,
        images: images.value
    }
    coreaxios.post("/blog/insert", data, {
        headers: {
            token: token
        }
    }).then(res => {
        if (res.status == 200) {
            ElMessage({
                message: "创建成功",
                type: 'success',
                plain: true
            })
            router.push(`/home/clubPage/${club.value.id}`)
        }
    })
}
onMounted(() => {
    getSubscribedClub()
})
</script>
<style scoped>
.el_input {
    border-radius: 10%;
}

.create_blog_container {
    width: 60%;
    margin: auto;

    @media screen and (max-width: 768px) {
        width: 90%;
        padding: 0 10px;
    }
}

.create_blog_btn {
    justify-content: center;
    display: flex;
}

div {
    margin-bottom: 20px;
}

.create_blog_select_club {
    justify-content: left;
    align-items: center;
}

@media screen and (max-width: 768px) {

    .el-input,
    .el-autocomplete {
        width: 100%;
    }

    .create_blog_title,
    .create_blog_content,
    .create_blog_select {
        width: 100%;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    h4 {
        font-size: 1.1rem;
    }
}
</style>