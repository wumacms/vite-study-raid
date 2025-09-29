<template>
    <div class="forgot-password-page">
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

        <!-- 忘记密码表单 -->
        <main>
            <div class="forgot-container">
                <div class="forgot-card">
                    <div class="forgot-header">
                        <div class="forgot-logo">
                            <i class="fas fa-graduation-cap"></i>
                            StudyRaid
                        </div>
                        <h1 class="forgot-title">重置密码</h1>
                        <p class="forgot-subtitle">按照步骤重置您的账户密码</p>
                    </div>

                    <!-- 步骤指示器 -->
                    <div class="steps">
                        <div v-for="step in steps" :key="step.id" class="step" :class="{
                            'active': currentStep === step.id,
                            'completed': currentStep > step.id
                        }">
                            <div class="step-number">{{ step.id }}</div>
                            <div class="step-label">{{ step.label }}</div>
                        </div>
                    </div>

                    <!-- 步骤1：验证邮箱 -->
                    <div class="step-content" :class="{ 'active': currentStep === 1 }">
                        <form @submit.prevent="handleEmailSubmit">
                            <div class="form-group">
                                <label for="email" class="form-label">邮箱地址</label>
                                <input type="email" id="email" class="form-input" :class="{ 'error': emailError }"
                                    placeholder="请输入您的邮箱" v-model="email" required>
                                <div class="error-message" v-if="emailError">{{ emailErrorMessage }}</div>
                            </div>

                            <button type="submit" class="btn btn-primary" :disabled="isSendingCode">
                                {{ isSendingCode ? '发送中...' : '发送验证码' }}
                            </button>
                        </form>

                        <div class="login-link">
                            记起密码了？
                            <router-link to="/login">返回登录</router-link>
                        </div>
                    </div>

                    <!-- 步骤2：输入验证码 -->
                    <div class="step-content" :class="{ 'active': currentStep === 2 }">
                        <p class="forgot-subtitle" style="text-align: center; margin-bottom: 20px;">
                            验证码已发送至 <span style="color: var(--accent-color);">{{ email }}</span>
                        </p>

                        <form @submit.prevent="handleCodeSubmit">
                            <div class="form-group">
                                <label for="verificationCode" class="form-label">验证码</label>
                                <input type="text" id="verificationCode" class="form-input"
                                    :class="{ 'error': codeError }" placeholder="请输入6位验证码" maxlength="6"
                                    v-model="verificationCode" required>
                                <div class="error-message" v-if="codeError">请输入有效的验证码</div>
                            </div>

                            <div class="form-group">
                                <div style="display: flex; gap: 10px;">
                                    <button type="submit" class="btn btn-primary" :disabled="isVerifyingCode">
                                        {{ isVerifyingCode ? '验证中...' : '验证' }}
                                    </button>
                                    <button type="button" class="btn btn-secondary" @click="handleResendCode"
                                        :disabled="isResendingCode || countdown > 0">
                                        {{ countdown > 0 ? `重新发送(${countdown})` : '重新发送' }}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div class="login-link">
                            没有收到验证码？
                            <a href="#" @click.prevent="currentStep = 1">更换邮箱</a>
                        </div>
                    </div>

                    <!-- 步骤3：设置新密码 -->
                    <div class="step-content" :class="{ 'active': currentStep === 3 }">
                        <form @submit.prevent="handlePasswordSubmit">
                            <div class="form-group">
                                <label for="newPassword" class="form-label">新密码</label>
                                <input type="password" id="newPassword" class="form-input"
                                    :class="{ 'error': newPasswordError }" placeholder="请输入新密码" v-model="newPassword"
                                    required>
                                <div class="error-message" v-if="newPasswordError">
                                    密码必须至少8个字符，包含字母和数字
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="confirmNewPassword" class="form-label">确认新密码</label>
                                <input type="password" id="confirmNewPassword" class="form-input"
                                    :class="{ 'error': confirmNewPasswordError }" placeholder="请再次输入新密码"
                                    v-model="confirmNewPassword" required>
                                <div class="error-message" v-if="confirmNewPasswordError">
                                    两次输入的密码不一致
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary" :disabled="isResettingPassword">
                                {{ isResettingPassword ? '重置中...' : '重置密码' }}
                            </button>
                        </form>

                        <div class="success-message" v-if="resetSuccess">
                            <i class="fas fa-check-circle"></i> 密码重置成功！即将跳转到登录页面...
                        </div>
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
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const currentStep = ref(1)
const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const countdown = ref(0)
const resetSuccess = ref(false)

// 加载状态
const isSendingCode = ref(false)
const isVerifyingCode = ref(false)
const isResendingCode = ref(false)
const isResettingPassword = ref(false)

// 错误状态
const emailError = ref(false)
const codeError = ref(false)
const newPasswordError = ref(false)
const confirmNewPasswordError = ref(false)

// 错误消息
const emailErrorMessage = ref('请输入有效的邮箱地址')

// 步骤配置
const steps = reactive([
    { id: 1, label: '验证邮箱' },
    { id: 2, label: '验证码' },
    { id: 3, label: '新密码' }
])

// 倒计时定时器
let countdownInterval = null

// 验证邮箱
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// 验证密码
const validatePassword = (password) => {
    if (password.length < 8) {
        return false
    }

    // 检查是否包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return hasLetter && hasNumber
}

// 开始倒计时
const startCountdown = () => {
    countdown.value = 60
    countdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(countdownInterval)
        }
    }, 1000)
}

// 步骤1：发送验证码
const handleEmailSubmit = async () => {
    // 重置错误状态
    emailError.value = false

    // 验证邮箱
    if (!email.value) {
        emailError.value = true
        emailErrorMessage.value = '请输入邮箱地址'
        return
    } else if (!validateEmail(email.value)) {
        emailError.value = true
        emailErrorMessage.value = '请输入有效的邮箱地址'
        return
    }

    // 模拟发送验证码
    isSendingCode.value = true

    try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 更新步骤
        currentStep.value = 2

        // 开始倒计时
        startCountdown()

        // 模拟发送成功提示
        alert('验证码已发送到您的邮箱，请查收。')
    } finally {
        isSendingCode.value = false
    }
}

// 步骤2：验证验证码
const handleCodeSubmit = async () => {
    // 重置错误状态
    codeError.value = false

    // 验证验证码
    if (!verificationCode.value || verificationCode.value.length !== 6) {
        codeError.value = true
        return
    }

    // 模拟验证验证码
    isVerifyingCode.value = true

    try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 更新步骤
        currentStep.value = 3

        // 清除倒计时
        clearInterval(countdownInterval)
        countdown.value = 0
    } finally {
        isVerifyingCode.value = false
    }
}

// 重新发送验证码
const handleResendCode = async () => {
    isResendingCode.value = true

    try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 开始倒计时
        startCountdown()

        // 模拟发送成功提示
        alert('验证码已重新发送到您的邮箱，请查收。')
    } finally {
        isResendingCode.value = false
    }
}

// 步骤3：设置新密码
const handlePasswordSubmit = async () => {
    // 重置错误状态
    newPasswordError.value = false
    confirmNewPasswordError.value = false

    let isValid = true

    // 验证新密码
    if (!validatePassword(newPassword.value)) {
        newPasswordError.value = true
        isValid = false
    }

    // 验证确认密码
    if (newPassword.value !== confirmNewPassword.value) {
        confirmNewPasswordError.value = true
        isValid = false
    }

    if (!isValid) return

    // 模拟重置密码
    isResettingPassword.value = true

    try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 显示成功消息
        resetSuccess.value = true

        // 跳转到登录页面
        setTimeout(() => {
            router.push('/login')
        }, 2000)
    } finally {
        isResettingPassword.value = false
    }
}

// 组件卸载时清理定时器
onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }
})
</script>

<style scoped>
/* 忘记密码页面主要内容 */
.forgot-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 40px 0;
}

.forgot-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 32px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow);
}

.forgot-header {
    text-align: center;
    margin-bottom: 32px;
}

.forgot-logo {
    font-size: 32px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.forgot-logo i {
    margin-right: 12px;
    color: var(--accent-color);
}

.forgot-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
}

.forgot-subtitle {
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

.success-message {
    color: var(--success-color);
    font-size: 14px;
    margin-top: 16px;
    text-align: center;
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

.btn-secondary {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
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

    .forgot-card {
        padding: 24px;
        margin: 0 16px;
    }
}

/* 步骤指示器 */
.steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    position: relative;
}

.steps::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--border-color);
    z-index: 1;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
}

.step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    transition: all 0.3s;
}

.step.active .step-number {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
}

.step.completed .step-number {
    background-color: var(--success-color);
    border-color: var(--success-color);
    color: white;
}

.step.completed .step-number::after {
    content: '✓';
}

.step-label {
    font-size: 12px;
    color: var(--text-tertiary);
}

.step.active .step-label {
    color: var(--text-primary);
}

.step-content {
    display: none;
}

.step-content.active {
    display: block;
}
</style>