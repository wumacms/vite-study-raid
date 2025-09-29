<template>
    <div class="course-detail-page">
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
                            <input type="text" placeholder="搜索课程...">
                        </div>
                        <a href="/profile" class="user-avatar">JS</a>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 课程学习内容 -->
        <main class="container">
            <div class="course-learning-container">
                <!-- 侧边栏 -->
                <div class="course-sidebar">
                    <div class="sidebar-header">
                        <h3 class="sidebar-title">课程内容</h3>
                        <span class="progress-text">{{ progressPercentage }}% 完成</span>
                    </div>

                    <div class="progress-container">
                        <div class="progress-info">
                            <span>进度</span>
                            <span>{{ completedLessons }}/{{ totalLessons }} 节课</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                        </div>
                    </div>

                    <div class="chapters-list">
                        <!-- 章节列表 -->
                        <div v-for="chapter in chapters" :key="chapter.id" class="chapter-item">
                            <div class="chapter-header" @click="toggleChapter(chapter.id)">
                                <div class="chapter-title">
                                    <i class="fas"
                                        :class="chapter.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                                    <span>{{ chapter.title }}</span>
                                </div>
                                <span>{{ chapter.completedLessons }}/{{ chapter.totalLessons }}</span>
                            </div>
                            <div class="lessons-list" :class="{ active: chapter.isExpanded }">
                                <div v-for="lesson in chapter.lessons" :key="lesson.id" class="lesson-item" :class="{
                                    active: activeLessonId === lesson.id,
                                    completed: lesson.completed
                                }" @click="selectLesson(lesson.id)">
                                    <div class="lesson-icon"><i class="fas fa-file-alt"></i></div>
                                    <div class="lesson-title">{{ lesson.title }}</div>
                                    <div class="lesson-duration">阅读: {{ lesson.duration }}分钟</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 文章内容区域 -->
                <div class="article-content-area">
                    <div class="article-header">
                        <h1 class="article-title">{{ activeLesson.title }}</h1>
                        <div class="article-meta">
                            <span><i class="far fa-clock"></i> 预计阅读时间: {{ activeLesson.duration }}分钟</span>
                            <span><i class="far fa-calendar"></i> 最后更新: {{ activeLesson.lastUpdated }}</span>
                        </div>
                    </div>
                    <div class="article-body">
                        <div class="markdown-content" v-html="renderedMarkdown"></div>
                    </div>
                    <div class="article-actions">
                        <div class="navigation-buttons">
                            <button class="btn btn-secondary" @click="goToPreviousLesson">
                                <i class="fas fa-arrow-left"></i> 上一节
                            </button>
                            <button class="btn btn-secondary" @click="goToNextLesson">
                                下一节 <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <button class="btn" :class="activeLesson.completed ? 'btn-success' : 'btn-primary'"
                            @click="markLessonComplete" :disabled="activeLesson.completed">
                            <i :class="activeLesson.completed ? 'fas fa-check-double' : 'fas fa-check'"></i>
                            {{ activeLesson.completed ? '已完成' : '标记为已完成' }}
                        </button>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

// 响应式数据
const chapters = ref([
    {
        id: 1,
        title: "第一章: JavaScript基础",
        isExpanded: true,
        completedLessons: 4,
        totalLessons: 4,
        lessons: [
            { id: 1, title: "JavaScript简介与历史", duration: 15, completed: true, lastUpdated: "2023-09-01" },
            { id: 2, title: "变量与数据类型", duration: 22, completed: true, lastUpdated: "2023-09-05" },
            { id: 3, title: "运算符与表达式", duration: 18, completed: true, lastUpdated: "2023-09-08" },
            { id: 4, title: "控制流程与循环", duration: 25, completed: true, lastUpdated: "2023-09-12" }
        ]
    },
    {
        id: 2,
        title: "第二章: 函数与作用域",
        isExpanded: false,
        completedLessons: 3,
        totalLessons: 4,
        lessons: [
            { id: 5, title: "函数定义与调用", duration: 20, completed: true, lastUpdated: "2023-09-15" },
            { id: 6, title: "作用域与闭包", duration: 28, completed: true, lastUpdated: "2023-09-18" },
            { id: 7, title: "高阶函数", duration: 24, completed: true, lastUpdated: "2023-09-22" },
            { id: 8, title: "递归与柯里化", duration: 19, completed: false, lastUpdated: "2023-09-25" }
        ]
    },
    {
        id: 3,
        title: "第三章: 面向对象编程",
        isExpanded: false,
        completedLessons: 3,
        totalLessons: 5,
        lessons: [
            { id: 9, title: "对象与原型", duration: 26, completed: true, lastUpdated: "2023-09-28" },
            { id: 10, title: "构造函数与类", duration: 30, completed: true, lastUpdated: "2023-10-02" },
            { id: 11, title: "继承与多态", duration: 22, completed: true, lastUpdated: "2023-10-05" },
            { id: 12, title: "设计模式应用", duration: 35, completed: false, lastUpdated: "2023-10-08" },
            { id: 13, title: "模块化开发", duration: 29, completed: false, lastUpdated: "2023-10-10" }
        ]
    },
    {
        id: 4,
        title: "第四章: 异步编程",
        isExpanded: false,
        completedLessons: 3,
        totalLessons: 7,
        lessons: [
            { id: 14, title: "异步编程基础", duration: 18, completed: true, lastUpdated: "2023-10-12" },
            { id: 15, title: "回调函数与事件循环", duration: 32, completed: true, lastUpdated: "2023-10-14" },
            { id: 16, title: "Promise与异步操作", duration: 27, completed: false, lastUpdated: "2023-10-15" },
            { id: 17, title: "Async/Await语法", duration: 24, completed: false, lastUpdated: "2023-10-16" },
            { id: 18, title: "错误处理与调试", duration: 21, completed: false, lastUpdated: "2023-10-18" },
            { id: 19, title: "并发与性能优化", duration: 29, completed: false, lastUpdated: "2023-10-20" },
            { id: 20, title: "实战项目: 异步数据加载", duration: 45, completed: false, lastUpdated: "2023-10-22" }
        ]
    }
])

const activeLessonId = ref(16)
const markdownContents = ref({
    1: `# JavaScript简介与历史\n\nJavaScript是一种高级的、解释型的编程语言。`,
    2: `# 变量与数据类型\n\nJavaScript有几种基本数据类型。`,
    16: `# Promise与异步操作

Promise是JavaScript中处理异步操作的一种强大方式。它代表一个异步操作的最终完成（或失败）及其结果值。

## 什么是Promise？

Promise是一个对象，它代表了一个异步操作的最终完成或失败。由于它的then方法返回一个新的Promise，所以可以链式调用。

### Promise的三种状态

1. **pending（待定）**：初始状态，既不是成功，也不是失败状态。
2. **fulfilled（已兑现）**：意味着操作成功完成。
3. **rejected（已拒绝）**：意味着操作失败。

## 创建Promise

\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
    // 异步操作
    setTimeout(() => {
        const success = true; // 模拟操作成功或失败
        
        if (success) {
            resolve('操作成功！');
        } else {
            reject('操作失败！');
        }
    }, 1000);
});
\`\`\`

## 使用Promise

\`\`\`javascript
myPromise
    .then(result => {
        console.log(result); // "操作成功！"
    })
    .catch(error => {
        console.error(error); // "操作失败！"
    })
    .finally(() => {
        console.log('操作完成'); // 无论成功或失败都会执行
    });
\`\`\`

## Promise链式调用

Promise的一个强大特性是能够链式调用：

\`\`\`javascript
function fetchUserData(userId) {
    return fetch(\`/api/users/\${userId}\`)
        .then(response => response.json())
        .then(user => {
            return fetch(\`/api/posts?userId=\${user.id}\`);
        })
        .then(response => response.json())
        .then(posts => {
            return { user, posts };
        })
        .catch(error => {
            console.error('获取数据失败:', error);
        });
}
\`\`\`

## Promise.all()

当需要等待多个Promise都完成时，可以使用Promise.all()：

\`\`\`javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(values => {
    console.log(values); // [3, 42, "foo"]
});
\`\`\`

## Promise.race()

Promise.race()方法返回一个Promise，一旦迭代器中的某个Promise解决或拒绝，返回的Promise就会解决或拒绝：

\`\`\`javascript
const promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then(value => {
    console.log(value); // "two" - 因为promise2更快完成
});
\`\`\`

## 实际应用示例

以下是一个使用Promise处理多个异步操作的示例：

\`\`\`javascript
function loadUserProfile(userId) {
    return Promise.all([
        fetchUser(userId),
        fetchUserPosts(userId),
        fetchUserFriends(userId)
    ]).then(([user, posts, friends]) => {
        return {
            user,
            posts,
            friends
        };
    });
}

// 使用示例
loadUserProfile(123)
    .then(profile => {
        console.log('用户资料:', profile);
        renderProfile(profile);
    })
    .catch(error => {
        console.error('加载用户资料失败:', error);
        showErrorMessage('无法加载用户资料');
    });
\`\`\`

## 总结

Promise是JavaScript异步编程的核心概念之一，它解决了回调地狱的问题，使异步代码更加清晰和易于维护。在现代JavaScript开发中，Promise与async/await结合使用，可以编写出更加优雅的异步代码。

在下一节中，我们将学习async/await语法，这是基于Promise的语法糖，使异步代码看起来更像同步代码。`
})

// 计算属性
const activeLesson = computed(() => {
    for (const chapter of chapters.value) {
        const lesson = chapter.lessons.find(l => l.id === activeLessonId.value)
        if (lesson) return lesson
    }
    return { title: '课程未找到', duration: 0, lastUpdated: '', completed: false }
})

const renderedMarkdown = computed(() => {
    const markdown = markdownContents.value[activeLessonId.value] || '# 内容加载中...'
    return marked.parse(markdown)
})

const completedLessons = computed(() => {
    let count = 0
    chapters.value.forEach(chapter => {
        count += chapter.lessons.filter(lesson => lesson.completed).length
    })
    return count
})

const totalLessons = computed(() => {
    let count = 0
    chapters.value.forEach(chapter => {
        count += chapter.lessons.length
    })
    return count
})

const progressPercentage = computed(() => {
    return Math.round((completedLessons.value / totalLessons.value) * 100)
})

// 方法
const toggleChapter = (chapterId) => {
    const chapter = chapters.value.find(c => c.id === chapterId)
    if (chapter) {
        chapter.isExpanded = !chapter.isExpanded
    }
}

const selectLesson = (lessonId) => {
    activeLessonId.value = lessonId
    // 确保包含该课程的章节是展开的
    const chapter = chapters.value.find(c => c.lessons.some(l => l.id === lessonId))
    if (chapter && !chapter.isExpanded) {
        chapter.isExpanded = true
    }
}

const markLessonComplete = () => {
    if (activeLesson.value.completed) return

    // 更新课程完成状态
    for (const chapter of chapters.value) {
        const lesson = chapter.lessons.find(l => l.id === activeLessonId.value)
        if (lesson) {
            lesson.completed = true
            break
        }
    }

    // 更新章节完成计数
    updateChapterCompletionCounts()
}

const updateChapterCompletionCounts = () => {
    chapters.value.forEach(chapter => {
        const completedCount = chapter.lessons.filter(lesson => lesson.completed).length
        chapter.completedLessons = completedCount
    })
}

const goToPreviousLesson = () => {
    const allLessons = chapters.value.flatMap(chapter => chapter.lessons)
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLessonId.value)

    if (currentIndex > 0) {
        selectLesson(allLessons[currentIndex - 1].id)
        scrollToLesson(allLessons[currentIndex - 1].id)
    }
}

const goToNextLesson = () => {
    const allLessons = chapters.value.flatMap(chapter => chapter.lessons)
    const currentIndex = allLessons.findIndex(lesson => lesson.id === activeLessonId.value)

    if (currentIndex < allLessons.length - 1) {
        selectLesson(allLessons[currentIndex + 1].id)
        scrollToLesson(allLessons[currentIndex + 1].id)
    }
}

const scrollToLesson = (lessonId) => {
    const lessonElement = document.querySelector(`.lesson-item[data-lesson="${lessonId}"]`)
    if (lessonElement) {
        lessonElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}

// 生命周期
onMounted(() => {
    // 初始化代码高亮
    hljs.highlightAll()
})

// 监听活动课程变化，重新高亮代码
watch(activeLessonId, () => {
    nextTick(() => {
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block)
        })
    })
})
</script>

<style scoped>
/* 课程学习页面布局 */
.course-learning-container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 24px;
    margin: 24px 0;
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
    transition: width 0.3s ease;
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

/* 文章内容区域 */
.article-content-area {
    background-color: var(--bg-secondary);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    overflow: hidden;
    min-height: 600px;
}

.article-header {
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
}

.article-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 12px;
}

.article-meta {
    display: flex;
    gap: 16px;
    color: var(--text-tertiary);
    font-size: 14px;
}

.article-body {
    padding: 24px;
    line-height: 1.7;
}

/* 文章底部操作 */
.article-actions {
    padding: 20px 24px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navigation-buttons {
    display: flex;
    gap: 4px;
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

.btn-success {
    background-color: var(--success-color);
    color: white;
}

.btn-success:hover {
    background-color: #36a241;
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

    .article-actions {
        flex-direction: column;
        gap: 12px;
    }

    .article-actions .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>