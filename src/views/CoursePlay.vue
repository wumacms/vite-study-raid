<template>
    <div class="course-play-page">
        <Header />

        <main class="container">
            <div class="course-learning-container">
                <!-- 主要内容区域 -->
                <div class="course-content-area">
                    <!-- 视频播放区域 -->
                    <div class="video-container">
                        <div class="video-placeholder">
                            <i class="fas fa-play-circle"></i>
                            <p>点击播放课程视频</p>
                        </div>
                    </div>

                    <div class="video-controls">
                        <button class="btn btn-secondary" @click="previousLesson">
                            <i class="fas fa-fast-backward"></i> 上一节
                        </button>
                        <button class="btn btn-primary" @click="togglePlay">
                            <i :class="playIcon"></i> {{ playButtonText }}
                        </button>
                        <button class="btn btn-secondary" @click="nextLesson">
                            下一节 <i class="fas fa-fast-forward"></i>
                        </button>
                    </div>

                    <div class="video-info">
                        <h2 class="video-title">{{ currentLesson.title }}</h2>
                        <p class="video-description">
                            {{ currentLesson.description }}
                        </p>

                        <div class="video-navigation">
                            <button class="btn btn-secondary" @click="toggleBookmark">
                                <i :class="bookmarkIcon"></i> {{ bookmarkButtonText }}
                            </button>
                            <button class="btn btn-primary" @click="markAsCompleted" :style="completedButtonStyle">
                                <i :class="completedIcon"></i> {{ completedButtonText }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 侧边栏 -->
                <div class="course-sidebar">
                    <div class="sidebar-header">
                        <h3 class="sidebar-title">课程内容</h3>
                        <span class="progress-text">{{ progress }}% 完成</span>
                    </div>

                    <div class="progress-container">
                        <div class="progress-info">
                            <span>进度</span>
                            <span>{{ completedLessons }}/{{ totalLessons }} 节课</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                        </div>
                    </div>

                    <div class="chapters-list">
                        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
                            <div class="chapter-header" @click="toggleChapter(chapter.id)">
                                <div class="chapter-title">
                                    <i :class="chapter.icon"></i>
                                    <span>{{ chapter.title }}</span>
                                </div>
                                <span>{{ chapter.completed }}/{{ chapter.lessons.length }}</span>
                            </div>
                            <div class="lessons-list" :class="{ active: chapter.isExpanded }">
                                <div v-for="lesson in chapter.lessons" :key="lesson.id" class="lesson-item" :class="{
                                    active: lesson.id === currentLesson.id,
                                    completed: lesson.completed
                                }" @click="selectLesson(lesson)">
                                    <div class="lesson-icon"><i class="fas fa-play-circle"></i></div>
                                    <div class="lesson-title">{{ lesson.title }}</div>
                                    <div class="lesson-duration">{{ lesson.duration }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 资源下载区域 -->
            <div class="resources-section">
                <div class="section-header">课程资源</div>
                <div class="resources-list">
                    <div v-for="resource in resources" :key="resource.id" class="resource-item">
                        <div class="resource-icon">
                            <i :class="resource.icon"></i>
                        </div>
                        <div class="resource-info">
                            <div class="resource-name">{{ resource.name }}</div>
                            <div class="resource-size">{{ resource.size }}</div>
                        </div>
                        <a href="#" class="download-btn" @click.prevent="downloadResource(resource)">下载</a>
                    </div>
                </div>
            </div>

            <!-- 讨论区域 -->
            <div class="discussion-section">
                <div class="discussion-header">
                    <div class="discussion-title">课程讨论</div>
                    <a href="#" class="new-discussion-btn" @click.prevent="startNewDiscussion">发起讨论</a>
                </div>
                <div class="discussion-list">
                    <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
                        <div class="discussion-author">
                            <div class="author-avatar">{{ discussion.author.initials }}</div>
                            <div class="author-name">{{ discussion.author.name }}</div>
                            <div class="discussion-time">{{ discussion.time }}</div>
                        </div>
                        <div class="discussion-content">
                            {{ discussion.content }}
                        </div>
                        <div class="discussion-actions">
                            <div class="discussion-action" @click="likeDiscussion(discussion.id)">
                                <i class="far fa-thumbs-up"></i> {{ discussion.likes }}
                            </div>
                            <div class="discussion-action" @click="replyToDiscussion(discussion.id)">
                                <i class="far fa-comment"></i> 回复
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 响应式数据
const isPlaying = ref(false)
const isBookmarked = ref(false)
const progress = ref(65)
const completedLessons = ref(13)
const totalLessons = ref(20)

// 当前课程信息
const currentLesson = reactive({
    id: 11,
    title: 'JavaScript 异步编程与Promise',
    description: '在本节课程中，我们将深入学习JavaScript中的异步编程概念，包括回调函数、Promise对象以及async/await语法。你将了解如何处理异步操作，避免回调地狱，并编写更加清晰和可维护的异步代码。',
    completed: false
})

// 章节数据
const chapters = ref([
    {
        id: 1,
        title: '第一章: JavaScript基础',
        isExpanded: true,
        completed: 4,
        lessons: [
            { id: 1, title: 'JavaScript简介与历史', duration: '15:30', completed: true },
            { id: 2, title: '变量与数据类型', duration: '22:10', completed: true },
            { id: 3, title: '运算符与表达式', duration: '18:45', completed: true },
            { id: 4, title: '控制流程与循环', duration: '25:20', completed: true }
        ]
    },
    {
        id: 2,
        title: '第二章: 函数与作用域',
        isExpanded: false,
        completed: 3,
        lessons: [
            { id: 5, title: '函数定义与调用', duration: '20:15', completed: true },
            { id: 6, title: '作用域与闭包', duration: '28:30', completed: true },
            { id: 7, title: '高阶函数', duration: '24:10', completed: true },
            { id: 8, title: '递归与柯里化', duration: '19:45', completed: false }
        ]
    },
    {
        id: 3,
        title: '第三章: 面向对象编程',
        isExpanded: false,
        completed: 3,
        lessons: [
            { id: 9, title: '对象与原型', duration: '26:20', completed: true },
            { id: 10, title: '构造函数与类', duration: '30:15', completed: true },
            { id: 11, title: '继承与多态', duration: '22:40', completed: true },
            { id: 12, title: '设计模式应用', duration: '35:10', completed: false },
            { id: 13, title: '模块化开发', duration: '29:25', completed: false }
        ]
    },
    {
        id: 4,
        title: '第四章: 异步编程',
        isExpanded: false,
        completed: 3,
        lessons: [
            { id: 14, title: '异步编程基础', duration: '18:50', completed: true },
            { id: 15, title: '回调函数与事件循环', duration: '32:15', completed: true },
            { id: 16, title: 'Promise与异步操作', duration: '27:30', completed: false },
            { id: 17, title: 'Async/Await语法', duration: '24:45', completed: false },
            { id: 18, title: '错误处理与调试', duration: '21:20', completed: false },
            { id: 19, title: '并发与性能优化', duration: '29:10', completed: false },
            { id: 20, title: '实战项目: 异步数据加载', duration: '45:00', completed: false }
        ]
    }
])

// 资源数据
const resources = ref([
    { id: 1, name: 'JavaScript异步编程指南.pdf', size: '2.4 MB', icon: 'fas fa-file-pdf' },
    { id: 2, name: '示例代码.zip', size: '1.7 MB', icon: 'fas fa-file-code' },
    { id: 3, name: '练习题与答案.docx', size: '856 KB', icon: 'fas fa-file-alt' }
])

// 讨论数据
const discussions = ref([
    {
        id: 1,
        author: { name: 'Michael Johnson', initials: 'MJ' },
        content: '关于Promise链式调用中的错误处理，有没有更优雅的方式？我在实际项目中经常遇到多个异步操作需要依次执行，但错误处理变得很复杂。',
        time: '2小时前',
        likes: 12
    },
    {
        id: 2,
        author: { name: 'Sarah Rodriguez', initials: 'SR' },
        content: '老师讲解的async/await部分非常清晰！我之前一直对异步操作感到困惑，现在终于理解了。有没有推荐的实际项目来练习这些概念？',
        time: '5小时前',
        likes: 8
    },
    {
        id: 3,
        author: { name: 'David Thompson', initials: 'DT' },
        content: '在视频中提到的"回调地狱"问题，我发现在使用Promise.all()时可以很好地解决多个并行异步操作的情况。大家在实际项目中还有什么其他技巧吗？',
        time: '1天前',
        likes: 15
    }
])

// 计算属性
const playIcon = computed(() => isPlaying.value ? 'fas fa-pause' : 'fas fa-play')
const playButtonText = computed(() => isPlaying.value ? '暂停视频' : '播放视频')
const bookmarkIcon = computed(() => isBookmarked.value ? 'fas fa-bookmark' : 'far fa-bookmark')
const bookmarkButtonText = computed(() => isBookmarked.value ? '已收藏' : '收藏本节')
const completedIcon = computed(() => currentLesson.completed ? 'fas fa-check-double' : 'fas fa-check')
const completedButtonText = computed(() => currentLesson.completed ? '已完成' : '标记为已完成')
const completedButtonStyle = computed(() => ({
    backgroundColor: currentLesson.completed ? 'var(--success-color)' : 'var(--accent-color)'
}))

// 方法
const togglePlay = () => {
    isPlaying.value = !isPlaying.value
    // 这里可以添加实际播放/暂停视频的逻辑
}

const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value
}

const markAsCompleted = () => {
    if (!currentLesson.completed) {
        currentLesson.completed = true
        progress.value += 5
        completedLessons.value += 1

        // 更新章节中的课程完成状态
        chapters.value.forEach(chapter => {
            chapter.lessons.forEach(lesson => {
                if (lesson.id === currentLesson.id) {
                    lesson.completed = true
                    chapter.completed = chapter.lessons.filter(l => l.completed).length
                }
            })
        })
    }
}

const toggleChapter = (chapterId) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
        chapter.isExpanded = !chapter.isExpanded
    }
}

const selectLesson = (lesson) => {
    // 更新当前课程
    Object.assign(currentLesson, {
        id: lesson.id,
        title: lesson.title,
        description: generateDescription(lesson.title),
        completed: lesson.completed
    })

    // 重置播放状态
    isPlaying.value = false
}

const previousLesson = () => {
    // 实现上一节课逻辑
    console.log('上一节课')
}

const nextLesson = () => {
    // 实现下一节课逻辑
    console.log('下一节课')
}

const downloadResource = (resource) => {
    console.log('下载资源:', resource.name)
    // 实现下载逻辑
}

const startNewDiscussion = () => {
    console.log('发起新讨论')
}

const likeDiscussion = (discussionId) => {
    const discussion = discussions.value.find(d => d.id === discussionId)
    if (discussion) {
        discussion.likes += 1
    }
}

const replyToDiscussion = (discussionId) => {
    console.log('回复讨论:', discussionId)
}

const generateDescription = (title) => {
    // 根据标题生成描述（实际项目中应该从后端获取）
    const descriptions = {
        'JavaScript简介与历史': '本节课程将介绍JavaScript的发展历史、特点和应用场景。',
        '变量与数据类型': '深入学习JavaScript中的变量声明、数据类型及其特性。',
        'Promise与异步操作': '在本节课程中，我们将深入学习JavaScript中的异步编程概念，包括回调函数、Promise对象以及async/await语法。'
    }
    return descriptions[title] || `关于"${title}"的详细讲解。`
}

// 初始化：设置当前课程的图标
chapters.value.forEach(chapter => {
    chapter.icon = chapter.isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right'
})
</script>

<style scoped>
/* 课程学习页面布局 */
.course-learning-container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;
    margin: 24px 0;
}

/* 课程内容区域 */
.course-content-area {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.video-container {
    position: relative;
    width: 100%;
    background-color: #000;
    aspect-ratio: 16/9;
}

.video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1f2e, #0d1117);
}

.video-placeholder i {
    font-size: 64px;
    color: var(--accent-color);
    margin-bottom: 16px;
}

.video-placeholder p {
    color: var(--text-secondary);
    font-size: 18px;
}

.video-controls {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background-color: var(--bg-tertiary);
    border-top: 1px solid var(--border-color);
}

.video-info {
    padding: 20px;
}

.video-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
}

.video-description {
    color: var(--text-secondary);
    line-height: 1.6;
}

.video-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
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

/* 侧边栏 */
.course-sidebar {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
    height: fit-content;
    position: sticky;
    top: 90px;
}

.sidebar-header {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidebar-title {
    font-size: 18px;
    font-weight: 600;
}

.progress-container {
    padding: 16px;
    border-bottom: 1px solid var(--border-color);
}

.progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
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
    width: 65%;
}

.chapters-list {
    max-height: 500px;
    overflow-y: auto;
}

.chapter-item {
    border-bottom: 1px solid var(--border-color);
}

.chapter-item:last-child {
    border-bottom: none;
}

.chapter-header {
    padding: 12px 16px;
    background-color: var(--bg-tertiary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.chapter-title {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

.lessons-list {
    display: none;
    background-color: var(--bg-primary);
}

.lessons-list.active {
    display: block;
}

.lesson-item {
    padding: 12px 16px 12px 32px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.lesson-item:hover {
    background-color: var(--bg-tertiary);
}

.lesson-item.active {
    background-color: var(--bg-tertiary);
    border-left: 3px solid var(--accent-color);
}

.lesson-item.completed .lesson-title {
    color: var(--success-color);
}

.lesson-item.completed .lesson-icon {
    color: var(--success-color);
}

.lesson-icon {
    width: 20px;
    text-align: center;
    color: var(--text-tertiary);
}

.lesson-title {
    flex: 1;
    font-size: 14px;
}

.lesson-duration {
    font-size: 12px;
    color: var(--text-tertiary);
}

/* 资源下载区域 */
.resources-section {
    margin-top: 24px;
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.section-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    font-size: 18px;
    font-weight: 600;
}

.resources-list {
    padding: 16px 20px;
}

.resource-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
}

.resource-item:last-child {
    border-bottom: none;
}

.resource-icon {
    width: 32px;
    height: 32px;
    background-color: var(--bg-tertiary);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
}

.resource-info {
    flex: 1;
}

.resource-name {
    font-weight: 500;
    margin-bottom: 4px;
}

.resource-size {
    font-size: 12px;
    color: var(--text-tertiary);
}

.download-btn {
    padding: 6px 12px;
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    font-size: 12px;
    color: var(--text-primary);
    text-decoration: none;
    transition: background-color 0.2s;
}

.download-btn:hover {
    background-color: var(--accent-color);
}

/* 讨论区域 */
.discussion-section {
    margin-top: 24px;
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.discussion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
}

.discussion-title {
    font-size: 18px;
    font-weight: 600;
}

.new-discussion-btn {
    padding: 8px 16px;
    background-color: var(--accent-color);
    color: white;
    border-radius: var(--border-radius);
    font-size: 14px;
    text-decoration: none;
}

.discussion-list {
    padding: 16px 20px;
}

.discussion-item {
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
}

.discussion-item:last-child {
    border-bottom: none;
}

.discussion-author {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.author-name {
    font-weight: 500;
    font-size: 14px;
}

.discussion-time {
    font-size: 12px;
    color: var(--text-tertiary);
}

.discussion-content {
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 8px;
}

.discussion-actions {
    display: flex;
    gap: 16px;
}

.discussion-action {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: color 0.2s;
}

.discussion-action:hover {
    color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .course-learning-container {
        grid-template-columns: 1fr;
    }

    .course-sidebar {
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

    .video-navigation {
        flex-direction: column;
        gap: 12px;
    }

    .video-navigation .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>