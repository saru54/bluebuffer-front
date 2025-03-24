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
  max-height: 100%; /* 确保表单内容的高度不会超过父容器 */
  overflow-y: auto; /* 如果内容超出高度，显示滚动条 */
}
/* 自定义滚动条样式 */
.right-login-form::-webkit-scrollbar {
  display: none; /* 隐藏默认滚动条（对于 Chrome, Safari, 和 Opera） */
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