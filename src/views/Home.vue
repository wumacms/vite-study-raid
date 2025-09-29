<template>
    <div class="home-page">
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
                            <input type="text" placeholder="搜索课程..." v-model="searchTerm" @input="handleSearch">
                        </div>
                        <a href="/profile" class="user-avatar">JS</a>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 主要内容 -->
        <main class="container">
            <div class="page-header">
                <h1 class="page-title">所有课程</h1>
                <div class="filters">
                    <button v-for="filter in filters" :key="filter.value" class="filter-btn"
                        :class="{ active: selectedCategory === filter.value }" @click="selectCategory(filter.value)">
                        {{ filter.label }}
                    </button>
                </div>
            </div>

            <!-- 课程网格 -->
            <div class="courses-grid">
                <div v-for="course in paginatedCourses" :key="course.id" class="course-card">
                    <div class="course-image">
                        <img :src="course.image" :alt="course.title">
                        <div class="course-category">{{ getCategoryName(course.category) }}</div>
                        <div class="course-progress">
                            <div class="progress-bar" :style="{ width: `${course.progress}%` }"></div>
                        </div>
                    </div>
                    <div class="course-content">
                        <h3 class="course-title">{{ course.title }}</h3>
                        <p class="course-description">{{ course.description }}</p>
                        <div class="course-meta">
                            <span><i class="far fa-clock"></i> {{ course.duration }}</span>
                            <span v-html="getProgressText(course.progress)"></span>
                        </div>
                        <div class="course-actions">
                            <button class="btn btn-primary" @click="handleCourseStart(course)">{{
                                getButtonText(course.progress) }}</button>
                            <button class="btn btn-secondary" @click="toggleBookmark(course.id)">
                                <i :class="course.isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 空状态 -->
                <div v-if="paginatedCourses.length === 0" class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>没有找到相关课程</h3>
                    <p>尝试调整搜索条件或筛选条件</p>
                </div>
            </div>

            <!-- 分页控件 -->
            <div class="pagination" v-if="filteredCourses.length > 0">
                <button class="pagination-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
                    <i class="fas fa-chevron-left"></i> 上一页
                </button>
                <span class="pagination-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
                <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">
                    下一页 <i class="fas fa-chevron-right"></i>
                </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 路由实例
const router = useRouter()

// 响应式数据
const courses = ref([
    {
        id: 1,
        title: "JavaScript 高级编程",
        category: "frontend",
        description: "深入学习现代JavaScript，包括ES6+特性、异步编程、模块化等高级概念。",
        duration: "12小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=JavaScript",
        progress: 65,
        isBookmarked: false
    },
    {
        id: 2,
        title: "Python 数据分析",
        category: "data",
        description: "使用Pandas、NumPy和Matplotlib进行数据清洗、分析和可视化。",
        duration: "18小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Python",
        progress: 30,
        isBookmarked: false
    },
    {
        id: 3,
        title: "Node.js 与 Express",
        category: "backend",
        description: "构建快速、可扩展的Web应用程序和API，使用现代JavaScript技术栈。",
        duration: "15小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Node.js",
        progress: 100,
        isBookmarked: false
    },
    {
        id: 4,
        title: "Figma 设计入门",
        category: "design",
        description: "学习使用Figma进行界面设计、原型制作和团队协作。",
        duration: "8小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Figma",
        progress: 0,
        isBookmarked: false
    },
    {
        id: 5,
        title: "Docker 与容器化",
        category: "devops",
        description: "掌握Docker容器技术，实现应用程序的快速部署和扩展。",
        duration: "10小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Docker",
        progress: 45,
        isBookmarked: false
    },
    {
        id: 6,
        title: "React Native 开发",
        category: "mobile",
        description: "使用React Native构建跨平台移动应用程序，一次编写，多端运行。",
        duration: "20小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=React+Native",
        progress: 80,
        isBookmarked: false
    },
    {
        id: 7,
        title: "Vue.js 实战开发",
        category: "frontend",
        description: "从基础到高级，掌握Vue.js框架及其生态系统。",
        duration: "14小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Vue.js",
        progress: 20,
        isBookmarked: false
    },
    {
        id: 8,
        title: "Spring Boot 企业级开发",
        category: "backend",
        description: "使用Spring Boot构建企业级Java应用程序。",
        duration: "16小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Spring+Boot",
        progress: 60,
        isBookmarked: false
    },
    {
        id: 9,
        title: "机器学习基础",
        category: "data",
        description: "入门机器学习，了解基本概念和常用算法。",
        duration: "22小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Machine+Learning",
        progress: 10,
        isBookmarked: false
    },
    {
        id: 10,
        title: "Flutter 应用开发",
        category: "mobile",
        description: "使用Flutter框架开发高性能的跨平台移动应用。",
        duration: "18小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Flutter",
        progress: 40,
        isBookmarked: false
    },
    {
        id: 11,
        title: "TypeScript 进阶",
        category: "frontend",
        description: "深入学习TypeScript，提升JavaScript开发体验。",
        duration: "10小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=TypeScript",
        progress: 75,
        isBookmarked: false
    },
    {
        id: 12,
        title: "数据库设计与优化",
        category: "backend",
        description: "学习数据库设计原则和性能优化技巧。",
        duration: "12小时",
        image: "https://placehold.co/300x160/21262d/8b949e?text=Database",
        progress: 90,
        isBookmarked: false
    }
])

const selectedCategory = ref('all')
const searchTerm = ref('')
const currentPage = ref(1)
const coursesPerPage = 6

// 筛选选项
const filters = [
    { value: 'all', label: '全部' },
    { value: 'frontend', label: '前端开发' },
    { value: 'backend', label: '后端开发' },
    { value: 'data', label: '数据科学' },
    { value: 'mobile', label: '移动开发' }
]

// 计算属性
const filteredCourses = computed(() => {
    return courses.value.filter(course => {
        const matchesCategory = selectedCategory.value === 'all' || course.category === selectedCategory.value
        const matchesSearch = searchTerm.value === '' ||
            course.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.value.toLowerCase())

        return matchesCategory && matchesSearch
    })
})

const totalPages = computed(() => {
    return Math.ceil(filteredCourses.value.length / coursesPerPage)
})

const paginatedCourses = computed(() => {
    const startIndex = (currentPage.value - 1) * coursesPerPage
    const endIndex = startIndex + coursesPerPage
    return filteredCourses.value.slice(startIndex, endIndex)
})

// 方法
const selectCategory = (category) => {
    selectedCategory.value = category
    currentPage.value = 1
}

const handleSearch = () => {
    currentPage.value = 1
}

const goToPage = (page) => {
    currentPage.value = page
}

const getCategoryName = (category) => {
    const categoryMap = {
        'frontend': '前端开发',
        'backend': '后端开发',
        'data': '数据科学',
        'mobile': '移动开发',
        'design': 'UI/UX设计',
        'devops': 'DevOps'
    }
    return categoryMap[category] || '其他'
}

const getProgressText = (progress) => {
    if (progress === 0) {
        return '<i class="far fa-calendar"></i> 尚未开始'
    } else if (progress === 100) {
        return '<i class="fas fa-check-circle" style="color: var(--success-color);"></i> 已完成'
    } else {
        return '<i class="far fa-calendar"></i> 进行中'
    }
}

const handleCourseStart = (course) => {
    // alert(`开始学习: ${course.title}`)
    router.push(`/course-detail/${course.id}`)
}

const getButtonText = (progress) => {
    if (progress === 0) {
        return '开始学习'
    } else if (progress > 0 && progress < 100) {
        return '继续学习'
    } else {
        return '查看证书'
    }
}

const toggleBookmark = (courseId) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
        course.isBookmarked = !course.isBookmarked
    }
}

// 生命周期
onMounted(() => {
    // 可以在这里添加初始化逻辑
})
</script>

<style scoped>
/* 页面标题和筛选器 */
.page-header {
    margin: 32px 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
}

.filters {
    display: flex;
    gap: 12px;
}

.filter-btn {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 16px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--text-tertiary);
}

.filter-btn.active {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
}

/* 课程网格 */
.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.course-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.course-image {
    height: 160px;
    background-color: var(--bg-tertiary);
    position: relative;
    overflow: hidden;
}

.course-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.course-category {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: rgba(13, 17, 23, 0.8);
    color: var(--text-secondary);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.course-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--bg-tertiary);
}

.progress-bar {
    height: 100%;
    background-color: var(--success-color);
}

.course-content {
    padding: 16px;
}

.course-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-primary);
}

.course-description {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-meta {
    display: flex;
    justify-content: space-between;
    color: var(--text-tertiary);
    font-size: 12px;
    margin-bottom: 16px;
}

.course-actions {
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
    flex: 1;
    text-align: center;
    text-decoration: none;
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

/* 分页控件 */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 40px 0;
}

.pagination-btn {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 12px;
    color: var(--text-secondary);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--bg-tertiary);
    border-color: var(--text-tertiary);
}

.pagination-btn.active {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    color: var(--text-tertiary);
    font-size: 14px;
    margin: 0 16px;
}

/* 空状态 */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-tertiary);
    grid-column: 1 / -1;
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

    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .filters {
        flex-wrap: wrap;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }

    .pagination {
        flex-wrap: wrap;
    }
}
</style>