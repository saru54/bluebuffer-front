<template>
    <div class="container">
        <el-card>
            <template #header>
                <el-button circle @click="toHomePage"><el-icon>
                        <House />
                    </el-icon></el-button> 登录
            </template>
            <el-input placeholder="输入用户名" v-model="inputUsername"></el-input>
            <el-input type="password" placeholder="输入密码" v-model="inputPasssword"></el-input>
            <el-button @click="userLogin" size="large">登录</el-button>
            <el-button @click="toRegisterPage" size="large">注册</el-button>

        </el-card>

    </div>

</template>
<script setup>
import axiosInstance from '@/functions/axios';
import { loginEntity } from '@/functions/login';
import { ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const inputUsername = ref()
const inputPasssword = ref()
const router = useRouter()

function toHomePage() {
    router.push('/homePage')
}
function userLogin() {
    if (inputUsername.value == null || inputPasssword.value == null) {
        ElMessageBox.alert("账户密码不能为空")
        return
    }
    axiosInstance.post('/user/login', {
        name: inputUsername.value,
        password: inputPasssword.value
    }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
            loginEntity.login();
            localStorage.setItem("jwt", res.data.record.token)
            localStorage.setItem('userId', res.data.record.id)
            router.push('/homePage')
        } else {
            ElMessageBox.alert("账户或密码错误")
        }


    })
}
function toRegisterPage() {
    router.push(`/registerPage`)
}

</script>
<style scoped>
.container {
    display: flex;

    justify-content: center;

    align-items: center;


    width: 50%;
    height: 100vh;
    margin: auto auto;
}

.loginPage {
    padding: 20px;
}
</style>