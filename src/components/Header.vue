<template>
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
                    <div class="user-avatar">JS</div>
                </div>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'

const searchTerm = ref('')

const handleSearch = () => {
    // 搜索逻辑可以在父组件中实现
    console.log('搜索关键词:', searchTerm.value)
}
</script>

<style scoped>
/* 导航栏样式 */
header {
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
}

.logo {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
}

.logo i {
    margin-right: 10px;
    color: var(--accent-color);
}

.nav-links {
    display: flex;
    gap: 24px;
}

.nav-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--text-primary);
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-box {
    position: relative;
}

.search-box input {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 8px 12px;
    padding-left: 32px;
    color: var(--text-primary);
    width: 240px;
    font-size: 14px;
}

.search-box i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
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
}
</style>