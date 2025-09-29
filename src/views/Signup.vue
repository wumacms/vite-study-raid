<template>
    <div class="signup-page">
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
                            <input type="text" placeholder="搜索课程..." v-model="searchQuery">
                        </div>
                        <a href="/profile" class="user-avatar">JS</a>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 注册表单 -->
        <main>
            <div class="signup-container">
                <div class="signup-card">
                    <div class="signup-header">
                        <div class="signup-logo">
                            <i class="fas fa-graduation-cap"></i>
                            StudyRaid
                        </div>
                        <h1 class="signup-title">创建您的账户</h1>
                        <p class="signup-subtitle">开始您的学习之旅</p>
                    </div>

                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <label for="fullName" class="form-label">姓名</label>
                            <input type="text" id="fullName" class="form-input" :class="{ error: errors.name }"
                                placeholder="请输入您的姓名" v-model="formData.name" @blur="validateName" required>
                            <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
                        </div>

                        <div class="form-group">
                            <label for="email" class="form-label">邮箱地址</label>
                            <input type="email" id="email" class="form-input" :class="{ error: errors.email }"
                                placeholder="请输入您的邮箱" v-model="formData.email" @blur="validateEmail" required>
                            <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">密码</label>
                            <input type="password" id="password" class="form-input" :class="{ error: errors.password }"
                                placeholder="请输入密码" v-model="formData.password" @input="handlePasswordInput" required>
                            <div class="password-strength">
                                <div class="strength-bar" :class="passwordStrengthClass"></div>
                            </div>
                            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword" class="form-label">确认密码</label>
                            <input type="password" id="confirmPassword" class="form-input"
                                :class="{ error: errors.confirmPassword }" placeholder="请再次输入密码"
                                v-model="formData.confirmPassword" @blur="validateConfirmPassword" required>
                            <div class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
                        </div>

                        <div class="form-options">
                            <label class="terms-agreement">
                                <input type="checkbox" id="agreeTerms" v-model="formData.agreeTerms" required>
                                <span>我同意 <a href="/terms">服务条款</a> 和 <a href="/privacy">隐私政策</a></span>
                            </label>
                        </div>

                        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                            {{ isSubmitting ? '注册中...' : '创建账户' }}
                        </button>
                    </form>

                    <div class="divider">
                        <span>或</span>
                    </div>

                    <div class="social-signup">
                        <button class="btn btn-social" @click="handleSocialSignup('GitHub')">
                            <i class="fab fa-github"></i>
                            使用 GitHub 注册
                        </button>
                        <button class="btn btn-social" @click="handleSocialSignup('Google')">
                            <i class="fab fa-google"></i>
                            使用 Google 注册
                        </button>
                    </div>

                    <div class="login-link">
                        已有账户？
                        <router-link to="/login">立即登录</router-link>
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
import { ref, reactive, computed } from 'vue'

// 响应式数据
const searchQuery = ref('')
const isSubmitting = ref(false)

// 表单数据
const formData = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
})

// 错误信息
const errors = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
})

// 密码强度计算
const passwordStrength = computed(() => {
    const password = formData.password
    let strength = 0

    if (!password) return 0

    // 长度检查
    if (password.length >= 8) strength++

    // 包含小写字母
    if (/[a-z]/.test(password)) strength++

    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++

    // 包含数字
    if (/[0-9]/.test(password)) strength++

    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength++

    return strength
})

// 密码强度样式类
const passwordStrengthClass = computed(() => {
    if (formData.password.length === 0) return ''

    if (passwordStrength.value <= 2) return 'strength-weak'
    if (passwordStrength.value <= 4) return 'strength-medium'
    return 'strength-strong'
})

// 验证函数
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

const validatePassword = (password) => {
    if (password.length < 8) {
        return false
    }

    // 检查是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return hasLetter && hasNumber
}

// 表单验证方法
const validateName = () => {
    if (!formData.name.trim()) {
        errors.name = '请输入您的姓名'
    } else {
        errors.name = ''
    }
}

const validateEmailField = () => {
    if (!formData.email) {
        errors.email = '请输入邮箱地址'
    } else if (!validateEmail(formData.email)) {
        errors.email = '请输入有效的邮箱地址'
    } else {
        errors.email = ''
    }
}

const validatePasswordField = () => {
    if (!validatePassword(formData.password)) {
        errors.password = '密码必须至少8个字符，包含字母和数字'
    } else {
        errors.password = ''
    }
}

const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
    } else {
        errors.confirmPassword = ''
    }
}

// 密码输入处理
const handlePasswordInput = () => {
    validatePasswordField()

    // 如果确认密码已输入，验证是否匹配
    if (formData.confirmPassword) {
        validateConfirmPassword()
    }
}

// 表单提交处理
const handleSubmit = async () => {
    // 验证所有字段
    validateName()
    validateEmailField()
    validatePasswordField()
    validateConfirmPassword()

    // 检查是否有错误
    const hasErrors = Object.values(errors).some(error => error !== '')

    // 验证条款同意
    if (!formData.agreeTerms) {
        alert('请同意服务条款和隐私政策')
        return
    }

    if (!hasErrors) {
        isSubmitting.value = true

        // 模拟API调用延迟
        setTimeout(() => {
            alert('注册成功！请检查您的邮箱以验证账户。')
            // 在实际应用中，这里会进行路由跳转
            // router.push('/')
            isSubmitting.value = false
        }, 1500)
    }
}

// 社交注册处理
const handleSocialSignup = (provider) => {
    alert(`即将跳转到 ${provider} 授权页面`)
}
</script>

<style scoped>
/* 注册页面主要内容 */
.signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 40px 0;
}

.signup-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow);
}

.signup-header {
    text-align: center;
    margin-bottom: 32px;
}

.signup-logo {
    font-size: 32px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.signup-logo i {
    margin-right: 12px;
    color: var(--accent-color);
}

.signup-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
}

.signup-subtitle {
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

.password-strength {
    margin-top: 8px;
    height: 4px;
    background-color: var(--bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
}

.strength-bar {
    height: 100%;
    width: 0%;
    transition: width 0.3s, background-color 0.3s;
}

.strength-weak {
    background-color: var(--danger-color);
    width: 33%;
}

.strength-medium {
    background-color: var(--warning-color);
    width: 66%;
}

.strength-strong {
    background-color: var(--success-color);
    width: 100%;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
}

.terms-agreement {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    color: var(--text-secondary);
}

.terms-agreement input {
    accent-color: var(--accent-color);
    margin-top: 2px;
}

.terms-agreement a {
    color: var(--accent-color);
    text-decoration: none;
}

.terms-agreement a:hover {
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

.social-signup {
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

.login-link {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-tertiary);
}

.login-link a {
    color: var(--accent-color);
    text-decoration: none;
    margin-left: 4px;
}

.login-link a:hover {
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

    .signup-card {
        padding: 24px;
        margin: 0 16px;
    }
}
</style>