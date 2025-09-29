<template>
    <div class="login-page">
        <!-- 导航栏 -->
        <header>
            <div class="container">
                <nav class="navbar">
                    <router-link to="/" class="logo">
                        <i class="fas fa-graduation-cap"></i>
                        StudyRaid
                    </router-link>

                    <div class="nav-links">
                        <router-link to="/">首页</router-link>
                        <router-link to="/explore">发现</router-link>
                        <router-link to="/learning-path">学习路径</router-link>
                        <router-link to="/progress-tracking">进度跟踪</router-link>
                        <router-link to="/my-courses">我的课程</router-link>
                    </div>

                    <div class="user-menu">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="搜索课程..." v-model="searchQuery" @keyup.enter="handleSearch">
                        </div>
                        <div class="user-avatar">JS</div>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 登录表单 -->
        <main>
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">
                            <i class="fas fa-graduation-cap"></i>
                            StudyRaid
                        </div>
                        <h1 class="login-title">登录到您的账户</h1>
                        <p class="login-subtitle">继续您的学习之旅</p>
                    </div>

                    <form @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label for="email" class="form-label">邮箱地址</label>
                            <input type="email" id="email" class="form-input" :class="{ error: emailError }"
                                placeholder="请输入您的邮箱" v-model="email" @blur="validateEmail" required>
                            <div class="error-message" v-show="emailError">{{ emailErrorMessage }}</div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">密码</label>
                            <input type="password" id="password" class="form-input" :class="{ error: passwordError }"
                                placeholder="请输入您的密码" v-model="password" @blur="validatePassword" required>
                            <div class="error-message" v-show="passwordError">密码不能为空</div>
                        </div>

                        <div class="form-options">
                            <label class="remember-me">
                                <input type="checkbox" id="rememberMe" v-model="rememberMe">
                                <span>记住我</span>
                            </label>
                            <router-link to="/forgot-password" class="forgot-password">忘记密码？</router-link>
                        </div>

                        <button type="submit" class="btn btn-primary" :disabled="isLoggingIn">
                            {{ isLoggingIn ? '登录中...' : '登录' }}
                        </button>
                    </form>

                    <div class="divider">
                        <span>或</span>
                    </div>

                    <div class="social-login">
                        <button class="btn btn-social" @click="handleSocialLogin('GitHub')">
                            <i class="fab fa-github"></i>
                            使用 GitHub 登录
                        </button>
                        <button class="btn btn-social" @click="handleSocialLogin('Google')">
                            <i class="fab fa-google"></i>
                            使用 Google 登录
                        </button>
                    </div>

                    <div class="signup-link">
                        还没有账户？
                        <router-link to="/signup">立即注册</router-link>
                    </div>
                </div>
            </div>
        </main>

        <!-- 页脚 -->
        <footer>
            <div class="container">
                <p>© 2023 StudyRaid. 保留所有权利。</p>
                <p>采用 GitHub 深色风格设计</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const searchQuery = ref('')
const isLoggingIn = ref(false)

// 错误状态
const emailError = ref(false)
const passwordError = ref(false)
const emailErrorMessage = ref('请输入有效的邮箱地址')

// 邮箱验证函数
const validateEmail = () => {
    if (!email.value) {
        emailError.value = true
        emailErrorMessage.value = '请输入邮箱地址'
        return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.value = true
        emailErrorMessage.value = '请输入有效的邮箱地址'
        return false
    } else {
        emailError.value = false
        return true
    }
}

// 密码验证函数
const validatePassword = () => {
    if (!password.value) {
        passwordError.value = true
        return false
    } else {
        passwordError.value = false
        return true
    }
}

// 登录处理
const handleLogin = () => {
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (isEmailValid && isPasswordValid) {
        isLoggingIn.value = true

        // 模拟API调用延迟
        setTimeout(() => {
            alert('登录成功！')
            router.push('/')
            isLoggingIn.value = false
        }, 1500)
    }
}

// 社交登录处理
const handleSocialLogin = (provider) => {
    alert(`即将跳转到 ${provider} 授权页面`)
}

// 搜索处理
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        // 这里可以添加搜索逻辑
        console.log('搜索:', searchQuery.value)
    }
}
</script>

<style scoped>
/* 登录页面主要内容 */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 40px 0;
}

.login-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow);
}

.login-header {
    text-align: center;
    margin-bottom: 32px;
}

.login-logo {
    font-size: 32px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-logo i {
    margin-right: 12px;
    color: var(--accent-color);
}

.login-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
}

.login-subtitle {
    color: var(--text-tertiary);
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
}

.form-input {
    width: 100%;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 12px 16px;
    color: var(--text-primary);
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-color);
}

.form-input.error {
    border-color: var(--danger-color);
}

.error-message {
    color: var(--danger-color);
    font-size: 12px;
    margin-top: 6px;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
}

.remember-me input {
    accent-color: var(--accent-color);
}

.forgot-password {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password:hover {
    color: #4a93e0;
    text-decoration: underline;
}

.btn {
    padding: 12px 16px;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    text-align: center;
    text-decoration: none;
    display: block;
    width: 100%;
}

.btn-primary {
    background-color: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background-color: #4a93e0;
}

.btn-primary:disabled {
    background-color: var(--bg-tertiary);
    color: var(--text-tertiary);
    cursor: not-allowed;
}

.divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: var(--text-tertiary);
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--border-color);
}

.divider span {
    padding: 0 16px;
}

.social-login {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.btn-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-social:hover {
    background-color: var(--bg-secondary);
}

.signup-link {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-tertiary);
}

.signup-link a {
    color: var(--accent-color);
    text-decoration: none;
    margin-left: 4px;
}

.signup-link a:hover {
    text-decoration: underline;
}

/* 页脚 */
footer {
    border-top: 1px solid var(--border-color);
    padding: 24px 0;
    margin-top: 40px;
    text-align: center;
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 16px;
    }

    .nav-links {
        order: 3;
        width: 100%;
        justify-content: center;
    }

    .search-box input {
        width: 200px;
    }

    .login-card {
        padding: 24px;
        margin: 0 16px;
    }
}
</style>