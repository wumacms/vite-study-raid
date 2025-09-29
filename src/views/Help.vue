<template>
    <div class="help-page">
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
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">帮助与支持</h3>
                        </div>

                        <div class="help-search">
                            <div class="help-search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" placeholder="搜索帮助内容..." v-model="searchTerm" @input="handleSearch">
                            </div>
                        </div>

                        <div class="help-categories">
                            <div class="help-category" v-for="category in helpCategories" :key="category.id"
                                :data-category="category.id" @click="handleCategoryClick(category.id)">
                                <div class="help-category-icon">
                                    <i :class="category.icon"></i>
                                </div>
                                <h4 class="help-category-title">{{ category.title }}</h4>
                                <p class="help-category-desc">{{ category.description }}</p>
                            </div>
                        </div>

                        <div class="faq-section">
                            <h3 class="section-title">常见问题</h3>
                            <div class="faq-list">
                                <div class="faq-item" v-for="(faq, index) in filteredFaqs" :key="index"
                                    :class="{ active: faq.active }">
                                    <div class="faq-question" @click="toggleFaq(index)">
                                        <div class="faq-question-text">{{ faq.question }}</div>
                                        <div class="faq-toggle">
                                            <i class="fas fa-chevron-down"></i>
                                        </div>
                                    </div>
                                    <div class="faq-answer">
                                        <p>{{ faq.answer }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="contact-options">
                            <div class="contact-option" v-for="option in contactOptions" :key="option.title">
                                <div class="contact-option-icon">
                                    <i :class="option.icon"></i>
                                </div>
                                <h4 class="contact-option-title">{{ option.title }}</h4>
                                <p class="contact-option-desc">{{ option.description }}</p>
                                <a v-if="option.type === 'email'" :href="`mailto:${option.action}`"
                                    class="btn btn-primary">
                                    发送邮件
                                </a>
                                <button v-else-if="option.type === 'chat'" class="btn btn-secondary" @click="startChat">
                                    {{ option.buttonText }}
                                </button>
                                <a v-else href="#" class="btn btn-secondary">
                                    {{ option.buttonText }}
                                </a>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 获取路由实例
const router = useRouter()


// 响应式数据
const searchTerm = ref('')
const faqs = ref([
    {
        question: '如何重置我的密码？',
        answer: '要重置密码，请前往登录页面并点击"忘记密码"链接。系统将向您的注册邮箱发送重置链接，点击链接后即可设置新密码。',
        active: false
    },
    {
        question: '课程证书如何获取？',
        answer: '完成课程所有章节并通过最终测验后，系统会自动生成证书。您可以在"我的证书"页面查看和下载证书。',
        active: false
    },
    {
        question: '学习进度如何同步？',
        answer: '您的学习进度会自动保存并同步到云端。无论您使用哪种设备登录，都能从上次离开的地方继续学习。',
        active: false
    },
    {
        question: '如何取消订阅？',
        answer: '前往"账户设置"页面，在"订阅管理"部分可以取消当前订阅。取消后，您仍然可以访问已购买的课程内容。',
        active: false
    },
    {
        question: '课程内容可以下载吗？',
        answer: '部分课程提供离线下载功能，您可以在课程详情页面查看是否支持下载。下载的内容可在"我的课程"页面的离线内容中查看。',
        active: false
    }
])

const helpCategories = ref([
    {
        id: 'getting-started',
        icon: 'fas fa-rocket',
        title: '入门指南',
        description: '新用户快速上手指南'
    },
    {
        id: 'courses',
        icon: 'fas fa-book',
        title: '课程学习',
        description: '课程相关问题和解答'
    },
    {
        id: 'account',
        icon: 'fas fa-user',
        title: '账户管理',
        description: '账户设置和隐私问题'
    },
    {
        id: 'technical',
        icon: 'fas fa-cog',
        title: '技术问题',
        description: '平台使用中的技术问题'
    }
])

const contactOptions = ref([
    {
        icon: 'fas fa-envelope',
        title: '电子邮件支持',
        description: '24小时内回复',
        type: 'email',
        action: 'support@studyraid.com'
    },
    {
        icon: 'fas fa-comments',
        title: '在线客服',
        description: '工作日 9:00-18:00',
        type: 'chat',
        buttonText: '开始对话'
    },
    {
        icon: 'fas fa-file-alt',
        title: '帮助文档',
        description: '详细使用指南',
        type: 'link',
        buttonText: '查看文档'
    }
])

// 计算属性
const filteredFaqs = computed(() => {
    if (!searchTerm.value) return faqs.value

    const term = searchTerm.value.toLowerCase()
    return faqs.value.filter(faq =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    )
})

// 方法
const toggleFaq = (index) => {
    faqs.value[index].active = !faqs.value[index].active
}

const handleCategoryClick = (categoryId) => {
    // 实际应用中这里会跳转到对应的帮助页面
    if (categoryId === 'getting-started') {
        // 跳转到入门指南页面
        router.push({ name: 'GettingStarted' })
    } else if (categoryId === 'courses') {
        // 跳转到课程学习页面
        router.push({ name: 'CoursePlay' })
    } else if (categoryId === 'account') {
        // 跳转到账户管理页面
        router.push({ name: 'Account' })
    } else if (categoryId === 'technical') {
        // 跳转到技术问题页面
        router.push({ name: 'Technical' })
    }
}

const handleSearch = () => {
    // 搜索逻辑已经在计算属性中处理
}

const startChat = () => {
    alert('正在连接到在线客服，请稍候...')
    // 实际应用中这里会打开聊天窗口
}

// 活跃菜单项
const activeMenu = ref('help')

// 设置活跃菜单项
const setActiveMenu = (menu) => {
    activeMenu.value = menu
    console.log(`当前活跃菜单项：${menu}`)
}

// 菜单项点击功能
onMounted(() => {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
})
</script>

<style scoped>
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

/* 帮助与支持样式 */
.help-search {
    margin-bottom: 24px;
}

.help-search-box {
    position: relative;
    max-width: 600px;
}

.help-search-box input {
    width: 100%;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 12px 16px;
    padding-left: 48px;
    color: var(--text-primary);
    font-size: 16px;
}

.help-search-box i {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: 18px;
}

.help-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.help-category {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 24px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.help-category:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.help-category-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: rgba(88, 166, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: var(--accent-color);
    font-size: 24px;
}

.help-category-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.help-category-desc {
    color: var(--text-tertiary);
    font-size: 14px;
}

.faq-section {
    margin-bottom: 32px;
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

.contact-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.contact-option {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 24px;
    text-align: center;
}

.contact-option-icon {
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

.contact-option-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.contact-option-desc {
    color: var(--text-tertiary);
    font-size: 14px;
    margin-bottom: 16px;
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
    .help-categories {
        grid-template-columns: 1fr;
    }

    .contact-options {
        grid-template-columns: 1fr;
    }
}
</style>