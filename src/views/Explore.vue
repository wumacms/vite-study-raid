<template>
    <!-- 导航栏 -->
    <header>
        <div class="container">
            <nav class="navbar">
                <a href="#" class="logo">
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
                    <div class="user-avatar">JS</div>
                </div>
            </nav>
        </div>
    </header>

    <!-- 主要内容 -->
    <main class="container">
        <div class="explore-header">
            <h1 class="explore-title">发现课程</h1>
            <p class="explore-subtitle">探索我们精心设计的课程，提升你的技能</p>
        </div>

        <!-- 高级筛选器 -->
        <div class="advanced-filters">
            <div class="filter-row">
                <div class="filter-group">
                    <label class="filter-label">难度级别</label>
                    <select class="filter-select" v-model="filters.level" @change="applyFilters">
                        <option value="all">所有级别</option>
                        <option value="beginner">初级</option>
                        <option value="intermediate">中级</option>
                        <option value="advanced">高级</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">课程时长</label>
                    <select class="filter-select" v-model="filters.duration" @change="applyFilters">
                        <option value="all">所有时长</option>
                        <option value="short">短课程 (0-5小时)</option>
                        <option value="medium">中等 (5-15小时)</option>
                        <option value="long">长课程 (15+小时)</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">课程类型</label>
                    <select class="filter-select" v-model="filters.type" @change="applyFilters">
                        <option value="all">所有类型</option>
                        <option value="video">视频课程</option>
                        <option value="interactive">互动课程</option>
                        <option value="project">项目驱动</option>
                    </select>
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-group">
                    <label class="filter-label">热门标签</label>
                    <div class="filter-tags">
                        <span class="tag" :class="{ active: filters.tags.length === 0 }" data-tag="all"
                            @click="toggleTag('all')">全部</span>
                        <span v-for="tag in availableTags" :key="tag" class="tag"
                            :class="{ active: filters.tags.includes(tag) }" :data-tag="tag" @click="toggleTag(tag)">{{
                                tag }}</span>
                    </div>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn btn-secondary" @click="resetFilters">重置筛选</button>
                <button class="btn btn-primary" @click="applyFilters">应用筛选</button>
            </div>
        </div>

        <!-- 排序和视图控制 -->
        <div class="view-controls">
            <div class="sort-options">
                <span class="sort-label">排序方式:</span>
                <select class="sort-select" v-model="sortOption" @change="applySorting">
                    <option value="popular">最受欢迎</option>
                    <option value="newest">最新发布</option>
                    <option value="rating">最高评分</option>
                    <option value="duration">课程时长</option>
                </select>
            </div>
            <div class="view-toggle">
                <button class="view-btn" :class="{ active: isGridView }" @click="toggleView('grid')">
                    <i class="fas fa-th"></i>
                </button>
                <button class="view-btn" :class="{ active: !isGridView }" @click="toggleView('list')">
                    <i class="fas fa-list"></i>
                </button>
            </div>
        </div>

        <!-- 课程网格 -->
        <div class="courses-grid" :class="{ 'list-view': !isGridView }">
            <!-- 空状态 -->
            <div v-if="paginatedCourses.length === 0" class="empty-state">
                <i class="fas fa-search"></i>
                <h3>没有找到相关课程</h3>
                <p>尝试调整搜索条件或筛选条件</p>
            </div>

            <!-- 课程卡片 -->
            <div v-for="course in paginatedCourses" :key="course.id" class="course-card">
                <div class="course-image">
                    <img :src="course.image" :alt="course.title">
                    <div class="course-category">{{ getCategoryName(course.category) }}</div>
                    <div class="course-level">{{ getLevelName(course.level) }}</div>
                    <div v-if="course.progress > 0" class="course-progress">
                        <div class="progress-bar" :style="{ width: `${course.progress}%` }"></div>
                    </div>
                </div>
                <div class="course-content">
                    <h3 class="course-title">{{ course.title }}</h3>
                    <p class="course-description">{{ course.description }}</p>
                    <div class="course-tags">
                        <span v-for="tag in course.tags" :key="tag" class="course-tag">{{ tag }}</span>
                    </div>
                    <div class="course-meta">
                        <span><i class="fas fa-clock"></i> {{ course.duration }}</span>
                        <span><i class="fas fa-users"></i> {{ course.students.toLocaleString() }}</span>
                        <span><i class="fas fa-star"></i> {{ course.rating }}</span>
                    </div>
                    <div class="course-actions">
                        <router-link :to="'/course-play/' + course.id">
                            <button class="btn btn-secondary">查看详情</button>
                        </router-link>
                        <router-link :to="'/course-play/' + course.id">
                            <button class="btn btn-primary">{{ getButtonText(course.progress) }}</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 课程数据
const courses = ref([
    {
        id: 1,
        title: "JavaScript 高级编程",
        category: "frontend",
        description: "深入学习现代JavaScript，包括ES6+特性、异步编程、模块化等高级概念。",
        duration: "12小时",
        level: "intermediate",
        type: "video",
        tags: ["javascript", "es6", "async"],
        rating: 4.8,
        students: 1250,
        image: "https://placehold.co/300x160/21262d/8b949e?text=JavaScript",
        progress: 65
    },
    {
        id: 2,
        title: "Python 数据分析",
        category: "data",
        description: "使用Pandas、NumPy和Matplotlib进行数据清洗、分析和可视化。",
        duration: "18小时",
        level: "beginner",
        type: "interactive",
        tags: ["python", "pandas", "numpy", "data-analysis"],
        rating: 4.6,
        students: 980,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Python",
        progress: 30
    },
    {
        id: 3,
        title: "Node.js 与 Express",
        category: "backend",
        description: "构建快速、可扩展的Web应用程序和API，使用现代JavaScript技术栈。",
        duration: "15小时",
        level: "intermediate",
        type: "project",
        tags: ["nodejs", "express", "backend", "api"],
        rating: 4.7,
        students: 1120,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Node.js",
        progress: 100
    },
    {
        id: 4,
        title: "Figma 设计入门",
        category: "design",
        description: "学习使用Figma进行界面设计、原型制作和团队协作。",
        duration: "8小时",
        level: "beginner",
        type: "video",
        tags: ["figma", "ui-design", "ux-design"],
        rating: 4.5,
        students: 750,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Figma",
        progress: 0
    },
    {
        id: 5,
        title: "Docker 与容器化",
        category: "devops",
        description: "掌握Docker容器技术，实现应用程序的快速部署和扩展。",
        duration: "10小时",
        level: "intermediate",
        type: "interactive",
        tags: ["docker", "containers", "devops"],
        rating: 4.9,
        students: 890,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Docker",
        progress: 45
    },
    {
        id: 6,
        title: "React Native 开发",
        category: "mobile",
        description: "使用React Native构建跨平台移动应用程序，一次编写，多端运行。",
        duration: "20小时",
        level: "advanced",
        type: "project",
        tags: ["react", "react-native", "mobile", "cross-platform"],
        rating: 4.7,
        students: 680,
        image: "https://placehold.co/300x160/21262d/8b949e?text=React+Native",
        progress: 80
    },
    {
        id: 7,
        title: "Vue.js 实战开发",
        category: "frontend",
        description: "从基础到高级，掌握Vue.js框架及其生态系统。",
        duration: "14小时",
        level: "beginner",
        type: "video",
        tags: ["vue", "javascript", "frontend"],
        rating: 4.6,
        students: 940,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Vue.js",
        progress: 20
    },
    {
        id: 8,
        title: "Spring Boot 企业级开发",
        category: "backend",
        description: "使用Spring Boot构建企业级Java应用程序。",
        duration: "16小时",
        level: "advanced",
        type: "project",
        tags: ["java", "spring", "spring-boot", "backend"],
        rating: 4.8,
        students: 720,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Spring+Boot",
        progress: 60
    },
    {
        id: 9,
        title: "机器学习基础",
        category: "data",
        description: "入门机器学习，了解基本概念和常用算法。",
        duration: "22小时",
        level: "intermediate",
        type: "interactive",
        tags: ["python", "machine-learning", "ai", "data-science"],
        rating: 4.7,
        students: 1100,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Machine+Learning",
        progress: 10
    },
    {
        id: 10,
        title: "Flutter 应用开发",
        category: "mobile",
        description: "使用Flutter框架开发高性能的跨平台移动应用。",
        duration: "18小时",
        level: "intermediate",
        type: "project",
        tags: ["flutter", "dart", "mobile", "cross-platform"],
        rating: 4.5,
        students: 560,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Flutter",
        progress: 40
    },
    {
        id: 11,
        title: "TypeScript 进阶",
        category: "frontend",
        description: "深入学习TypeScript，提升JavaScript开发体验。",
        duration: "10小时",
        level: "intermediate",
        type: "video",
        tags: ["typescript", "javascript", "frontend"],
        rating: 4.8,
        students: 820,
        image: "https://placehold.co/300x160/21262d/8b949e?text=TypeScript",
        progress: 75
    },
    {
        id: 12,
        title: "数据库设计与优化",
        category: "backend",
        description: "学习数据库设计原则和性能优化技巧。",
        duration: "12小时",
        level: "advanced",
        type: "interactive",
        tags: ["database", "sql", "performance", "backend"],
        rating: 4.6,
        students: 670,
        image: "https://placehold.co/300x160/21262d/8b949e?text=Database",
        progress: 90
    }
])

// 响应式状态
const currentPage = ref(1)
const coursesPerPage = 6
const searchTerm = ref('')
const sortOption = ref('popular')
const isGridView = ref(true)

// 筛选器状态
const filters = ref({
    level: 'all',
    duration: 'all',
    type: 'all',
    tags: []
})

// 可用标签
const availableTags = ref(['javascript', 'python', 'react', 'nodejs', 'vue', 'typescript', 'docker'])

// 计算属性
const filteredCourses = computed(() => {
    let filtered = courses.value.filter(course => {
        // 搜索匹配
        const matchesSearch = searchTerm.value === '' ||
            course.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            course.tags.some(tag => tag.includes(searchTerm.value.toLowerCase()))

        // 难度级别匹配
        const matchesLevel = filters.value.level === 'all' || course.level === filters.value.level

        // 时长匹配
        const matchesDuration = filters.value.duration === 'all' ||
            (filters.value.duration === 'short' && getDurationHours(course.duration) <= 5) ||
            (filters.value.duration === 'medium' && getDurationHours(course.duration) > 5 && getDurationHours(course.duration) <= 15) ||
            (filters.value.duration === 'long' && getDurationHours(course.duration) > 15)

        // 类型匹配
        const matchesType = filters.value.type === 'all' || course.type === filters.value.type

        // 标签匹配
        const matchesTags = filters.value.tags.length === 0 ||
            filters.value.tags.some(tag => course.tags.includes(tag))

        return matchesSearch && matchesLevel && matchesDuration && matchesType && matchesTags
    })

    // 排序
    filtered.sort((a, b) => {
        switch (sortOption.value) {
            case 'newest':
                return b.id - a.id // 假设ID越大越新
            case 'rating':
                return b.rating - a.rating
            case 'duration':
                return getDurationHours(b.duration) - getDurationHours(a.duration)
            case 'popular':
            default:
                return b.students - a.students
        }
    })

    return filtered
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / coursesPerPage))

const paginatedCourses = computed(() => {
    const startIndex = (currentPage.value - 1) * coursesPerPage
    const endIndex = startIndex + coursesPerPage
    return filteredCourses.value.slice(startIndex, endIndex)
})

// 方法
const getDurationHours = (duration) => {
    const match = duration.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
}

const getCategoryName = (category) => {
    const categories = {
        'frontend': '前端开发',
        'backend': '后端开发',
        'mobile': '移动开发',
        'data': '数据分析',
        'design': '设计',
        'devops': '运维'
    }
    return categories[category] || category
}

const getLevelName = (level) => {
    const levels = {
        'beginner': '初级',
        'intermediate': '中级',
        'advanced': '高级'
    }
    return levels[level] || level
}

const getButtonText = (progress) => {
    if (progress > 0 && progress < 100) {
        return '继续学习'
    } else if (progress === 100) {
        return '查看证书'
    }
    return '开始学习'
}

const toggleTag = (tag) => {
    if (tag === 'all') {
        filters.value.tags = []
    } else {
        const index = filters.value.tags.indexOf(tag)
        if (index > -1) {
            filters.value.tags.splice(index, 1)
        } else {
            filters.value.tags.push(tag)
        }
    }
    applyFilters()
}

const toggleView = (viewType) => {
    isGridView.value = viewType === 'grid'
}

const goToPage = (page) => {
    currentPage.value = page
}

const handleSearch = () => {
    currentPage.value = 1
}

const applyFilters = () => {
    currentPage.value = 1
}

const applySorting = () => {
    currentPage.value = 1
}

const resetFilters = () => {
    filters.value = {
        level: 'all',
        duration: 'all',
        type: 'all',
        tags: []
    }
    searchTerm.value = ''
    sortOption.value = 'popular'
    currentPage.value = 1
}

// 生命周期
onMounted(() => {
    // 初始化代码可以放在这里
})
</script>

<style scoped>
/* 发现页面特定样式 */
.explore-header {
    margin: 32px 0 24px;
}

.explore-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
}

.explore-subtitle {
    color: var(--text-secondary);
    font-size: 16px;
    margin-bottom: 24px;
}

/* 高级筛选器 */
.advanced-filters {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 20px;
    margin-bottom: 24px;
}

.filter-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.filter-group {
    flex: 1;
    min-width: 200px;
}

.filter-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-secondary);
}

.filter-select {
    width: 100%;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 12px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.tag {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.tag:hover {
    background-color: var(--bg-secondary);
    border-color: var(--text-tertiary);
}

.tag.active {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
}

.filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
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

/* 排序和视图控制 */
.view-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.sort-options {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sort-label {
    font-size: 14px;
    color: var(--text-secondary);
}

.sort-select {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 6px 12px;
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
}

.view-toggle {
    display: flex;
    gap: 8px;
}

.view-btn {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 12px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.view-btn:hover {
    background-color: var(--bg-secondary);
}

.view-btn.active {
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

.courses-grid.list-view {
    grid-template-columns: 1fr;
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

.course-level {
    position: absolute;
    top: 12px;
    right: 12px;
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
    background-color: var(--accent-color);
    transition: width 0.3s;
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

.course-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
}

.course-tag {
    background-color: var(--bg-tertiary);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    color: var(--text-secondary);
}

.course-actions {
    display: flex;
    gap: 8px;
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

    .filter-row {
        flex-direction: column;
    }

    .filter-group {
        min-width: 100%;
    }

    .view-controls {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }

    .pagination {
        flex-wrap: wrap;
    }
}
</style>