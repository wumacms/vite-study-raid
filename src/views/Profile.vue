<template>
    <!-- 导航栏 -->
    <header>
        <div class="container">
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <i class="fas fa-graduation-cap"></i>
                    StudyRaid
                </a>

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
                    <a href="/profile" class="user-avatar">{{ userInitials }}</a>
                </div>
            </nav>
        </div>
    </header>

    <!-- 个人中心内容 -->
    <main class="container">
        <div class="profile-container">
            <!-- 侧边栏 -->
            <div class="profile-sidebar">
                <div class="profile-info">
                    <div class="profile-avatar">{{ userInitials }}</div>
                    <h2 class="profile-name">{{ userProfile.name }}</h2>
                    <p class="profile-username">@{{ userProfile.username }}</p>
                    <p class="profile-bio">{{ userProfile.bio }}</p>
                </div>

                <div class="profile-stats">
                    <div class="stat-item">
                        <div class="stat-value">{{ userStats.courses }}</div>
                        <div class="stat-label">课程</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ userStats.completionRate }}%</div>
                        <div class="stat-label">完成率</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">{{ userStats.studyDays }}</div>
                        <div class="stat-label">学习天数</div>
                    </div>
                </div>

                <div class="profile-menu">
                    <router-link to="/profile" class="menu-item" :class="{ active: activeMenu === 'profile' }"
                        @click="setActiveMenu('profile')">
                        <i class="fas fa-user"></i>
                        <span>个人信息</span>
                    </router-link>
                    <router-link to="/my-stats" class="menu-item" :class="{ active: activeMenu === 'stats' }"
                        @click="setActiveMenu('stats')">
                        <i class="fas fa-chart-line"></i>
                        <span>学习统计</span>
                    </router-link>
                    <router-link to="/my-cert" class="menu-item" :class="{ active: activeMenu === 'certificates' }"
                        @click="setActiveMenu('certificates')">
                        <i class="fas fa-certificate"></i>
                        <span>我的证书</span>
                    </router-link>
                    <router-link to="/account-settings" class="menu-item" :class="{ active: activeMenu === 'settings' }"
                        @click="setActiveMenu('settings')">
                        <i class="fas fa-cog"></i>
                        <span>账户设置</span>
                    </router-link>
                    <router-link to="/help" class="menu-item" :class="{ active: activeMenu === 'help' }"
                        @click="setActiveMenu('help')">
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
                <!-- 个人信息部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">个人信息</h3>
                        <a href="#" class="section-action" @click.prevent="editProfile">编辑</a>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <div class="stat-card-value">{{ userStats.courses }}</div>
                            <div class="stat-card-label">已学习课程</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-card-value">{{ userStats.studyDays }}</div>
                            <div class="stat-card-label">学习天数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="stat-card-value">{{ userStats.certificates }}</div>
                            <div class="stat-card-label">获得证书</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="stat-card-value">{{ userStats.averageCompletion }}%</div>
                            <div class="stat-card-label">平均完成率</div>
                        </div>
                    </div>

                    <div class="section-header">
                        <h3 class="section-title">最近活动</h3>
                        <a href="#" class="section-action" @click.prevent="viewAllActivities">查看全部</a>
                    </div>

                    <div class="activity-list">
                        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                            <div class="activity-icon" :style="{ backgroundColor: activity.iconBgColor }">
                                <i :class="activity.icon"></i>
                            </div>
                            <div class="activity-content">
                                <div class="activity-title">{{ activity.title }}</div>
                                <div class="activity-meta">{{ activity.time }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 课程进度部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">课程进度</h3>
                        <a href="my-courses.html" class="section-action">查看全部</a>
                    </div>

                    <div class="progress-item" v-for="course in courseProgress" :key="course.id">
                        <div class="progress-header">
                            <div class="progress-title">{{ course.title }}</div>
                            <div class="progress-percent">{{ course.progress }}%</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- 账户设置部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">账户设置</h3>
                    </div>

                    <div class="form-group">
                        <label class="form-label">用户名</label>
                        <input type="text" class="form-input" v-model="userProfile.username">
                    </div>

                    <div class="form-group">
                        <label class="form-label">显示名称</label>
                        <input type="text" class="form-input" v-model="userProfile.name">
                    </div>

                    <div class="form-group">
                        <label class="form-label">电子邮箱</label>
                        <input type="email" class="form-input" v-model="userProfile.email">
                    </div>

                    <div class="form-group">
                        <label class="form-label">个人简介</label>
                        <textarea class="form-input form-textarea" v-model="userProfile.bio"></textarea>
                    </div>

                    <div class="form-actions">
                        <button class="btn btn-primary" @click="saveProfile">保存更改</button>
                        <button class="btn btn-secondary" @click="resetProfile">取消</button>
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const searchQuery = ref('')
const activeMenu = ref('profile')

// 用户信息
const userProfile = reactive({
    name: 'JS',
    username: 'zhangsan',
    email: 'zhangsan@example.com',
    bio: '前端开发工程师 | 终身学习者 | 热爱编程与分享'
})

// 用户统计
const userStats = reactive({
    courses: 13,
    completionRate: 65,
    studyDays: 42,
    certificates: 5,
    averageCompletion: 87
})

// 最近活动
const recentActivities = ref([
    {
        id: 1,
        icon: 'fas fa-play-circle',
        iconBgColor: 'rgba(63, 185, 80, 0.1)',
        title: '完成了课程 "JavaScript 高级编程" 的章节 "Promise与异步操作"',
        time: '2小时前'
    },
    {
        id: 2,
        icon: 'fas fa-certificate',
        iconBgColor: 'rgba(88, 166, 255, 0.1)',
        title: '获得了 "Node.js 与 Express" 课程的结业证书',
        time: '1天前'
    },
    {
        id: 3,
        icon: 'fas fa-bookmark',
        iconBgColor: 'rgba(210, 153, 34, 0.1)',
        title: '收藏了课程 "Python 数据分析"',
        time: '2天前'
    },
    {
        id: 4,
        icon: 'fas fa-comment',
        iconBgColor: 'rgba(248, 81, 73, 0.1)',
        title: '在 "React Native 开发" 课程中发表了评论',
        time: '3天前'
    }
])

// 课程进度
const courseProgress = ref([
    {
        id: 1,
        title: 'JavaScript 高级编程',
        progress: 65
    },
    {
        id: 2,
        title: 'Python 数据分析',
        progress: 30
    },
    {
        id: 3,
        title: 'React Native 开发',
        progress: 80
    },
    {
        id: 4,
        title: 'Docker 与容器化',
        progress: 45
    }
])

// 计算属性
const userInitials = computed(() => {
    return userProfile.name.substring(0, 2)
})

// 方法
const setActiveMenu = (menu) => {
    activeMenu.value = menu
    // 这里可以添加菜单切换的逻辑
}

const editProfile = () => {
    alert('进入编辑模式')
    // 这里可以添加实际编辑功能的实现
}

const viewAllActivities = () => {
    // 查看全部活动的逻辑
    console.log('查看全部活动')
}

const saveProfile = () => {
    // 保存用户配置的逻辑
    console.log('保存用户配置', userProfile)
    alert('用户配置已保存')
}

const resetProfile = () => {
    // 重置用户配置的逻辑
    console.log('重置用户配置')
    // 这里应该从服务器重新获取用户数据
}

const logout = () => {
    // 退出登录的逻辑
    console.log('退出登录')
    // 这里应该调用退出登录的API
}

// 生命周期
onMounted(() => {
    console.log('Profile component mounted')
    // 这里可以添加组件挂载后需要执行的逻辑，比如从API获取用户数据
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

/* 统计卡片 */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
    text-align: center;
}

.stat-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(88, 166, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: var(--accent-color);
    font-size: 20px;
}

.stat-card-value {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 4px;
}

.stat-card-label {
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 活动列表 */
.activity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
}

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(63, 185, 80, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-color);
}

.activity-content {
    flex: 1;
}

.activity-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.activity-meta {
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 课程进度 */
.progress-item {
    margin-bottom: 20px;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.progress-title {
    font-weight: 500;
}

.progress-percent {
    color: var(--text-tertiary);
    font-size: 14px;
}

.progress-bar {
    height: 6px;
    background-color: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: var(--success-color);
}

/* 设置表单 */
.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.form-input {
    width: 100%;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 12px;
    color: var(--text-primary);
    font-size: 14px;
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-color);
}

.form-textarea {
    min-height: 100px;
    resize: vertical;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn {
    padding: 10px 20px;
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
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    background-color: var(--bg-secondary);
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

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .form-actions .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>