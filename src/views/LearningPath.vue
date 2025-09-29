<template>
    <div class="learning-path-page">
        <!-- 导航栏 -->
        <Header />

        <!-- 主要内容 -->
        <main class="container">
            <div class="page-header">
                <h1 class="page-title">学习路径</h1>
                <div class="filters">
                    <button v-for="filter in filters" :key="filter" class="filter-btn"
                        :class="{ active: activeFilter === filter }" @click="setActiveFilter(filter)">
                        {{ filter }}
                    </button>
                </div>
            </div>

            <!-- 学习路径概览 -->
            <div class="learning-path-overview">
                <div class="overview-header">
                    <h2 class="overview-title">我的学习路径</h2>
                    <div class="overview-stats">
                        <div class="overview-stat">
                            <div class="stat-value">{{ overviewStats.inProgress }}</div>
                            <div class="stat-label">进行中</div>
                        </div>
                        <div class="overview-stat">
                            <div class="stat-value">{{ overviewStats.completed }}</div>
                            <div class="stat-label">已完成</div>
                        </div>
                        <div class="overview-stat">
                            <div class="stat-value">{{ overviewStats.averageProgress }}</div>
                            <div class="stat-label">平均进度</div>
                        </div>
                    </div>
                </div>

                <div class="path-progress">
                    <div class="path-progress-header">
                        <div class="path-progress-title">{{ overviewProgress.title }}</div>
                        <div class="path-progress-percent">{{ overviewProgress.percentage }}%</div>
                    </div>
                    <div class="path-progress-bar">
                        <div class="path-progress-fill" :style="{ width: overviewProgress.percentage + '%' }"></div>
                    </div>
                </div>

                <div class="recommended-actions">
                    <button class="btn btn-primary" @click="handleContinueLearning">
                        <i class="fas fa-play"></i> 继续学习
                    </button>
                    <button class="btn btn-secondary" @click="handleExplorePaths">
                        <i class="fas fa-plus"></i> 探索新路径
                    </button>
                </div>
            </div>

            <!-- 学习路径网格 -->
            <div class="learning-paths-grid">
                <!-- 路径卡片 -->
                <div v-for="path in filteredPaths" :key="path.id" class="path-card">
                    <div class="path-header">
                        <div class="path-icon">
                            <i :class="path.icon"></i>
                        </div>
                        <div class="path-info">
                            <h3 class="path-title">{{ path.title }}</h3>
                            <p class="path-description">{{ path.description }}</p>
                        </div>
                    </div>
                    <div class="path-content">
                        <div class="path-stats">
                            <div class="path-stat">
                                <div class="path-stat-value">{{ path.courses }}</div>
                                <div class="path-stat-label">课程</div>
                            </div>
                            <div class="path-stat">
                                <div class="path-stat-value">{{ path.hours }}</div>
                                <div class="path-stat-label">小时</div>
                            </div>
                            <div class="path-stat">
                                <div class="path-stat-value">{{ path.difficulty }}</div>
                                <div class="path-stat-label">难度</div>
                            </div>
                        </div>
                        <div class="path-progress-container">
                            <div class="path-progress-info">
                                <span>进度</span>
                                <span>{{ path.progress }}%</span>
                            </div>
                            <div class="path-progress-bar">
                                <div class="path-progress-fill" :style="{ width: path.progress + '%' }"></div>
                            </div>
                        </div>
                        <div class="path-actions">
                            <button class="btn btn-primary" @click="handlePathContinue(path)">
                                {{ path.progress > 0 ? '继续学习' : '开始学习' }}
                            </button>
                            <button class="btn btn-secondary" @click="handlePathDetails(path)">查看详情</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 推荐课程 -->
            <div class="recommended-courses">
                <div class="section-header">
                    <h2 class="section-title">推荐课程</h2>
                    <a href="index.html" class="section-action">查看全部</a>
                </div>

                <div class="courses-grid">
                    <!-- 推荐课程卡片 -->
                    <div v-for="course in recommendedCourses" :key="course.id" class="course-card">
                        <div class="course-image">
                            <img :src="course.image" :alt="course.title">
                            <div class="course-category">{{ course.category }}</div>
                        </div>
                        <div class="course-content">
                            <h3 class="course-title">{{ course.title }}</h3>
                            <p class="course-description">{{ course.description }}</p>
                            <div class="course-meta">
                                <span><i class="far fa-clock"></i> {{ course.hours }}小时</span>
                                <span><i class="fas fa-signal"></i> {{ course.difficulty }}</span>
                            </div>
                            <div class="course-actions">
                                <a href="#" class="btn btn-primary" @click.prevent="handleCourseStart(course)">开始学习</a>
                                <button class="btn btn-secondary"
                                    :style="{ color: course.isBookmarked ? 'var(--accent-color)' : '' }"
                                    @click="handleToggleBookmark(course)">
                                    <i :class="course.isBookmarked ? 'fas' : 'far'" class="fa-bookmark"></i>
                                </button>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 路由实例
const router = useRouter()

// 响应式数据
const filters = ref(['全部', '前端开发', '后端开发', '数据科学', '移动开发'])
const activeFilter = ref('全部')

const overviewStats = ref({
    inProgress: 3,
    completed: 2,
    averageProgress: '65%'
})

const overviewProgress = ref({
    title: '前端开发工程师路径',
    percentage: 65
})

const learningPaths = ref([
    {
        id: 1,
        title: '前端开发工程师',
        description: '从零开始成为前端开发专家',
        icon: 'fab fa-js',
        category: '前端开发',
        courses: 12,
        hours: 120,
        difficulty: '中级',
        progress: 65
    },
    {
        id: 2,
        title: 'Python 数据科学家',
        description: '掌握数据分析和机器学习技能',
        icon: 'fab fa-python',
        category: '数据科学',
        courses: 10,
        hours: 90,
        difficulty: '中级',
        progress: 30
    },
    {
        id: 3,
        title: 'React 全栈开发',
        description: '前端与后端全栈开发技能',
        icon: 'fab fa-react',
        category: '前端开发',
        courses: 8,
        hours: 80,
        difficulty: '高级',
        progress: 80
    },
    {
        id: 4,
        title: '移动应用开发',
        description: 'React Native 与 Flutter 开发',
        icon: 'fas fa-mobile-alt',
        category: '移动开发',
        courses: 6,
        hours: 70,
        difficulty: '中级',
        progress: 0
    }
])

const recommendedCourses = ref([
    {
        id: 1,
        title: 'TypeScript 进阶',
        description: '深入学习TypeScript，提升JavaScript开发体验。',
        category: '前端开发',
        image: 'https://placehold.co/300x160/21262d/8b949e?text=TypeScript',
        hours: 10,
        difficulty: '中级',
        isBookmarked: false
    },
    {
        id: 2,
        title: 'Vue.js 实战开发',
        description: '从基础到高级，掌握Vue.js框架及其生态系统。',
        category: '前端开发',
        image: 'https://placehold.co/300x160/21262d/8b949e?text=Vue.js',
        hours: 14,
        difficulty: '中级',
        isBookmarked: false
    },
    {
        id: 3,
        title: 'Next.js 全栈开发',
        description: '使用Next.js构建现代化全栈Web应用。',
        category: '前端开发',
        image: 'https://placehold.co/300x160/21262d/8b949e?text=Next.js',
        hours: 16,
        difficulty: '高级',
        isBookmarked: false
    },
    {
        id: 4,
        title: 'Webpack 构建工具',
        description: '掌握现代前端构建工具Webpack的使用。',
        category: '前端开发',
        image: 'https://placehold.co/300x160/21262d/8b949e?text=Webpack',
        hours: 8,
        difficulty: '中级',
        isBookmarked: false
    }
])

// 计算属性
const filteredPaths = computed(() => {
    if (activeFilter.value === '全部') {
        return learningPaths.value
    }
    return learningPaths.value.filter(path => path.category === activeFilter.value)
})

// 方法
const setActiveFilter = (filter) => {
    activeFilter.value = filter
}

const handleContinueLearning = () => {
    // alert('继续学习: 前端开发工程师路径')
    router.push('/course-play/1')
}

const handleExplorePaths = () => {
    // alert('探索新路径')
    router.push('/course-play/1')
}

const handlePathContinue = (path) => {
    // alert(`开始学习: ${path.title}`)
    router.push(`/course-play/${path.id}`)
}

const handlePathDetails = (path) => {
    // alert(`查看详情: ${path.title}`)
    router.push(`/course-play/${path.id}`)
}

const handleCourseStart = (course) => {
    // alert(`开始学习: ${course.title}`)
    router.push(`/course-play/${course.id}`)
}

const handleToggleBookmark = (course) => {
    course.isBookmarked = !course.isBookmarked
}
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

/* 学习路径概览 */
.learning-path-overview {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    padding: 24px;
    margin-bottom: 32px;
}

.overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.overview-title {
    font-size: 20px;
    font-weight: 600;
}

.overview-stats {
    display: flex;
    gap: 24px;
}

.overview-stat {
    text-align: center;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: var(--accent-color);
}

.stat-label {
    font-size: 14px;
    color: var(--text-tertiary);
}

.path-progress {
    margin-bottom: 20px;
}

.path-progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.path-progress-title {
    font-weight: 500;
}

.path-progress-percent {
    color: var(--text-tertiary);
    font-size: 14px;
}

.path-progress-bar {
    height: 8px;
    background-color: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
}

.path-progress-fill {
    height: 100%;
    background-color: var(--success-color);
}

.recommended-actions {
    display: flex;
    gap: 12px;
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

/* 学习路径网格 */
.learning-paths-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.path-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.path-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.path-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 16px;
}

.path-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(88, 166, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
    font-size: 20px;
}

.path-info {
    flex: 1;
}

.path-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.path-description {
    color: var(--text-secondary);
    font-size: 14px;
}

.path-content {
    padding: 20px;
}

.path-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.path-stat {
    text-align: center;
}

.path-stat-value {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
}

.path-stat-label {
    font-size: 12px;
    color: var(--text-tertiary);
}

.path-progress-container {
    margin-bottom: 16px;
}

.path-progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
}

.path-progress-bar {
    height: 6px;
    background-color: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
}

.path-progress-fill {
    height: 100%;
    background-color: var(--success-color);
}

.path-actions {
    display: flex;
    gap: 8px;
}

.path-actions .btn {
    flex: 1;
}

/* 推荐课程 */
.recommended-courses {
    margin-bottom: 40px;
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

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
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
    height: 140px;
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

.course-content {
    padding: 16px;
}

.course-title {
    font-size: 16px;
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

.course-actions .btn {
    flex: 1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .learning-paths-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .filters {
        flex-wrap: wrap;
    }

    .overview-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .overview-stats {
        width: 100%;
        justify-content: space-between;
    }

    .learning-paths-grid {
        grid-template-columns: 1fr;
    }

    .recommended-actions {
        flex-direction: column;
    }

    .path-actions {
        flex-direction: column;
    }

    .courses-grid {
        grid-template-columns: 1fr;
    }
}
</style>