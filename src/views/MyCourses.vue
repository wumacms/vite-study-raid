<template>
    <div class="my-courses-page">
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
                <h1 class="page-title">我的课程</h1>
                <div class="filters">
                    <button v-for="filter in filters" :key="filter.id" class="filter-btn"
                        :class="{ active: activeFilter === filter.id }" @click="setActiveFilter(filter.id)">
                        {{ filter.label }}
                    </button>
                </div>
            </div>

            <!-- 课程网格 -->
            <div class="courses-grid">
                <div v-for="course in filteredCourses" :key="course.id" class="course-card">
                    <div class="course-image">
                        <img :src="course.image" :alt="course.title">
                        <div class="course-category">{{ course.category }}</div>
                        <div class="course-progress">
                            <div class="progress-bar" :style="{ width: course.progress + '%' }"></div>
                        </div>
                    </div>
                    <div class="course-content">
                        <h3 class="course-title">{{ course.title }}</h3>
                        <p class="course-description">{{ course.description }}</p>
                        <div class="course-meta">
                            <span><i class="far fa-clock"></i> {{ course.duration }}</span>
                            <span v-if="course.progress === 100">
                                <i class="fas fa-check-circle" style="color: var(--success-color);"></i> 已完成
                            </span>
                            <span v-else-if="course.progress === 0">
                                <i class="far fa-calendar"></i> 尚未开始
                            </span>
                            <span v-else>
                                <i class="far fa-calendar"></i> {{ course.lastAccessed }}
                            </span>
                        </div>
                        <div class="course-actions">
                            <router-link :to="'/course-detail/' + course.id" class="btn btn-primary">
                                {{ course.progress === 0 ? '开始学习' : course.progress === 100 ? '查看证书' : '继续学习' }}
                            </router-link>
                            <button class="btn btn-secondary"
                                :style="{ color: course.bookmarked ? 'var(--accent-color)' : '' }"
                                @click="toggleBookmark(course.id)">
                                <i :class="course.bookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredCourses.length === 0" class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>没有找到相关课程</h3>
                <p>尝试调整筛选条件或搜索关键词</p>
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

// 响应式数据
const searchTerm = ref('')
const activeFilter = ref('all')
const courses = ref([])

// 筛选器选项
const filters = ref([
    { id: 'all', label: '全部' },
    { id: 'in-progress', label: '进行中' },
    { id: 'completed', label: '已完成' },
    { id: 'bookmarked', label: '已收藏' }
])

// 计算属性 - 过滤后的课程
const filteredCourses = computed(() => {
    let result = courses.value

    // 根据搜索词过滤
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        result = result.filter(course =>
            course.title.toLowerCase().includes(term) ||
            course.description.toLowerCase().includes(term)
        )
    }

    // 根据活动筛选器过滤
    switch (activeFilter.value) {
        case 'in-progress':
            result = result.filter(course => course.progress > 0 && course.progress < 100)
            break
        case 'completed':
            result = result.filter(course => course.progress === 100)
            break
        case 'bookmarked':
            result = result.filter(course => course.bookmarked)
            break
        // 'all' 和其他情况不进行额外过滤
    }

    return result
})

// 方法
const setActiveFilter = (filterId) => {
    activeFilter.value = filterId
}

const toggleBookmark = (courseId) => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
        course.bookmarked = !course.bookmarked
    }
}

const handleSearch = () => {
    // 搜索逻辑已经在计算属性中处理
    console.log('搜索关键词:', searchTerm.value)
}

// 初始化课程数据
const initializeCourses = () => {
    courses.value = [
        {
            id: 1,
            title: 'JavaScript 高级编程',
            description: '深入学习现代JavaScript，包括ES6+特性、异步编程、模块化等高级概念。',
            category: '前端开发',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=JavaScript',
            progress: 65,
            duration: '12小时',
            lastAccessed: '上次学习: 2天前',
            bookmarked: false
        },
        {
            id: 2,
            title: 'Python 数据分析',
            description: '使用Pandas、NumPy和Matplotlib进行数据清洗、分析和可视化。',
            category: '数据科学',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=Python',
            progress: 30,
            duration: '18小时',
            lastAccessed: '上次学习: 1周前',
            bookmarked: false
        },
        {
            id: 3,
            title: 'Node.js 与 Express',
            description: '构建快速、可扩展的Web应用程序和API，使用现代JavaScript技术栈。',
            category: '后端开发',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=Node.js',
            progress: 100,
            duration: '15小时',
            lastAccessed: '',
            bookmarked: true
        },
        {
            id: 4,
            title: 'Figma 设计入门',
            description: '学习使用Figma进行界面设计、原型制作和团队协作。',
            category: 'UI/UX设计',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=Figma',
            progress: 0,
            duration: '8小时',
            lastAccessed: '',
            bookmarked: false
        },
        {
            id: 5,
            title: 'Docker 与容器化',
            description: '掌握Docker容器技术，实现应用程序的快速部署和扩展。',
            category: 'DevOps',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=Docker',
            progress: 45,
            duration: '10小时',
            lastAccessed: '上次学习: 3天前',
            bookmarked: false
        },
        {
            id: 6,
            title: 'React Native 开发',
            description: '使用React Native构建跨平台移动应用程序，一次编写，多端运行。',
            category: '移动开发',
            image: 'https://placehold.co/300x160/21262d/8b949e?text=React+Native',
            progress: 80,
            duration: '20小时',
            lastAccessed: '上次学习: 昨天',
            bookmarked: true
        }
    ]
}

// 生命周期
onMounted(() => {
    initializeCourses()
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
}
</style>