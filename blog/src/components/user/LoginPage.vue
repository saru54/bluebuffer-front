<template>
    <div class="login-container">
        <div class="login-content">
            <!-- Left Panel -->
            <div class="left-panel">
                <div class="logo">
                    <span class="code-icon">&lt;/&gt;</span>
                    <span>Blue Buffer</span>
                </div>

                <div class="hero-content">
                    <h1>社区</h1>
                    <h1>相互交流</h1>
                    <h1>community</h1>

                    <el-button class="watch-demo-btn" round>
                        <el-icon><video-play /></el-icon>
                        music
                    </el-button>
                </div>

            </div>

            <!-- Right Panel -->
            <div class="right-panel">
                <div class="login-header">
                    <div class="join-text">
                        <h3>没编标题</h3>
                        <p>不想编</p>
                    </div>
                    <p class="description">
                        很牛逼的介绍很牛逼的介绍很牛逼的介绍很牛逼的介绍很牛逼的介绍很牛逼的介绍很牛逼的介绍
                        很牛逼的介绍很牛逼的介绍很牛逼的介绍很牛逼的介绍
                    </p>
                </div>

                <div class="login-form">
                    <el-input v-model="name" placeholder="用户名" prefix-icon="message" />
                    <el-input v-model="password" type="password" placeholder="密码" prefix-icon="lock" show-password />

                    <div class="terms">
                        <el-checkbox v-model="agreed">
                            同意协议

                        </el-checkbox>
                    </div>

                    <el-button type="primary" @Click="login" class="start-btn" round>
                        开始探索
                    </el-button>

                    <div class="social-login">
                        <div class="login-divider">
                            <span>其他方式登录</span>
                        </div>
                        <div class="social-icons">
                            <el-button circle><i class="fab fa-google"></i></el-button>
                            <el-button circle><i class="fab fa-facebook-f"></i></el-button>
                            <el-button circle><i class="fab fa-twitter"></i></el-button>
                            <el-button circle><i class="fab fa-github"></i></el-button>
                        </div>
                    </div>

                    <div class="login-footer">
                        没有账户? <el-link type="primary" @click="toRegister">注册</el-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import router from '@/routers/router'
import coreaxios from '@/functions/coreaxios'
import { ElMessage } from 'element-plus'
import { createWebSocket } from '@/functions/websocket'
import { setLoginCondition } from '@/functions/login'

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
.login-container {
    min-height: 100vh;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;


}



.login-content {
    display: flex;
    width: 100%;
    max-width: 1200px;
    background: transparent;
    gap: 2rem;
    margin: 1rem;
}

.left-panel {
    flex: 1;
    background: #6366f1;
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 600px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-weight: 500;
}

.code-icon {
    font-weight: bold;
}

.hero-content {
    margin: 4rem 0;
}

.hero-content h1 {
    color: white;
    font-size: 3rem;
    margin: 0.5rem 0;
    font-weight: 600;
}

.watch-demo-btn {
    margin-top: 2rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
}



.right-panel {
    flex: 1;
    color: white;
}

.login-header {
    margin-bottom: 2rem;
}

.join-text h3 {
    margin: 0;
    font-size: 1.2rem;
}

.join-text p {
    margin: 0.5rem 0;
    color: #888;
}

.description {
    color: #888;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 1rem 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.terms {
    margin: 1rem 0;
}

:deep(.el-checkbox__label) {
    color: #888;
}

.start-btn {
    background: #6366f1;
    border: none;
    height: 45px;
    font-size: 1rem;
}

.login-divider {
    text-align: center;
    color: #888;
    margin: 1.5rem 0;
    position: relative;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

:deep(.el-button.is-circle) {
    background: #2a2a2a;
    border: none;
    color: #888;
}

.login-footer {
    text-align: center;
    color: #888;
    margin-top: 1.5rem;
}

/* 添加移动端响应式样式 */
@media screen and (max-width: 768px) {
    .login-content {
        flex-direction: column;
        gap: 1rem;
        margin: 1rem;
    }

    .left-panel {
        min-height: auto;
        padding: 1.5rem;
    }

    .hero-content h1 {
        font-size: 2rem;
    }

    .right-panel {
        padding: 1rem;
    }

    .login-form {
        gap: 0.8rem;
    }

    .social-icons {
        flex-wrap: wrap;
    }

    .description {
        font-size: 0.85rem;
    }

    .watch-demo-btn {
        margin-top: 1rem;
        padding: 0.6rem 1.2rem;
    }
}

@media screen and (max-width: 480px) {
    .hero-content h1 {
        font-size: 1.5rem;
    }

    .login-header {
        margin-bottom: 1rem;
    }

    .join-text h3 {
        font-size: 1rem;
    }

    .social-icons {
        gap: 0.5rem;
    }
}
</style>