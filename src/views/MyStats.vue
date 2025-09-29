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
                        <input type="text" placeholder="搜索课程...">
                    </div>
                    <div class="user-avatar">JS</div>
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
                    <router-link to="/my-stat" class="menu-item" :class="{ active: activeMenu === 'stats' }"
                        @click.prevent="setActiveMenu('stats')">
                        <i class="fas fa-chart-line"></i>
                        <span>学习统计</span>
                    </router-link>
                    <router-link to="/my-cert" class="menu-item" :class="{ active: activeMenu === 'cert' }"
                        @click.prevent="setActiveMenu('cert')">
                        <i class="fas fa-certificate"></i>
                        <span>我的证书</span>
                    </router-link>
                    <router-link to="/account-settings" class="menu-item" :class="{ active: activeMenu === 'settings' }"
                        @click.prevent="setActiveMenu('settings')">
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
                <!-- 学习概览部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">学习概览</h3>
                        <div class="chart-actions">
                            <button class="chart-action" :class="{ active: selectedPeriod === 'week' }"
                                @click="changePeriod('week')">
                                本周
                            </button>
                            <button class="chart-action" :class="{ active: selectedPeriod === 'month' }"
                                @click="changePeriod('month')">
                                本月
                            </button>
                            <button class="chart-action" :class="{ active: selectedPeriod === 'year' }"
                                @click="changePeriod('year')">
                                全年
                            </button>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-card-value">{{ stats.learningHours }}</div>
                            <div class="stat-card-label">学习时长 (小时)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <div class="stat-card-value">{{ stats.completedCourses }}</div>
                            <div class="stat-card-label">完成课程数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-fire"></i>
                            </div>
                            <div class="stat-card-value">{{ stats.streakDays }}</div>
                            <div class="stat-card-label">连续学习天数</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="stat-card-value">{{ stats.completionRate }}</div>
                            <div class="stat-card-label">平均完成率</div>
                        </div>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <div class="chart-title">学习时间趋势</div>
                        </div>
                        <canvas ref="trendChartRef"></canvas>
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
                            <span>{{ calendar.currentMonth }}</span>
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
                            <div v-for="day in calendar.days" :key="day.date" class="calendar-day" :class="{
                                empty: day.empty,
                                active: day.isToday,
                                'has-activity': day.hasActivity
                            }">
                                {{ day.day }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 时间分布部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">时间分布</h3>
                    </div>

                    <div class="time-distribution">
                        <div class="time-card">
                            <div class="time-card-header">
                                <div class="time-card-title">每日学习时间</div>
                                <div class="time-card-value">{{ dailyStats.averageHours }}h</div>
                            </div>
                            <div class="chart-container">
                                <canvas ref="dailyChartRef"></canvas>
                            </div>
                        </div>

                        <div class="time-card">
                            <div class="time-card-header">
                                <div class="time-card-title">课程时间分布</div>
                            </div>
                            <div class="chart-container">
                                <canvas ref="courseChartRef"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 成就徽章部分 -->
                <div class="content-section">
                    <div class="section-header">
                        <h3 class="section-title">成就徽章</h3>
                        <a href="#" class="section-action">查看全部</a>
                    </div>

                    <div class="badges-container">
                        <div v-for="badge in badges" :key="badge.name" class="badge-item"
                            :class="{ locked: badge.locked }">
                            <div class="badge-icon">
                                <i :class="badge.icon"></i>
                            </div>
                            <div class="badge-name">{{ badge.name }}</div>
                            <div class="badge-desc">{{ badge.description }}</div>
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
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// 响应式数据
const selectedPeriod = ref('week')

// 统计卡片数据
const stats = reactive({
    learningHours: 12.5,
    completedCourses: 8,
    streakDays: 7,
    completionRate: '87%'
})

// 日历数据
const calendar = reactive({
    currentDate: new Date(),
    currentMonth: '',
    days: []
})

// 每日统计数据
const dailyStats = reactive({
    averageHours: 2.1
})

// 活动菜单项
const activeMenu = ref('stats')

// 徽章数据
const badges = ref([
    {
        name: '学习先锋',
        description: '连续学习7天',
        icon: 'fas fa-rocket',
        locked: false
    },
    {
        name: '课程达人',
        description: '完成5门课程',
        icon: 'fas fa-book',
        locked: false
    },
    {
        name: '时间管理大师',
        description: '学习超过50小时',
        icon: 'fas fa-clock',
        locked: false
    },
    {
        name: '全能学霸',
        description: '完成所有课程',
        icon: 'fas fa-trophy',
        locked: true
    },
    {
        name: '编程高手',
        description: '完成编程类课程',
        icon: 'fas fa-code',
        locked: false
    },
    {
        name: '国际视野',
        description: '学习3门以上外语课程',
        icon: 'fas fa-globe',
        locked: true
    }
])

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 图表引用
const trendChartRef = ref(null)
const dailyChartRef = ref(null)
const courseChartRef = ref(null)

// 图表实例
let trendChart = null
let dailyChart = null
let courseChart = null

// 方法
const changePeriod = (period) => {
    selectedPeriod.value = period
    updateCharts(period)
}

const updateCharts = (period) => {
    // 这里可以根据不同的时间周期更新图表数据
    console.log(`更新图表数据，时间周期: ${period}`)
}

const prevMonth = () => {
    calendar.currentDate.setMonth(calendar.currentDate.getMonth() - 1)
    renderCalendar()
}

const nextMonth = () => {
    calendar.currentDate.setMonth(calendar.currentDate.getMonth() + 1)
    renderCalendar()
}

const renderCalendar = () => {
    const date = calendar.currentDate
    const year = date.getFullYear()
    const month = date.getMonth()

    // 更新月份标题
    calendar.currentMonth = `${year}年${month + 1}月`

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // 获取第一天是星期几（0-6，0是星期日）
    const firstDayOfWeek = firstDay.getDay()

    // 清空天数数组
    calendar.days = []

    // 填充空白日期
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendar.days.push({
            date: `empty-${i}`,
            day: '',
            empty: true,
            isToday: false,
            hasActivity: false
        })
    }

    // 填充当月日期
    const today = new Date()
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day

        // 模拟有学习活动的日期（随机）
        const hasActivity = Math.random() > 0.7

        calendar.days.push({
            date: `${year}-${month}-${day}`,
            day,
            empty: false,
            isToday,
            hasActivity
        })
    }
}

// 初始化图表
const initCharts = () => {
    // 学习趋势图表
    if (trendChartRef.value) {
        trendChart = new Chart(trendChartRef.value, {
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
    }

    // 每日学习时间图表
    if (dailyChartRef.value) {
        dailyChart = new Chart(dailyChartRef.value, {
            type: 'bar',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                datasets: [{
                    label: '学习时长 (小时)',
                    data: [2.1, 1.8, 2.5, 1.2, 2.0, 1.5, 1.0],
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
    }

    // 课程时间分布图表
    if (courseChartRef.value) {
        courseChart = new Chart(courseChartRef.value, {
            type: 'doughnut',
            data: {
                labels: ['JavaScript', 'Python', 'React', 'Node.js', '其他'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#58a6ff',
                        '#3fb950',
                        '#d29922',
                        '#db61a2',
                        '#8b949e'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#8b949e',
                            padding: 15
                        }
                    }
                }
            }
        })
    }
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

// 生命周期
onMounted(() => {
    renderCalendar()
    nextTick(() => {
        initCharts()
    })
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

/* 时间分布 */
.time-distribution {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.time-card {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 20px;
}

.time-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.time-card-title {
    font-size: 16px;
    font-weight: 600;
}

.time-card-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--accent-color);
}

.time-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.time-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-color);
}

.time-item:last-child {
    border-bottom: none;
}

.time-label {
    font-size: 14px;
}

.time-amount {
    font-size: 14px;
    color: var(--text-tertiary);
}

/* 成就徽章 */
.badges-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.badge-item {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 16px;
    text-align: center;
    transition: transform 0.2s;
}

.badge-item:hover {
    transform: translateY(-4px);
}

.badge-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(88, 166, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
    color: var(--accent-color);
    font-size: 20px;
}

.badge-name {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
}

.badge-desc {
    font-size: 12px;
    color: var(--text-tertiary);
}

.badge-item.locked {
    opacity: 0.5;
}

.badge-item.locked .badge-icon {
    background-color: var(--bg-secondary);
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

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .chart-container {
        height: 250px;
    }

    .calendar-grid {
        gap: 4px;
    }

    .badges-container {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}
</style>