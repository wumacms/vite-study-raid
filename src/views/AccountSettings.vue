<template>
    <div class="account-settings">
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
                        <h2 class="profile-name">{{ userProfile.displayName }}</h2>
                        <p class="profile-username">@{{ userProfile.username }}</p>
                        <p class="profile-bio">{{ userProfile.bio }}</p>
                    </div>

                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">{{ userStats.courses }}</div>
                            <div class="stat-label">课程</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ userStats.completionRate }}</div>
                            <div class="stat-label">完成率</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ userStats.studyDays }}</div>
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
                            @click.prevent="handleLogout">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>退出登录</span>
                        </router-link>
                    </div>
                </div>

                <!-- 主要内容区域 -->
                <div class="profile-content">
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
                            <input type="text" class="form-input" v-model="userProfile.displayName">
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

                    <!-- 通知设置部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">通知设置</h3>
                        </div>

                        <div class="settings-options">
                            <div class="setting-item" v-for="setting in notificationSettings" :key="setting.id">
                                <div class="setting-info">
                                    <div class="setting-title">{{ setting.title }}</div>
                                    <div class="setting-description">{{ setting.description }}</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" v-model="setting.enabled">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 隐私设置部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">隐私设置</h3>
                        </div>

                        <div class="settings-options">
                            <div class="setting-item" v-for="setting in privacySettings" :key="setting.id">
                                <div class="setting-info">
                                    <div class="setting-title">{{ setting.title }}</div>
                                    <div class="setting-description">{{ setting.description }}</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" v-model="setting.enabled">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- 安全设置部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">安全设置</h3>
                        </div>

                        <div class="form-group">
                            <label class="form-label">当前密码</label>
                            <input type="password" class="form-input" placeholder="输入当前密码"
                                v-model="passwordData.currentPassword">
                        </div>

                        <div class="form-group">
                            <label class="form-label">新密码</label>
                            <input type="password" class="form-input" placeholder="输入新密码"
                                v-model="passwordData.newPassword">
                        </div>

                        <div class="form-group">
                            <label class="form-label">确认新密码</label>
                            <input type="password" class="form-input" placeholder="再次输入新密码"
                                v-model="passwordData.confirmPassword">
                        </div>

                        <div class="form-actions">
                            <button class="btn btn-primary" @click="updatePassword">更新密码</button>
                        </div>
                    </div>

                    <!-- 账户操作部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">账户操作</h3>
                        </div>

                        <div class="settings-options">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <div class="setting-title">导出学习数据</div>
                                    <div class="setting-description">下载您的学习历史、进度和证书信息</div>
                                </div>
                                <button class="btn btn-secondary" @click="exportData">导出数据</button>
                            </div>

                            <div class="setting-item">
                                <div class="setting-info">
                                    <div class="setting-title">删除账户</div>
                                    <div class="setting-description">永久删除您的账户和所有相关数据</div>
                                </div>
                                <button class="btn btn-danger" @click="deleteAccount">删除账户</button>
                            </div>
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
import { ref, reactive, computed, onMounted } from 'vue'

// 搜索查询
const searchQuery = ref('')

// 用户信息
const userProfile = reactive({
    username: 'zhangsan',
    displayName: '张三',
    email: 'zhangsan@example.com',
    bio: '前端开发工程师 | 终身学习者 | 热爱编程与分享'
})

// 用户统计数据
const userStats = reactive({
    courses: 13,
    completionRate: '65%',
    studyDays: 42
})

// 计算用户首字母
const userInitials = computed(() => {
    return userProfile.displayName.split('').filter(char => /[\u4e00-\u9fa5]/.test(char)).slice(0, 2).join('') ||
        userProfile.displayName.split(' ').map(name => name[0]).join('').toUpperCase()
})

// 活动菜单项
const activeMenu = ref('settings')

// 通知设置
const notificationSettings = ref([
    {
        id: 1,
        title: '课程更新通知',
        description: '当您关注的课程有新内容时发送通知',
        enabled: true
    },
    {
        id: 2,
        title: '学习提醒',
        description: '定期提醒您继续学习未完成的课程',
        enabled: true
    },
    {
        id: 3,
        title: '邮件通知',
        description: '通过电子邮件接收重要通知和课程更新',
        enabled: false
    },
    {
        id: 4,
        title: '促销信息',
        description: '接收课程优惠和新课程推荐',
        enabled: false
    }
])

// 隐私设置
const privacySettings = ref([
    {
        id: 1,
        title: '公开学习档案',
        description: '允许其他用户查看您的学习进度和成就',
        enabled: true
    },
    {
        id: 2,
        title: '显示在线状态',
        description: '向其他用户显示您当前是否在线',
        enabled: false
    },
    {
        id: 3,
        title: '允许私信',
        description: '允许其他用户向您发送私信',
        enabled: true
    }
])

// 密码数据
const passwordData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

// 设置活动菜单
const setActiveMenu = (menu) => {
    activeMenu.value = menu
}

// 保存个人资料
const saveProfile = () => {
    // 在实际应用中，这里会调用API保存数据
    alert('个人信息已更新')
}

// 重置个人资料
const resetProfile = () => {
    // 在实际应用中，这里会重置为原始数据
    userProfile.username = 'zhangsan'
    userProfile.displayName = '张三'
    userProfile.email = 'zhangsan@example.com'
    userProfile.bio = '前端开发工程师 | 终身学习者 | 热爱编程与分享'
}

// 更新密码
const updatePassword = () => {
    if (!passwordData.currentPassword) {
        alert('请输入当前密码')
        return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('新密码与确认密码不匹配')
        return
    }

    // 在实际应用中，这里会调用API更新密码
    alert('密码已更新')

    // 清空密码字段
    passwordData.currentPassword = ''
    passwordData.newPassword = ''
    passwordData.confirmPassword = ''
}

// 导出数据
const exportData = () => {
    alert('开始导出学习数据，请稍候...')
    // 实际应用中这里会触发数据导出流程
}

// 删除账户
const deleteAccount = () => {
    if (confirm('确定要删除账户吗？此操作不可撤销。')) {
        alert('账户删除请求已提交，我们将通过邮件与您确认')
        // 实际应用中这里会触发账户删除流程
    }
}

// 处理退出登录
const handleLogout = () => {
    // 在实际应用中，这里会处理退出登录逻辑
    alert('退出登录')
}

// 组件挂载后的初始化
onMounted(() => {
    // 可以在这里添加初始化逻辑，如从API加载用户数据
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

.btn-danger {
    background-color: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background-color: #e03e36;
}

/* 设置选项 */
.settings-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
}

.setting-info {
    flex: 1;
}

.setting-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.setting-description {
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 切换开关 */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    transition: .4s;
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 3px;
    background-color: var(--text-tertiary);
    transition: .4s;
    border-radius: 50%;
}

input:checked+.toggle-slider {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
}

input:checked+.toggle-slider:before {
    transform: translateX(20px);
    background-color: white;
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

    .form-actions {
        flex-direction: column;
    }

    .form-actions .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>