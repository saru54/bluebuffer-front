<template>
  <AuthLayout>
    <div class="form-wrapper" >
    <h3>创建账户</h3>
    <div class="input-items">
      <span class="input-tips">用户名</span>
      <div class="name-fields" :class="{ usernamerepeat: condition == false }">
        <el-input v-model="name" placeholder="请输入用户名" prefix-icon="user" />
      </div>
      <el-text v-if="condition == false" type="error">用户名已存在</el-text>
    </div>


    <div class="input-items">
      <span class="input-tips">密码</span>
      <el-input v-model="password" type="password" placeholder="请输入密码" prefix-icon="lock" show-password />
    </div>
   <div class="input-items">
      <span class="input-tips">确认密码</span>
      <el-input v-model="confirmPassword" type="password" placeholder="请确认密码" prefix-icon="lock"
                        show-password />
    </div> 
         <div class="password-requirements">
            <p>密码必须包含:</p>
            <ul>
                <li :class="{ active: hasLength }">至少六个字符</li>
                <li :class="{ active: hasUpper }">一个大写字符</li>
                <li :class="{ active: hasLower }">一个小写字符</li>
                <li :class="{ active: hasNumber }">一个数字</li>
                <li :class="{ active: hasEqual }">两次密码相同</li>
            </ul>
        </div>
    <div class="terms">
      <el-checkbox v-model="agreeTerms">同意协议</el-checkbox>
    </div>
    <el-button type="primary" @click="register" class="btn" round>
      创建账户
    </el-button>
    <div class="siginup-tips">
      <span>已经拥有账户？</span>
      <el-link type="primary" @click="toLogin">登录</el-link>
    </div>
    <div class="other-login">
      <div class="divider">
        <span class="line"></span>
        <span class="divider-text">其他注册方式</span>
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
import { ref, computed, watch } from 'vue'

import router from '@/routers/router'
import coreaxios from '@/functions/coreaxios'
import { getRandomUserImage } from '@/functions/randomimage'
import { ElMessage } from 'element-plus'
import AuthLayout from '@/components/user/AuthLayout.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const token = localStorage.getItem("jwt")
const condition = ref(null)
// Password validation
const hasLength = computed(() => password.value.length >= 6)
const hasUpper = computed(() => /[A-Z]/.test(password.value))
const hasLower = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasEqual = computed(() => password.value == confirmPassword.value && password.value != '' && confirmPassword.value != '')
function toLogin() {
    router.push("/login")
}
function register() {
    if (validate()) {
        coreaxios.post("/user/register", {
            name: name.value,
            password: password.value,
            image: getRandomUserImage(),
            description: null
        }, {
            headers: {
                token: token
            }
        }).then(res => {
            if (res.status == 200) {
                router.push("/login")
            } else {
                ElMessage("注册失败")
            }
        })
    } else {
        ElMessage("请完整填写信息")
    }
}
function validate() {
    if (hasLength.value == true && hasUpper.value == true && hasLower.value == true && hasNumber.value == true) {
        return true;
    } else {
        return false;
    }
}
function verifyUserName() {
    coreaxios.post("/user/verifyName", null, {
        headers: {
            token: token
        },
        params: {
            name: name.value
        }
    }).then(res => {
        if (res.data == false && res.status == 200) {
            condition.value = true
        } else {
            condition.value = false
        }
    })
}
let timeoutIndex = null
watch(name, () => {
    if (timeoutIndex) {
        clearTimeout(timeoutIndex)
    }
    if (name.value != " " && name.value != null) {
        timeoutIndex = setTimeout(() => {
            verifyUserName()

        }, 2000);
    }


})
</script>

<style scoped>
.usernamerepeat {
    border: 1px solid red;
}
.content .login-wrapper .right-login-form .form-wrapper {
    position: absolute;
  left: 50%;
  top: 70%;
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
.password-requirements {
    background: #f9f8f8;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

.password-requirements p {
    color: #888;
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
}

.password-requirements ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.password-requirements li {
    color: #888;
    font-size: 0.85rem;
    margin: 0.3rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.password-requirements li.active {
    color: rgb(112, 142, 212);
}

.password-requirements li.active::before {
    content: "✓";
}
</style>
