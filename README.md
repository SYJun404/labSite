# AI 实验室官网模板 (Vue 3 + Tailwind CSS)

面向 985 高校计算机学院 AI/深度学习实验室的官网静态模板，包含科研展示、团队介绍、论文成果、数据可视化、招生宣传等模块。所有内容均为静态示例数据，位于 `src/data/*.js`，可直接替换为真实数据或接入后端 API。

## 技术栈
- Vue 3 (Composition API, `<script setup>`)
- Vite 5
- Tailwind CSS 3
- Chart.js（论文产出 / 引用趋势 / 会议分布图表）
- 原生 Canvas（首页神经网络动画背景）

## 快速开始
```bash
npm install
npm run dev       # 本地开发 http://localhost:5173
npm run build     # 生产构建，输出到 dist/
npm run preview   # 预览生产构建
```

## 目录结构
```
src/
  components/      # 各页面区块组件
    Navbar.vue      # 顶部导航
    Hero.vue        # 首页 Hero + 动态背景
    Research.vue    # 研究方向
    Publications.vue# 论文成果（可按标签筛选）
    DataViz.vue     # 数据可视化（柱状图/折线图/环形图）
    Team.vue        # 导师 / 学生 / 校友
    Admissions.vue  # 招生方向与申请流程
    News.vue        # 实验室动态
    Footer.vue      # 页脚 / 联系方式
  data/             # 静态示例数据，替换为真实内容即可
    research.js
    team.js
    publications.js
    news.js
  style.css         # Tailwind 入口 + 自定义组件样式
  App.vue
  main.js
tailwind.config.js  # 设计 Token：配色 / 字体 / 渐变
```

## 二次开发建议
- 将 `src/data/` 中的静态数组替换为接口请求（如 `fetch`/`axios`）返回的数据结构一致即可。
- 图表基于 Chart.js，可在 `DataViz.vue` 中扩展更多图表类型。
- 设计 Token（配色 `ink` / `mist` / `signal`，字体 `display`/`body`/`mono`）集中在 `tailwind.config.js`，全局风格调整只需改这一处。
- 若需路由多页面（如论文详情页、成员主页），可引入 `vue-router` 进行扩展。

## 字体
默认通过 Google Fonts CDN 引入 Space Grotesk / Inter / JetBrains Mono，如需离线部署请自行下载字体文件并修改 `index.html`。

## 主题切换（深色 / 浅色）
- 导航栏右上角（移动端为菜单内）提供主题切换按钮，点击可在深色 / 浅色主题间自由切换。
- 主题状态会保存到浏览器 `localStorage`（键名 `ipll-theme`），刷新页面后保持上次选择；首次访问时会读取系统的浅色/深色偏好作为默认值。
- 实现方式：`src/composables/useTheme.js` 维护一个全局共享的响应式 `theme` 状态，并切换 `<html>` 根节点上的 `light` class；配色通过 `src/style.css` 中 `:root` / `:root.light` 两套 CSS 变量（`--c-bg`、`--c-fg`、`--c-accent-*` 等）驱动，`tailwind.config.js` 中的语义化颜色（`bg`、`surface`、`fg`、`accent.blue` 等）均引用这些变量，因此绝大部分组件无需关心主题逻辑。
- 首页 Hero 的 Canvas 动画与 `DataViz.vue` 中的 Chart.js 图表会在切换主题时自动重新读取配色并重绘。
