<template>
    <div class="register-container">
        <div class="register-content">

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
                <div class="register-header">
                    <h2>创建账户</h2>
                    <p class="description">
                        牛逼介绍
                    </p>
                </div>

                <div class="register-form">
                    <div class="name-fields" :class="{ usernamerepeat: condition == false }">
                        <el-input v-model="name" placeholder="用户名" prefix-icon="user" />

                    </div>
                    <el-text v-if="condition == false" type="error">用户名已存在</el-text>
                    <!-- <el-input v-model="email" placeholder="邮箱未开通" prefix-icon="message" /> -->

                    <el-input v-model="password" type="password" placeholder="密码" prefix-icon="lock" show-password />

                    <el-input v-model="confirmPassword" type="password" placeholder="确认密码" prefix-icon="lock"
                        show-password />

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
                        <el-checkbox v-model="agreeTerms">
                            同意协议
                        </el-checkbox>
                    </div>

                    <el-button type="primary" @click="register" class="register-btn" round>
                        创建账户
                    </el-button>

                    <div class="social-register">
                        <div class="register-divider">
                            <span>其他注册方式</span>
                        </div>
                        <div class="social-icons">
                            <el-button circle><i class="fab fa-google"></i></el-button>
                            <el-button circle><i class="fab fa-github"></i></el-button>
                        </div>
                    </div>

                    <div class="register-footer">
                        已经拥有账户? <el-link type="primary" @click="toLogin">登录</el-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import router from '@/routers/router'
import coreaxios from '@/functions/coreaxios'
import { getRandomUserImage } from '@/functions/randomimage'
import { ElMessage } from 'element-plus'

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

.register-container {
    min-height: 100vh;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;

}

.register-content {
    display: flex;
    width: 100%;
    max-width: 1200px;
    background: transparent;
    gap: 2rem;
    margin: 2rem;
    flex-direction: row;
}

.left-panel {
    flex: 1;
    background: #6366f1;
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 700px;
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

.hero-description {
    color: rgba(255, 255, 255, 0.9);
    margin: 2rem 0;
    line-height: 1.6;
    font-size: 1.1rem;
}

.explore-btn {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
}



.right-panel {
    flex: 1;
    color: white;
}

.register-header {
    margin-bottom: 2rem;
}

.register-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
}

.description {
    color: #888;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 1rem 0;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.name-fields {
    display: flex;
    gap: 1rem;
}



.password-requirements {
    background: #2a2a2a;
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
    color: #6366f1;
}

.password-requirements li.active::before {
    content: "✓";
}

.terms {
    margin: 1rem 0;
}

:deep(.el-checkbox__label) {
    color: #888;
}

.register-btn {
    background: #6366f1;
    border: none;
    height: 45px;
    font-size: 1rem;
}

.register-divider {
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

.register-footer {
    text-align: center;
    color: #888;
    margin-top: 1.5rem;
}

@media (max-width: 768px) {
    .register-content {
        flex-direction: column;
        margin: 1rem;
        gap: 1rem;
    }

    .left-panel {
        min-height: auto;
        padding: 1.5rem;
    }

    .hero-content {
        margin: 2rem 0;
    }

    .hero-content h1 {
        font-size: 2rem;
    }

    .right-panel {
        padding: 1rem;
    }

    .register-header h2 {
        font-size: 1.5rem;
    }

    .name-fields {
        flex-direction: column;
    }

    .password-requirements {
        font-size: 0.8rem;
    }

    .social-icons {
        gap: 0.5rem;
    }

    .register-btn {
        height: 40px;
    }
}

@media (max-width: 480px) {
    .register-content {
        margin: 0.5rem;
    }

    .hero-content h1 {
        font-size: 1.8rem;
    }

    .password-requirements {
        padding: 0.8rem;
    }

    .register-header {
        margin-bottom: 1rem;
    }

    .register-form {
        gap: 0.8rem;
    }
}
</style>