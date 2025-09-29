<template>
    <div class="getting-started-page">
        <!-- 导航栏 -->
        <Header />

        <!-- 个人中心内容 -->
        <main class="container">
            <div class="profile-container">
                <!-- 侧边栏 -->
                <div class="profile-sidebar">
                    <div class="profile-info">
                        <div class="profile-avatar">JS</div>
                        <h2 class="profile-name">张三</h2>
                        <p class="profile-username">@zhangsan</p>
                        <p class="profile-bio">前端开发工程师 | 终身学习者 | 热爱编程与分享</p>
                    </div>

                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">13</div>
                            <div class="stat-label">课程</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">65%</div>
                            <div class="stat-label">完成率</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">42</div>
                            <div class="stat-label">学习天数</div>
                        </div>
                    </div>

                    <div class="profile-menu">
                        <router-link to="/profile" class="menu-item" :class="{ active: activeMenu === 'profile' }"
                            @click.prevent="setActiveMenu('profile')">
                            <i class="fas fa-user"></i>
                            <span>个人信息</span>
                        </router-link>
                        <router-link to="/my-stats" class="menu-item" :class="{ active: activeMenu === 'stats' }"
                            @click.prevent="setActiveMenu('stats')">
                            <i class="fas fa-chart-line"></i>
                            <span>学习统计</span>
                        </router-link>
                        <router-link to="/my-cert" class="menu-item" :class="{ active: activeMenu === 'certificates' }"
                            @click.prevent="setActiveMenu('certificates')">
                            <i class="fas fa-certificate"></i>
                            <span>我的证书</span>
                        </router-link>
                        <router-link to="/account-settings" class="menu-item"
                            :class="{ active: activeMenu === 'settings' }" @click.prevent="setActiveMenu('settings')">
                            <i class="fas fa-cog"></i>
                            <span>账户设置</span>
                        </router-link>
                        <router-link to="/help" class="menu-item" :class="{ active: activeMenu === 'help' }"
                            @click.prevent="setActiveMenu('help')">
                            <i class="fas fa-question-circle"></i>
                            <span>帮助与支持</span>
                        </router-link>
                        <router-link to="/logout" class="menu-item" :class="{ active: activeMenu === 'logout' }"
                            @click="setActiveMenu('logout')">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>退出登录</span>
                        </router-link>
                    </div>
                </div>

                <!-- 主要内容区域 -->
                <div class="profile-content">
                    <!-- 入门指南页面内容 -->
                    <div class="content-section">
                        <div class="getting-started-hero">
                            <h1>欢迎来到 StudyRaid!</h1>
                            <p>本指南将帮助您快速了解如何使用我们的平台开始您的学习之旅</p>
                        </div>

                        <div class="steps-container">
                            <div class="step-card" v-for="step in steps" :key="step.number">
                                <div class="step-number">{{ step.number }}</div>
                                <div class="step-content">
                                    <h3 class="step-title">{{ step.title }}</h3>
                                    <p class="step-description">{{ step.description }}</p>
                                    <div class="step-actions">
                                        <a v-for="action in step.actions" :key="action.text" :href="action.href"
                                            :class="['btn', action.primary ? 'btn-primary' : 'btn-secondary']"
                                            @click.prevent="handleAction(action)">
                                            {{ action.text }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="section-header">
                            <h3 class="section-title">快速提示</h3>
                        </div>

                        <div class="quick-tips">
                            <div class="tip-card" v-for="tip in quickTips" :key="tip.title">
                                <div class="tip-icon">
                                    <i :class="tip.icon"></i>
                                </div>
                                <h4 class="tip-title">{{ tip.title }}</h4>
                                <p class="tip-description">{{ tip.description }}</p>
                            </div>
                        </div>

                        <div class="section-header">
                            <h3 class="section-title">常见问题</h3>
                        </div>

                        <div class="faq-list">
                            <div class="faq-item" v-for="(faq, index) in faqs" :key="index"
                                :class="{ active: activeFaq === index }">
                                <div class="faq-question" @click="toggleFaq(index)">
                                    <div class="faq-question-text">{{ faq.question }}</div>
                                    <div class="faq-toggle">
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                </div>
                                <div class="faq-answer" v-html="faq.answer"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 页脚 -->
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 响应式数据
const activeMenu = ref('help')
const activeFaq = ref(null)

// 步骤数据
const steps = ref([
    {
        number: 1,
        title: '创建您的账户',
        description: '注册并完善您的个人资料，让系统为您推荐最适合的课程。',
        actions: [
            { text: '完善资料', href: 'profile-setting.html', primary: true }
        ]
    },
    {
        number: 2,
        title: '探索课程',
        description: '浏览我们的课程库，找到您感兴趣的领域和技能。',
        actions: [
            { text: '浏览课程', href: 'index.html', primary: true },
            { text: '学习路径', href: '#', primary: false }
        ]
    },
    {
        number: 3,
        title: '开始学习',
        description: '选择课程并开始学习，按照您自己的节奏前进。',
        actions: [
            { text: '我的课程', href: 'my-courses.html', primary: true }
        ]
    },
    {
        number: 4,
        title: '跟踪进度',
        description: '查看您的学习统计和进度，保持学习动力。',
        actions: [
            { text: '学习统计', href: 'my-stat.html', primary: true },
            { text: '我的证书', href: 'my-certificate.html', primary: false }
        ]
    }
])

// 快速提示数据
const quickTips = ref([
    {
        icon: 'fas fa-bookmark',
        title: '收藏课程',
        description: '将感兴趣的课程加入收藏，方便以后学习'
    },
    {
        icon: 'fas fa-bell',
        title: '设置提醒',
        description: '开启学习提醒，保持学习习惯'
    },
    {
        icon: 'fas fa-download',
        title: '离线学习',
        description: '下载课程内容，随时随地学习'
    },
    {
        icon: 'fas fa-users',
        title: '加入社区',
        description: '与其他学习者交流，共同进步'
    }
])

// 常见问题数据
const faqs = ref([
    {
        question: '如何选择适合我的课程？',
        answer: '我们建议您首先考虑您的学习目标和兴趣领域。您可以使用我们的"学习路径"功能，它会根据您的目标和当前技能水平推荐合适的课程序列。此外，每门课程都有详细的描述、难度评级和用户评价，帮助您做出选择。'
    },
    {
        question: '学习进度会在不同设备间同步吗？',
        answer: '是的，您的学习进度会自动保存并同步到云端。无论您使用电脑、平板还是手机登录StudyRaid，都能从上次离开的地方继续学习。'
    },
    {
        question: '如何获得课程证书？',
        answer: '完成课程所有章节并通过最终测验后，系统会自动生成证书。您可以在"我的证书"页面查看和下载证书。部分高级课程可能需要完成额外的项目作业才能获得证书。'
    },
    {
        question: '遇到技术问题怎么办？',
        answer: '如果您遇到任何技术问题，可以通过以下方式获取帮助：<ul><li>查看我们的<a href="help-support.html">帮助与支持</a>页面</li><li>通过电子邮件联系我们的技术支持团队</li><li>在工作时间使用在线客服功能</li></ul>'
    }
])

// 方法
const setActiveMenu = (menu) => {
    activeMenu.value = menu
}

const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const handleAction = (action) => {
    // 这里可以添加路由跳转或其他逻辑
    console.log('执行动作:', action.text)
    // 如果是外部链接，可以使用 window.location.href = action.href
}

const logout = () => {
    // 退出登录逻辑
    console.log('退出登录')
}

// 生命周期
onMounted(() => {
    // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
/* 个人中心布局 */
.profile-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    margin: 24px 0;
}

/* 侧边栏 */
.profile-sidebar {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
    height: fit-content;
    position: sticky;
    top: 90px;
}

.profile-info {
    padding: 24px;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
    margin: 0 auto 16px;
}

.profile-name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 4px;
}

.profile-username {
    color: var(--text-tertiary);
    font-size: 14px;
    margin-bottom: 16px;
}

.profile-bio {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
}

.profile-stats {
    display: flex;
    justify-content: space-around;
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
}

.stat-item {
    text-align: center;
}

.stat-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--accent-color);
}

.stat-label {
    font-size: 12px;
    color: var(--text-tertiary);
}

.profile-menu {
    padding: 16px 0;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
}

.menu-item:hover,
.menu-item.active {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
}

.menu-item i {
    width: 20px;
    text-align: center;
}

/* 主要内容区域 */
.profile-content {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.content-section {
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
}

.content-section:last-child {
    border-bottom: none;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
}

.section-action {
    color: var(--accent-color);
    font-size: 14px;
    text-decoration: none;
}

/* 入门指南特定样式 */
.getting-started-hero {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
    border-radius: var(--border-radius);
    margin-bottom: 32px;
}

.getting-started-hero h1 {
    font-size: 32px;
    margin-bottom: 16px;
    color: var(--text-primary);
}

.getting-started-hero p {
    font-size: 18px;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

.steps-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 32px;
}

.step-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 24px;
    display: flex;
    gap: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.step-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
}

.step-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.step-description {
    color: var(--text-secondary);
    margin-bottom: 16px;
}

.step-actions {
    display: flex;
    gap: 12px;
}

.btn {
    padding: 8px 16px;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    text-align: center;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background-color: var(--accent-color);
    color: white;
}

.btn-primary:hover {
    background-color: #4a93e0;
}

.btn-secondary {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--bg-tertiary);
}

.quick-tips {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.tip-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
    text-align: center;
}

.tip-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(88, 166, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: var(--accent-color);
    font-size: 20px;
}

.tip-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.tip-description {
    color: var(--text-tertiary);
    font-size: 14px;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.faq-item {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    overflow: hidden;
}

.faq-question {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.faq-question:hover {
    background-color: var(--bg-secondary);
}

.faq-question-text {
    font-weight: 500;
}

.faq-answer {
    padding: 0 20px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq-item.active .faq-answer {
    padding: 0 20px 20px;
    max-height: 500px;
}

.faq-item.active .faq-toggle i {
    transform: rotate(180deg);
}

.faq-toggle {
    transition: transform 0.2s;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .profile-container {
        grid-template-columns: 1fr;
    }

    .profile-sidebar {
        order: -1;
        position: static;
    }
}

@media (max-width: 768px) {
    .step-card {
        flex-direction: column;
        text-align: center;
    }

    .step-number {
        align-self: center;
    }

    .quick-tips {
        grid-template-columns: 1fr;
    }
}
</style>