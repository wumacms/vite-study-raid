<template>
    <div class="terms-page">
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
                            <input type="text" placeholder="搜索课程..." v-model="searchQuery"
                                @keypress.enter="handleSearch">
                        </div>
                        <div class="user-avatar">JS</div>
                    </div>
                </nav>
            </div>
        </header>

        <!-- 服务条款内容 -->
        <main class="container">
            <div class="terms-container">
                <div class="terms-header">
                    <div class="terms-logo">
                        <i class="fas fa-graduation-cap"></i>
                        StudyRaid
                    </div>
                    <h1 class="terms-title">服务条款</h1>
                    <p class="terms-subtitle">最后更新日期：{{ lastUpdateDate }}</p>
                </div>

                <div class="terms-content">
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

// 服务条款的 Markdown 内容
const termsMarkdown = `# 1. 接受条款

通过访问或使用StudyRaid网站、应用程序和服务（统称为"服务"），您同意受这些服务条款（"条款"）的约束。如果您不同意这些条款的任何部分，请不要使用我们的服务。

StudyRaid保留随时修改这些条款的权利。我们将通过在我们的网站上发布修订后的条款来通知您任何更改。在修订后的条款发布后继续使用服务即表示您接受这些更改。

# 2. 账户注册

要使用某些服务功能，您可能需要注册一个账户。您同意：

- 提供真实、准确、最新和完整的注册信息
- 维护并及时更新您的注册信息，以保持其真实、准确、最新和完整
- 对您账户下发生的所有活动负责
- 立即通知StudyRaid任何未经授权使用您账户的情况
- 确保在每次会话结束时正确退出您的账户

StudyRaid保留自行决定拒绝服务、终止账户、删除或编辑内容或取消订单的权利。

# 3. 用户行为准则

在使用服务时，您同意不：

- 违反任何适用的国家或国际法律或法规
- 侵犯他人的知识产权、隐私权或其他权利
- 上传或传播任何恶意软件、病毒或其他有害代码
- 干扰或破坏服务的完整性或性能
- 尝试未经授权访问服务的任何部分或其他系统或网络
- 收集或存储其他用户的个人信息
- 冒充任何个人或实体，或虚假陈述您与任何个人或实体的关联
- 参与任何可能损害StudyRaid或其他用户的行为

<div class="highlight">
**重要提示：** 违反这些行为准则可能导致您的账户被暂停或终止，StudyRaid保留采取法律行动的权利。
</div>

# 4. 内容所有权

StudyRaid服务及其原始内容（不包括用户提供的内容）、功能和功能是StudyRaid及其许可方的专有财产。

服务受版权、商标和其他法律保护。您同意不复制、修改、创建衍生作品、公开展示、公开表演、转载或分发从服务获取的任何材料，除非明确授权。

您保留对您通过服务提交、发布或显示的任何内容的所有权。但是，通过提交内容到服务，您授予StudyRaid全球性、免版税、可再许可的非独占许可，以使用、复制、修改、改编、发布、翻译和分发此类内容。

# 5. 付款和订阅

某些服务功能可能需要付费订阅。通过订阅付费服务，您同意支付所有相关费用。

所有费用均以美元计算，除非另有说明。您负责支付所有适用的税费。

订阅将自动续订，除非您在续订日期前取消订阅。您可以在账户设置中随时取消订阅。

StudyRaid保留随时更改服务费用的权利。费用变更将在您的下一个订阅周期生效。

# 6. 退款政策

StudyRaid提供以下退款政策：

- 在购买后14天内，如果您对服务不满意，可以申请全额退款
- 超过14天后，将根据具体情况考虑部分退款
- 如果发现滥用退款政策，StudyRaid保留拒绝退款请求的权利

要申请退款，请通过support@studyraid.com联系我们的客户支持团队。

# 7. 免责声明

服务按"原样"和"可用"的基础提供，不附带任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性和不侵权的暗示保证。

StudyRaid不保证服务将 uninterrupted、及时、安全或无错误。

您从服务或通过服务获得的任何材料下载或获取的行为完全由您自行决定并承担风险，您将独自对因下载任何此类材料而导致的计算机系统损坏或数据丢失负责。

# 8. 责任限制

在任何情况下，StudyRaid及其董事、员工、合作伙伴、代理、供应商或附属机构均不对任何间接、偶然、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据损失、商誉损失或其他无形损失，无论是否已被告知此类损害的可能性。

StudyRaid对您的总责任，无论是基于合同、侵权或其他方面，均不超过您在引起索赔的交易发生前十二（12）个月内支付给StudyRaid的金额。

# 9. 终止

我们可能因任何原因终止或暂停您的账户和访问服务的权利，恕不另行通知或承担责任。

如果终止，您使用服务的权利将立即停止。如果您希望终止您的账户，您可以简单地停止使用服务或通过您的账户设置关闭账户。

所有条款中按其性质应在终止后存续的条款，包括但不限于所有权条款、免责声明、责任限制和一般条款，应在终止后继续有效。

# 10. 适用法律

这些条款应按照中华人民共和国法律解释和管辖，不考虑其法律冲突规定。

我们未能执行这些条款的任何权利或规定不构成对该权利或规定的放弃。

如果这些条款的任何条款被认定为无效或不可执行，则该条款应在最小必要范围内受到限制或排除，其余条款仍保持完全效力。

# 11. 联系我们

如果您对这些服务条款有任何疑问，请通过以下方式联系我们：

- 电子邮件：legal@studyraid.com
- 邮寄地址：北京市朝阳区某某路123号StudyRaid法律部

<div class="update-info">
**更新历史：**

**2023年10月15日：** 更新了退款政策条款，将退款期限从30天改为14天。

**2023年6月1日：** 首次发布服务条款。
</div>`

// 计算属性：渲染后的 Markdown
const renderedMarkdown = computed(() => {
    return marked(termsMarkdown, {
        breaks: true,
        gfm: true
    })
})

// 方法
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        alert('搜索功能将在完整网站中实现')
        searchQuery.value = ''
    }
}

// 生命周期
onMounted(() => {
    // 可以在这里添加组件挂载后的逻辑
})
</script>

<style scoped>
/* 服务条款内容样式 */
.terms-container {
    flex: 1;
    padding: 40px 0;
    max-width: 900px;
    margin: 0 auto;
}

.terms-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.terms-logo {
    font-size: 32px;
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.terms-logo i {
    margin-right: 12px;
    color: var(--accent-color);
}

.terms-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.terms-subtitle {
    color: var(--text-tertiary);
    font-size: 14px;
}

.terms-content {
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

.markdown-content :deep(.update-info) strong {
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

    .terms-container {
        padding: 24px 0;
    }

    .terms-content {
        padding: 24px;
    }
}
</style>