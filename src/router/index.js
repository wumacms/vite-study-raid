// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 定义路由表
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/Signup.vue'),
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPassword.vue'),
    },
    {
        path: '/terms',
        name: 'Terms',
        component: () => import('../views/Terms.vue'),
    },
    {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('../views/Privacy.vue'),
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
    },
    {
        path: '/my-courses',
        name: 'MyCourses',
        component: () => import('../views/MyCourses.vue'),
    },
    {
        path: '/explore',
        name: 'Explore',
        component: () => import('../views/Explore.vue'),
    },
    {
        path: '/learning-path',
        name: 'LearningPath',
        component: () => import('../views/LearningPath.vue'),
    },
    {
        path: '/progress-tracking',
        name: 'ProgressTracking',
        component: () => import('../views/ProgressTracking.vue'),
    },
    {
        path: '/course-detail/:id',
        name: 'CourseDetail',
        component: () => import('../views/CourseDetail.vue'),
    },
    {
        path: '/account-settings',
        name: 'AccountSettings',
        component: () => import('../views/AccountSettings.vue'),
    },
    {
        path: '/logout',
        name: 'Logout',
        component: () => import('../views/Logout.vue'),
    },
    {
        path: '/my-stats',
        name: 'MyStats',
        component: () => import('../views/MyStats.vue'),
    },
    {
        path: '/my-cert',
        name: 'MyCert',
        component: () => import('../views/MyCert.vue'),
    },
    {
        path: '/help',
        name: 'Help',
        component: () => import('../views/Help.vue'),
    },
    {
        path: '/course-play/:id',
        name: 'CoursePlay',
        component: () => import('../views/CoursePlay.vue'),
    },
]

// 创建 router 实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Vite 推荐用 import.meta.env.BASE_URL
    routes,
})

export default router