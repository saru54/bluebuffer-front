<template>
  <AuthLayout>
    <div class="form-wrapper">
    <h3>登录</h3>
    <div class="input-items">
      <span class="input-tips">用户名</span>
      <el-input v-model="name" placeholder="请输入用户名" prefix-icon="message" />
    </div>
    <div class="input-items">
      <span class="input-tips">密码</span>
      <el-input v-model="password" type="password" placeholder="请输入密码" prefix-icon="lock" show-password />
    </div>
    <div class="terms">
      <el-checkbox v-model="agreed">同意协议</el-checkbox>
    </div>
    <el-button type="primary" @click="login" class="btn" round>
      开始探索
    </el-button>
    <div class="siginup-tips">
      <span>还没有账号？</span>
      <el-link type="primary" @click="toRegister">注册</el-link>
    </div>
    <div class="other-login">
      <div class="divider">
        <span class="line"></span>
        <span class="divider-text">其他登录方式</span>
        <span class="line"></span>
      </div>
      <div class="other-login-wrapper">
        <div class="other-login-item">
          <img src="@/assets/image/QQ.png" alt="QQ">
        </div>
        <div class="other-login-item">
          <img src="@/assets/image/WeChat.png" alt="WeChat">
        </div>
      </div>
    </div>
  </div>
  </AuthLayout>
  
</template>

<script setup>
import { ref } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import router from '@/routers/router'
import coreaxios from '@/functions/coreaxios'
import { ElMessage } from 'element-plus'
import { createWebSocket } from '@/functions/websocket'
import { setLoginCondition } from '@/functions/login'
import AuthLayout from '@/components/user/AuthLayout.vue'

const name = ref('')
const password = ref('')
const agreed = ref(false)

function toRegister() {
    router.push("/register")
}
function validate() {
    if (name.value.length < 3 || name.value == " " || name.value == null) {
        ElMessage("用户名长度不能小于3")
        return;
    }
    if (password.value.length < 6 || password.value == " " || password.value == null) {
        ElMessage("密码长度不能小于6")
        return;
    }
    if(agreed.value == false){
        ElMessage("请同意协议")
        return;
    }
    return true;

}
function login() {
    if (validate()) {
        try {
            coreaxios.post('/user/login', {
                name: name.value,
                password: password.value
            }, {
                headers: {
                    token: localStorage.getItem("jwt")
                }
            }).then(res => {
                if (res.status == 200 && res.data != null) {


                    const dto = res.data;
                    localStorage.setItem('jwt', dto.token)
                    localStorage.setItem('userId', dto.id)
                    // setLoginCondition()
                    router.push("/home/blogRecommendPage")
                } else {
                    ElMessage("账户或密码错误")
                }
            })
        } catch (error) {
            console.log("asd");

            ElMessage("账户或密码错误")
        }

    }

}

</script>

<style scoped>
.content .login-wrapper .right-login-form .form-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content .login-wrapper .right-login-form .form-wrapper h1 {
  font-size: 30px;
  text-align: center;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items {
  margin: 20px 0;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .input-tips {
  display: inline-block;
  font-weight: 600;
  font-size: 15px;
  margin: 10px 0;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .inputs {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  border: 1px solid rgb(227, 227, 227);
  padding: 20px;
  box-sizing: border-box;
  outline: none;
  transition: 0.5s;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .inputs:focus {
  border: 1px solid rgb(112, 142, 212);;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .forgot {
  float: right;
  font-weight: 600;
  text-align: right;
  margin: 5px 0;
  font-size: 10px;
  cursor: pointer;
}
.content .login-wrapper .right-login-form .form-wrapper .btn {
  width: 100%;
  height: 50px;
  background-color: rgb(112, 142, 212);
  border: 0;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  margin: 20px 0;
  cursor: pointer;
  position: relative;
  overflow: hidden; /* 隐藏超出部分 */
}
/* 定义伪元素用于闪光效果 */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%; /* 初始位置在按钮左侧 */
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.5),
    rgba(255, 255, 255, 0)
  );
  transform: skewX(-25deg); /* 倾斜效果 */
  transition: all 0.5s ease; /* 动画过渡效果 */
}

/* 鼠标悬停时的闪光效果 */
.btn:hover::before {
  left: 100%; /* 移动到按钮右侧 */
}

.content .login-wrapper .right-login-form .form-wrapper .siginup-tips {
  text-align: center;
  font-weight: 600;
  margin: 10px 0;
  font-size: 14px;
}
.content .login-wrapper .right-login-form .form-wrapper .siginup-tips span:last-child {
  color:  rgb(112, 142, 212);
  font-weight: 600;
}
.el-link {  
    vertical-align: initial !important;  
}  
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider {
  width: 100%;
  margin: 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider .line {
  display: inline-block;
  max-width: 35%;
  width: 35%;
  flex: 1;
  height: 1px;
  background-color: rgb(162, 172, 185);
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider .divider-text {
  vertical-align: middle;
  margin: 0 20px;
  display: inline-block;
  /* width: 50px; */
  color: rgb(162, 172, 185);
  white-space: normal;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item {
  width: 70px;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: rgb(51, 49, 116);
  margin: 0 10px;
  transition: 0.4s;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item span {
  vertical-align: middle;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item:hover {
  width: 80px;
  height: 50%;
  background-color: #fff;
  border: 0;
  box-shadow: 1px 10px 32px 1px rgba(186, 175, 221, 0.37);
}
.content .login-wrapper .left-img .glass .tips .cursor {
    display: inline;
    animation: blink 1s step-end infinite;
}
@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: white;
  }
}

</style>
