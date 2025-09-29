<template>
    <div class="certificate-page">
        <!-- 导航栏 -->
        <header>
            <div class="container">
                <nav class="navbar">
                    <a href="/" class="logo">
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
                            <input type="text" placeholder="搜索证书..." v-model="searchTerm" @input="handleSearch">
                        </div>
                        <a href="/profile" class="user-avatar">JS</a>
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
                        <div class="profile-avatar">JS</div>
                        <h2 class="profile-name">张三</h2>
                        <p class="profile-username">@zhangsan</p>
                        <p class="profile-bio">前端开发工程师 | 终身学习者 | 热爱编程与分享</p>
                    </div>

                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">{{ certificates.length }}</div>
                            <div class="stat-label">证书</div>
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
                        <router-link to="/my-cert" class="menu-item" :class="{ active: activeMenu === 'cert' }"
                            @click.prevent="setActiveMenu('cert')">
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
                    <!-- 证书列表部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">我的证书</h3>
                            <div class="certificate-count">{{ certificateCountText }}</div>
                        </div>

                        <div class="certificate-filters">
                            <button v-for="filter in filters" :key="filter.value" class="filter-btn"
                                :class="{ active: activeFilter === filter.value }"
                                @click="setActiveFilter(filter.value)">
                                {{ filter.label }}
                            </button>
                        </div>

                        <div class="certificates-grid">
                            <!-- 证书卡片 -->
                            <div v-for="certificate in filteredCertificates" :key="certificate.id"
                                class="certificate-card" :data-category="certificate.category">
                                <div class="certificate-header">
                                    <div class="certificate-icon">
                                        <i :class="certificate.icon"></i>
                                    </div>
                                    <h4 class="certificate-title">{{ certificate.title }}</h4>
                                    <p class="certificate-issuer">{{ certificate.issuer }}</p>
                                </div>
                                <div class="certificate-body">
                                    <div class="certificate-info">
                                        <div class="info-item">
                                            <span class="info-label">颁发日期</span>
                                            <span class="info-value">{{ certificate.issueDate }}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">证书编号</span>
                                            <span class="info-value">{{ certificate.certId }}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">课程时长</span>
                                            <span class="info-value">{{ certificate.duration }}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">完成率</span>
                                            <span class="info-value">{{ certificate.completionRate }}</span>
                                        </div>
                                    </div>
                                    <div class="certificate-actions">
                                        <button class="btn btn-primary" @click="viewCertificate(certificate.id)">
                                            <i class="fas fa-eye"></i> 查看证书
                                        </button>
                                        <button class="btn btn-secondary" @click="downloadCertificate(certificate.id)">
                                            <i class="fas fa-download"></i> 下载
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- 证书详情模态框 -->
        <div class="modal" :style="{ display: showModal ? 'flex' : 'none' }">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">证书详情</h3>
                    <button class="modal-close" @click="closeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="certificate-preview">
                        <div class="certificate-logo">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3 class="certificate-preview-title">{{ currentCertificate.title }}</h3>
                        <p class="certificate-preview-subtitle">{{ currentCertificate.issuer }} 认证证书</p>
                        <p class="certificate-preview-name">张三</p>
                        <p class="certificate-preview-date">{{ currentCertificate.issueDate }}</p>
                        <p>成功完成 {{ currentCertificate.title }} 课程，共计 {{ currentCertificate.duration }} 的学习内容，表现优异，特发此证。
                        </p>
                        <div class="certificate-preview-footer">
                            <div class="signature">
                                <div class="signature-name">{{ currentCertificate.issuer }} 认证委员会</div>
                                <div class="signature-title">认证机构</div>
                            </div>
                            <div class="certificate-id">证书编号: {{ currentCertificate.certId }}</div>
                        </div>
                    </div>
                    <div class="certificate-actions">
                        <button class="btn btn-primary" @click="downloadCertificate(currentCertificate.id)">
                            <i class="fas fa-download"></i> 下载证书 (PDF)
                        </button>
                        <button class="btn btn-secondary" @click="shareCertificate">
                            <i class="fas fa-share-alt"></i> 分享证书
                        </button>
                    </div>
                </div>
            </div>
        </div>

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
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const searchTerm = ref('')
const activeFilter = ref('all')
const showModal = ref(false)
const currentCertificate = ref({
    id: '',
    title: '',
    issueDate: '',
    certId: '',
    duration: '',
    issuer: ''
})

// 活动菜单项
const activeMenu = ref('cert')

// 证书数据
const certificates = ref([
    {
        id: 1,
        title: 'JavaScript 高级编程',
        issuer: 'StudyRaid',
        issueDate: '2023-10-15',
        certId: 'SR-JS-20231015',
        duration: '12 小时',
        completionRate: '100%',
        category: 'frontend',
        icon: 'fab fa-js'
    },
    {
        id: 2,
        title: 'Node.js 与 Express',
        issuer: 'StudyRaid',
        issueDate: '2023-09-22',
        certId: 'SR-NODE-20230922',
        duration: '15 小时',
        completionRate: '100%',
        category: 'backend',
        icon: 'fab fa-node-js'
    },
    {
        id: 3,
        title: 'Python 数据分析',
        issuer: 'StudyRaid',
        issueDate: '2023-08-10',
        certId: 'SR-PY-20230810',
        duration: '18 小时',
        completionRate: '100%',
        category: 'data',
        icon: 'fab fa-python'
    },
    {
        id: 4,
        title: 'React Native 开发',
        issuer: 'StudyRaid',
        issueDate: '2023-07-05',
        certId: 'SR-RN-20230705',
        duration: '20 小时',
        completionRate: '100%',
        category: 'mobile',
        icon: 'fab fa-react'
    },
    {
        id: 5,
        title: 'Vue.js 实战开发',
        issuer: 'StudyRaid',
        issueDate: '2023-06-18',
        certId: 'SR-VUE-20230618',
        duration: '14 小时',
        completionRate: '100%',
        category: 'frontend',
        icon: 'fab fa-vuejs'
    }
])

// 筛选器选项
const filters = ref([
    { value: 'all', label: '全部' },
    { value: 'frontend', label: '前端开发' },
    { value: 'backend', label: '后端开发' },
    { value: 'data', label: '数据科学' },
    { value: 'mobile', label: '移动开发' }
])

// 计算属性
const filteredCertificates = computed(() => {
    let filtered = certificates.value

    // 按分类筛选
    if (activeFilter.value !== 'all') {
        filtered = filtered.filter(cert => cert.category === activeFilter.value)
    }

    // 按搜索词筛选
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(cert =>
            cert.title.toLowerCase().includes(term) ||
            cert.certId.toLowerCase().includes(term)
        )
    }

    return filtered
})

const certificateCountText = computed(() => {
    const total = certificates.value.length
    const filtered = filteredCertificates.value.length

    if (filtered === total) {
        return `共 ${total} 个证书`
    } else {
        return `共 ${filtered}/${total} 个证书`
    }
})

// 方法
const setActiveFilter = (filter) => {
    activeFilter.value = filter
}

const handleSearch = () => {
    // 搜索逻辑已在计算属性中处理
}

// 处理退出登录
const handleLogout = () => {
    // 在实际应用中，这里会处理退出登录逻辑
    alert('退出登录')
}

// 设置活动菜单
const setActiveMenu = (menu) => {
    activeMenu.value = menu
}

const viewCertificate = (id) => {
    const cert = certificates.value.find(c => c.id === id)
    if (cert) {
        currentCertificate.value = { ...cert }
        showModal.value = true
    }
}

const downloadCertificate = (id) => {
    const cert = certificates.value.find(c => c.id === id)
    if (cert) {
        alert(`开始下载证书 ${cert.certId} 的PDF文件`)
        // 实际应用中这里会触发文件下载
    }
}

const shareCertificate = () => {
    const cert = currentCertificate.value

    if (navigator.share) {
        navigator.share({
            title: `我的证书: ${cert.title}`,
            text: `我在 StudyRaid 上获得了 "${cert.title}" 证书，证书编号: ${cert.certId}`,
            url: window.location.href
        })
            .then(() => console.log('分享成功'))
            .catch((error) => console.log('分享失败', error))
    } else {
        alert('您的浏览器不支持分享功能，请手动复制链接分享')
    }
}

const closeModal = () => {
    showModal.value = false
}

// 生命周期
onMounted(() => {
    // 可以在这里添加初始化逻辑
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

/* 证书筛选器 */
.certificate-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.filter-btn {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 16px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover {
    background-color: var(--bg-secondary);
    border-color: var(--text-tertiary);
}

.filter-btn.active {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
}

/* 证书网格 */
.certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

.certificate-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--border-color);
}

.certificate-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.certificate-header {
    padding: 20px;
    text-align: center;
    background: linear-gradient(135deg, #1a1f2e, #0d1117);
    border-bottom: 1px solid var(--border-color);
}

.certificate-icon {
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

.certificate-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.certificate-issuer {
    color: var(--text-tertiary);
    font-size: 14px;
}

.certificate-body {
    padding: 20px;
}

.certificate-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.info-item {
    display: flex;
    justify-content: space-between;
}

.info-label {
    color: var(--text-tertiary);
    font-size: 14px;
}

.info-value {
    font-size: 14px;
    font-weight: 500;
}

.certificate-actions {
    display: flex;
    gap: 8px;
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
    flex: 1;
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

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-tertiary);
}

.empty-state i {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: var(--text-secondary);
}

/* 证书详情模态框 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    font-size: 20px;
    font-weight: 600;
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-tertiary);
    font-size: 20px;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
}

.certificate-preview {
    background: linear-gradient(135deg, #1a1f2e, #0d1117);
    border-radius: var(--border-radius);
    padding: 30px;
    text-align: center;
    margin-bottom: 20px;
    border: 1px solid var(--border-color);
}

.certificate-logo {
    font-size: 48px;
    color: var(--accent-color);
    margin-bottom: 20px;
}

.certificate-preview-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
}

.certificate-preview-subtitle {
    color: var(--text-tertiary);
    margin-bottom: 20px;
}

.certificate-preview-name {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.certificate-preview-date {
    color: var(--text-tertiary);
    margin-bottom: 30px;
}

.certificate-preview-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
}

.signature {
    text-align: left;
}

.signature-name {
    font-weight: 600;
    margin-bottom: 4px;
}

.signature-title {
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

    .certificates-grid {
        grid-template-columns: 1fr;
    }

    .certificate-actions {
        flex-direction: column;
    }

    .certificate-actions .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>