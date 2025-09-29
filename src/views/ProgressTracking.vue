<template>
    <div class="progress-tracking-page">
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
                        <h2 class="profile-name">{{ userName }}</h2>
                        <p class="profile-username">{{ userUsername }}</p>
                        <p class="profile-bio">{{ userBio }}</p>
                    </div>

                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">{{ stats.courses }}</div>
                            <div class="stat-label">课程</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ stats.completionRate }}</div>
                            <div class="stat-label">完成率</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{{ stats.studyDays }}</div>
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
                        <router-link to="/my-cert" class="menu-item" :class="{ active: activeMenu === 'cert' }"
                            @click="setActiveMenu('cert')">
                            <i class="fas fa-certificate"></i>
                            <span>我的证书</span>
                        </router-link>
                        <router-link to="/account-settings" class="menu-item"
                            :class="{ active: activeMenu === 'settings' }" @click="setActiveMenu('settings')">
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
                    <!-- 进度概览部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">进度概览</h3>
                            <div class="chart-actions">
                                <button class="chart-action" :class="{ active: activePeriod === 'week' }"
                                    @click="setActivePeriod('week')">
                                    本周
                                </button>
                                <button class="chart-action" :class="{ active: activePeriod === 'month' }"
                                    @click="setActivePeriod('month')">
                                    本月
                                </button>
                                <button class="chart-action" :class="{ active: activePeriod === 'year' }"
                                    @click="setActivePeriod('year')">
                                    全年
                                </button>
                            </div>
                        </div>

                        <div class="progress-overview">
                            <div class="progress-card">
                                <div class="progress-card-icon">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="progress-card-value">{{ overview.studyHours }}</div>
                                <div class="progress-card-label">学习时长 (小时)</div>
                            </div>
                            <div class="progress-card">
                                <div class="progress-card-icon">
                                    <i class="fas fa-book-open"></i>
                                </div>
                                <div class="progress-card-value">{{ overview.completedCourses }}</div>
                                <div class="progress-card-label">完成课程数</div>
                            </div>
                            <div class="progress-card">
                                <div class="progress-card-icon">
                                    <i class="fas fa-fire"></i>
                                </div>
                                <div class="progress-card-value">{{ overview.streakDays }}</div>
                                <div class="progress-card-label">连续学习天数</div>
                            </div>
                            <div class="progress-card">
                                <div class="progress-card-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="progress-card-value">{{ overview.averageCompletion }}</div>
                                <div class="progress-card-label">平均完成率</div>
                            </div>
                        </div>

                        <div class="chart-container">
                            <div class="chart-header">
                                <div class="chart-title">学习时间趋势</div>
                            </div>
                            <canvas ref="trendChart"></canvas>
                        </div>
                    </div>

                    <!-- 课程进度部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">课程进度</h3>
                            <router-link to="/my-courses" class="section-action">查看全部</router-link>
                        </div>

                        <div class="course-progress-list">
                            <div v-for="course in courses" :key="course.id" class="course-progress-item">
                                <div class="course-icon">
                                    <i :class="course.icon"></i>
                                </div>
                                <div class="course-content">
                                    <div class="course-title">{{ course.title }}</div>
                                    <div class="course-progress-bar">
                                        <div class="course-progress-fill" :style="{ width: course.percentage + '%' }">
                                        </div>
                                    </div>
                                </div>
                                <div class="course-stats">
                                    <div class="course-percent">{{ course.percentage }}%</div>
                                    <div class="course-time">{{ course.completedLessons }}/{{ course.totalLessons }} 节课
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 学习日历部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">学习日历</h3>
                            <div class="calendar-nav">
                                <button class="calendar-nav-btn" @click="prevMonth">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <span>{{ calendarTitle }}</span>
                                <button class="calendar-nav-btn" @click="nextMonth">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        <div class="calendar-container">
                            <div class="calendar-grid">
                                <div v-for="day in weekdays" :key="day" class="calendar-day-header">
                                    {{ day }}
                                </div>
                                <div v-for="day in calendarDays" :key="day.id" class="calendar-day" :class="{
                                    empty: day.empty,
                                    active: day.isToday,
                                    'has-activity': day.hasActivity
                                }">
                                    {{ day.day }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 学习习惯部分 -->
                    <div class="content-section">
                        <div class="section-header">
                            <h3 class="section-title">学习习惯</h3>
                        </div>

                        <div class="habits-container">
                            <div class="habit-card">
                                <div class="habit-header">
                                    <div class="habit-title">最佳学习时段</div>
                                    <div class="habit-value">{{ habits.bestTime }}</div>
                                </div>
                                <div class="chart-container">
                                    <canvas ref="timeDistributionChart"></canvas>
                                </div>
                            </div>

                            <div class="habit-card">
                                <div class="habit-header">
                                    <div class="habit-title">每周学习分布</div>
                                    <div class="habit-value">{{ habits.studyDaysPerWeek }}</div>
                                </div>
                                <div class="chart-container">
                                    <canvas ref="weeklyDistributionChart"></canvas>
                                </div>
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import Chart from 'chart.js/auto'

// 用户信息
const userInitials = ref('JS')
const userName = ref('张三')
const userUsername = ref('@zhangsan')
const userBio = ref('前端开发工程师 | 终身学习者 | 热爱编程与分享')

// 用户统计
const stats = reactive({
    courses: 13,
    completionRate: '65%',
    studyDays: 42
})

// 搜索查询
const searchQuery = ref('')

// 活跃菜单项
const activeMenu = ref('progress')

// 设置活跃菜单项
const setActiveMenu = (menu) => {
    activeMenu.value = menu
}

// 进度概览数据
const overview = reactive({
    studyHours: '12.5',
    completedCourses: 8,
    streakDays: 7,
    averageCompletion: '87%'
})

// 活跃时间周期
const activePeriod = ref('week')

// 设置活跃时间周期
const setActivePeriod = (period) => {
    activePeriod.value = period
    updateCharts(period)
}

// 课程数据
const courses = ref([
    {
        id: 1,
        title: 'JavaScript 高级编程',
        icon: 'fab fa-js',
        percentage: 65,
        completedLessons: 12,
        totalLessons: 20
    },
    {
        id: 2,
        title: 'Python 数据分析',
        icon: 'fab fa-python',
        percentage: 30,
        completedLessons: 6,
        totalLessons: 20
    },
    {
        id: 3,
        title: 'React Native 开发',
        icon: 'fab fa-react',
        percentage: 80,
        completedLessons: 16,
        totalLessons: 20
    },
    {
        id: 4,
        title: 'Node.js 与 Express',
        icon: 'fab fa-node-js',
        percentage: 100,
        completedLessons: 20,
        totalLessons: 20
    }
])

// 学习习惯数据
const habits = reactive({
    bestTime: '19:00-21:00',
    studyDaysPerWeek: '5.2天/周'
})

// 日历相关
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const currentDate = ref(new Date())

// 日历标题
const calendarTitle = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth() + 1
    return `${year}年${month}月`
})

// 日历天数
const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // 获取第一天是星期几（0-6，0是星期日）
    const firstDayOfWeek = firstDay.getDay()

    // 获取当月天数
    const daysInMonth = lastDay.getDate()

    // 创建日历数组
    const days = []

    // 填充空白日期
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({
            id: `empty-${i}`,
            empty: true,
            day: ''
        })
    }

    // 填充当月日期
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day

        // 模拟有学习活动的日期（随机）
        const hasActivity = Math.random() > 0.7

        days.push({
            id: `day-${day}`,
            empty: false,
            day,
            isToday,
            hasActivity
        })
    }

    return days
})

// 上个月
const prevMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    )
}

// 下个月
const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    )
}

// 图表引用
const trendChart = ref(null)
const timeDistributionChart = ref(null)
const weeklyDistributionChart = ref(null)

// 图表实例
let trendChartInstance = null
let timeChartInstance = null
let weeklyChartInstance = null

// 初始化图表
const initCharts = () => {
    // 学习趋势图表
    const trendCtx = trendChart.value.getContext('2d')
    trendChartInstance = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
            datasets: [{
                label: '学习时长 (小时)',
                data: [1.5, 2.0, 1.2, 2.5, 1.8, 2.2, 1.5],
                borderColor: '#58a6ff',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                }
            }
        }
    })

    // 时间分布图表
    const timeCtx = timeDistributionChart.value.getContext('2d')
    timeChartInstance = new Chart(timeCtx, {
        type: 'bar',
        data: {
            labels: ['06-08', '08-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24'],
            datasets: [{
                label: '学习时长 (小时)',
                data: [0.2, 0.5, 0.8, 0.3, 0.7, 1.2, 2.5, 1.8, 0.5],
                backgroundColor: '#58a6ff',
                borderColor: '#58a6ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                }
            }
        }
    })

    // 每周分布图表
    const weeklyCtx = weeklyDistributionChart.value.getContext('2d')
    weeklyChartInstance = new Chart(weeklyCtx, {
        type: 'bar',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '学习时长 (小时)',
                data: [2.1, 1.8, 2.5, 1.2, 2.0, 1.5, 1.0],
                backgroundColor: '#3fb950',
                borderColor: '#3fb950',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                }
            }
        }
    })
}

// 更新图表数据
const updateCharts = (period) => {
    // 这里可以根据不同的时间周期更新图表数据
    console.log(`更新图表数据，时间周期: ${period}`)
}

// 组件挂载后初始化图表
onMounted(() => {
    initCharts()
})

// 监听时间周期变化
watch(activePeriod, (newPeriod) => {
    updateCharts(newPeriod)
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

/* 进度概览卡片 */
.progress-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.progress-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
    text-align: center;
}

.progress-card-icon {
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

.progress-card-value {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 4px;
}

.progress-card-label {
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 图表容器 */
.chart-container {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
    margin-bottom: 24px;
    height: 300px;
    position: relative;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.chart-title {
    font-size: 16px;
    font-weight: 600;
}

.chart-actions {
    display: flex;
    gap: 8px;
}

.chart-action {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 6px 12px;
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.chart-action:hover {
    background-color: var(--bg-primary);
}

.chart-action.active {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
}

/* 课程进度列表 */
.course-progress-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.course-progress-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
}

.course-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(63, 185, 80, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--success-color);
}

.course-content {
    flex: 1;
}

.course-title {
    font-weight: 500;
    margin-bottom: 4px;
}

.course-progress-bar {
    height: 6px;
    background-color: var(--bg-secondary);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 8px;
}

.course-progress-fill {
    height: 100%;
    background-color: var(--success-color);
}

.course-stats {
    text-align: right;
}

.course-percent {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
}

.course-time {
    color: var(--text-tertiary);
    font-size: 14px;
}

/* 学习日历 */
.calendar-container {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
    margin-bottom: 24px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.calendar-nav {
    display: flex;
    gap: 12px;
}

.calendar-nav-btn {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.calendar-nav-btn:hover {
    background-color: var(--bg-primary);
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
}

.calendar-day-header {
    text-align: center;
    font-size: 12px;
    color: var(--text-tertiary);
    padding: 8px 0;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.calendar-day:hover {
    background-color: var(--bg-secondary);
}

.calendar-day.active {
    background-color: var(--accent-color);
    color: white;
}

.calendar-day.has-activity {
    position: relative;
}

.calendar-day.has-activity::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--success-color);
}

.calendar-day.empty {
    background-color: transparent;
    cursor: default;
}

.calendar-day.empty:hover {
    background-color: transparent;
}

/* 学习习惯分析 */
.habits-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

.habit-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
}

.habit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.habit-title {
    font-size: 16px;
    font-weight: 600;
}

.habit-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--accent-color);
}

.habit-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.habit-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
}

.habit-item:last-child {
    border-bottom: none;
}

.habit-label {
    font-size: 14px;
}

.habit-amount {
    font-size: 14px;
    color: var(--text-tertiary);
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

    .progress-overview {
        grid-template-columns: 1fr;
    }

    .chart-container {
        height: 250px;
    }

    .calendar-grid {
        gap: 4px;
    }

    .habits-container {
        grid-template-columns: 1fr;
    }

    .course-progress-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .course-stats {
        text-align: left;
        width: 100%;
        margin-top: 12px;
    }
}
</style>