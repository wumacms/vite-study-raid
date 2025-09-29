import { createApp } from 'vue'
import './style.css'
import 'highlight.js/styles/github-dark.min.css'
import router from './router'
import App from './App.vue'


// 创建 Vue 实例
const app = createApp(App)

// 使用 router
app.use(router)

// 挂载 Vue 实例到 #app 元素
app.mount('#app')
