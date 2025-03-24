<template>
  <div class="content">
    <div class="login-wrapper">
      <div class="left-img">
        <div class="glass">
          <div class="tips">
            <div class="title">
              {{ currentText }}
              <span class="cursor">|</span>
            </div>
            <h3>探索你的宇宙</h3>
            <span>生活有料，知识随行</span>
            <span>一个汇聚兴趣同好、自由分享知识与生活的社区，欢迎你的加入！</span>
          </div>
        </div>
      </div>
      <div class="right-login-form">
        <slot>
          <!-- 调试内容 -->
          <div v-if="true">Slot content not provided</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentText = ref('');
const fullText = ref("BLUE BUFFER");
const typingSpeed = ref(100);

function typeWriter() {
  if (currentText.value.length < fullText.value.length) {
    currentText.value = fullText.value.substring(0, currentText.value.length + 1);
    setTimeout(typeWriter, typingSpeed.value);
  }
}

onMounted(() => {
  typeWriter();
});
</script>

<style scoped>
  * {
  padding: 0;
  margin: 0;
  /* font-family: "Aguazyuan", Courier, monospace; */
}

.content {
  /* width: 100vw;
  height: 100vh; */
  background-color: rgb(112, 142, 212);
  position: relative;
}
.content .login-wrapper {
  width: 70vw;
  height: 80vh;
  background-color: #fff;
  border-radius: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}
 .content .login-wrapper .left-img {
  border-radius: 40px;
  flex: 1;
  background: url(@/assets/image/bg.jpg) no-repeat;
  background-size: cover;
  position: relative;
}
.content .login-wrapper .left-img .glass {
  width: 60%;
  padding: 20px;
  color: #fff;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgb(112, 142, 212);;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.48);
}
.content .login-wrapper .left-img .glass .tips .title {
  width: 25%;
  font-weight: 600;
  font-size: 10px;
  text-align: center;
  padding: 10px;
  margin-bottom: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgb(112, 142, 212);;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  font-family: monospace; /* 使用等宽字体以模拟打字机字体 */
  white-space: pre;
}

.content .login-wrapper .left-img .glass .tips h1 {
  margin: 15px 0;
}
.content .login-wrapper .left-img .glass .tips span {
  margin: 5px 0;
  display: block;
  font-weight: 100;
} 
.content .login-wrapper .right-login-form {
  flex: 1;
  position: relative;
}
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
  width: 50px;
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
  width: 40px;
  height: 40px;
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

@media (max-width: 1024px) {
  .login-wrapper {
    padding: 20px;
  }
  .login-wrapper .left-img {
    display: none;
  }
  .login-wrapper .right-login-form {
    padding: 20px;
  }
}
</style>