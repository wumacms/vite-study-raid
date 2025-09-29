<template>
    <div class="privacy-page">
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
                            <input type="text" placeholder="搜索课程..." v-model="searchQuery" @keypress="handleSearch">
                        </div>
                        <div class="user-avatar">JS</div>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 隐私政策内容 -->
        <main class="container">
            <div class="privacy-container">
                <div class="privacy-header">
                    <div class="privacy-logo">
                        <i class="fas fa-graduation-cap"></i>
                        StudyRaid
                    </div>
                    <h1 class="privacy-title">隐私政策</h1>
                    <p class="privacy-subtitle">最后更新日期：{{ lastUpdateDate }}</p>
                </div>

                <div class="privacy-content">
                    <div class="markdown-content" v-html="renderedMarkdown"></div>

                    <router-link to="/" class="back-link">
                        <i class="fas fa-arrow-left"></i>
                        返回首页
                    </router-link>
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
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

// 响应式数据
const searchQuery = ref('')
const lastUpdateDate = ref('2023年10月15日')

// 隐私政策的 Markdown 内容
const privacyMarkdown = `# 1. 引言

StudyRaid（"我们"、"我们的"）重视您的隐私。本隐私政策解释了当您使用我们的网站、应用程序和服务（统称为"服务"）时，我们如何收集、使用、披露和保护您的个人信息。

通过使用我们的服务，您同意我们按照本隐私政策收集和处理您的个人信息。如果您不同意本隐私政策的任何部分，请不要使用我们的服务。

# 2. 我们收集的信息

我们收集以下类型的个人信息：

- **账户信息：** 当您创建账户时，我们收集您的姓名、电子邮件地址和密码。
- **个人资料信息：** 您可以选择提供额外的信息，如个人简介、头像、教育背景等。
- **学习数据：** 我们收集您使用服务的数据，包括您访问的课程、学习进度、测验成绩等。
- **技术信息：** 我们自动收集某些技术信息，包括IP地址、浏览器类型、设备信息、操作系统和访问时间。
- **Cookies和类似技术：** 我们使用cookies和类似技术来增强用户体验和分析服务使用情况。

# 3. 我们如何使用您的信息

我们使用收集的信息用于以下目的：

- 提供、维护和改进我们的服务
- 处理您的注册并管理您的账户
- 个性化您的学习体验
- 与您沟通，包括发送服务相关通知和营销信息
- 分析和了解用户如何使用我们的服务
- 检测、预防和解决技术问题和安全问题
- 遵守法律义务和执行我们的服务条款

# 4. 信息共享与披露

我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：

- **服务提供商：** 与帮助我们运营服务的第三方服务提供商共享必要信息。
- **法律要求：** 当法律要求或为了保护我们的权利、财产或安全时。
- **业务转让：** 如果StudyRaid涉及合并、收购或资产出售，您的个人信息可能会被转移。
- **征得您同意：** 在获得您明确同意的情况下共享信息。

<div class="highlight">
**重要提示：** 我们仅共享提供服务所必需的信息，并要求第三方服务提供商保护您的信息。
</div>

# 5. 数据安全

我们采取合理的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。这些措施包括：

- 使用SSL加密传输敏感信息
- 定期审查我们的信息收集、存储和处理实践
- 限制员工访问个人信息，并要求他们遵守保密义务

尽管我们努力保护您的个人信息，但没有任何安全措施是绝对安全的，我们不能保证信息的绝对安全。

# 6. 数据保留

我们仅在实现本隐私政策所述目的所需的时间内保留您的个人信息，除非法律要求或允许更长的保留期。

当您的个人信息不再需要时，我们将安全地删除或匿名化处理。

# 7. 您的权利

根据适用法律，您可能拥有以下权利：

- **访问权：** 请求访问我们持有的关于您的个人信息。
- **更正权：** 请求更正不准确或不完整的个人信息。
- **删除权：** 请求删除您的个人信息。
- **限制处理权：** 请求限制处理您的个人信息。
- **数据可携权：** 请求以结构化、常用且机器可读的格式接收您的个人信息。
- **反对权：** 反对基于合法权益处理您的个人信息。

要行使这些权利，请通过privacy@studyraid.com联系我们。

# 8. Cookies和跟踪技术

我们使用cookies和类似技术来：

- 记住您的偏好和设置
- 了解您如何使用我们的服务
- 提供个性化内容和广告
- 分析和改进我们的服务

您可以通过浏览器设置控制cookies的使用。但是，禁用cookies可能会影响服务的某些功能。

# 9. 儿童隐私

我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。

如果我们发现我们收集了13岁以下儿童的个人信息，我们将采取措施尽快删除这些信息。

# 10. 国际数据传输

您的个人信息可能被传输到并在您所在国家以外的国家进行处理。这些国家的数据保护法律可能与您所在国家的法律不同。

当我们将个人信息传输到其他国家时，我们会采取适当措施保护这些信息，包括使用标准合同条款。

# 11. 隐私政策的变更

我们可能会不时更新本隐私政策。我们将在网站上发布任何变更，并在重大变更时通过电子邮件或其他方式通知您。

在变更生效后继续使用我们的服务，即表示您接受修订后的隐私政策。

# 12. 联系我们

如果您对本隐私政策有任何疑问或担忧，请通过以下方式联系我们：

- 电子邮件：privacy@studyraid.com
- 邮寄地址：北京市朝阳区某某路123号StudyRaid隐私保护部

<div class="update-info">
**更新历史：**

**2023年10月15日：** 增加了关于国际数据传输的条款，并更新了联系信息。

**2023年6月1日：** 首次发布隐私政策。
</div>`

// 计算属性 - 渲染后的 Markdown 内容
const renderedMarkdown = computed(() => {
    return marked.parse(privacyMarkdown)
})

// 方法
const handleSearch = (e) => {
    if (e.key === 'Enter') {
        alert('搜索功能将在完整网站中实现')
        searchQuery.value = ''
    }
}

// 生命周期
onMounted(() => {
    // 配置 marked.js
    marked.setOptions({
        breaks: true,
        gfm: true
    })
})
</script>

<style scoped>
/* 隐私政策内容样式 */
.privacy-container {
    flex: 1;
    padding: 40px 0;
    max-width: 900px;
    margin: 0 auto;
}

.privacy-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.privacy-logo {
    font-size: 32px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.privacy-logo i {
    margin-right: 12px;
    color: var(--accent-color);
}

.privacy-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.privacy-subtitle {
    color: var(--text-tertiary);
    font-size: 14px;
}

.privacy-content {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 32px;
    margin-bottom: 40px;
}

/* Markdown 内容样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
    color: var(--accent-color);
    margin-top: 24px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}

.markdown-content :deep(h1) {
    font-size: 24px;
}

.markdown-content :deep(h2) {
    font-size: 20px;
}

.markdown-content :deep(h3) {
    font-size: 18px;
}

.markdown-content :deep(p) {
    margin-bottom: 16px;
    color: var(--text-secondary);
    font-size: 14px;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    margin-left: 20px;
    margin-bottom: 16px;
    color: var(--text-secondary);
    font-size: 14px;
}

.markdown-content :deep(li) {
    margin-bottom: 8px;
}

.markdown-content :deep(strong) {
    color: var(--text-primary);
}

.markdown-content :deep(.highlight) {
    background-color: rgba(88, 166, 255, 0.1);
    border-left: 3px solid var(--accent-color);
    padding: 12px 16px;
    margin: 16px 0;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.markdown-content :deep(.update-info) {
    background-color: var(--bg-tertiary);
    border-radius: var(--border-radius);
    padding: 16px;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-tertiary);
}

.markdown-content :deep(.update-info strong) {
    color: var(--text-secondary);
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--accent-color);
    text-decoration: none;
    font-size: 14px;
    margin-top: 20px;
    transition: color 0.2s;
}

.back-link:hover {
    color: #4a93e0;
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

    .privacy-container {
        padding: 24px 0;
    }

    .privacy-content {
        padding: 24px;
    }
}
</style>