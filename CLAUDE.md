# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个**设计资产画廊项目**(Variant Gallery),用于展示和管理 HTML 设计文件原型。项目采用现代化的技术栈,支持多设备视口预览和搜索功能。

## 技术栈

- **框架**: Next.js 16.1.6 (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS v4 (使用 @theme 内联配置)
- **UI 组件**: shadcn/ui (new-york 样式)
- **图标**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **代码质量**: ESLint + Prettier

## 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器 (http://localhost:3000)

# 构建
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # 运行 ESLint 检查
npm run format           # 使用 Prettier 格式化代码
```

## 项目架构

### 目录结构

```
src/
├── app/                      # Next.js App Router
│   ├── api/assets/          # API 路由 - 读取 public/assets/ 中的 HTML 文件
│   ├── globals.css          # 全局样式 (Tailwind CSS v4 + 主题变量)
│   ├── layout.tsx           # 根布局 (字体配置)
│   └── page.tsx             # 主页面 (文件列表、搜索、视口控制)
├── components/
│   └── AssetCard.tsx        # 设计文件卡片组件 (iframe 预览)
└── lib/
    └── utils.ts             # 样式工具函数 (cn)
```

### 核心架构模式

#### 1. 客户端状态管理

主页面 (`app/page.tsx`) 使用 React Hooks 管理全局状态:

- `files`: 从 API 获取的文件列表
- `globalViewport`: 全局视口设置 (mobile/tablet/desktop/full)
- `searchQuery`: 搜索过滤条件

#### 2. 响应式预览系统

AssetCard 组件实现了一个复杂的缩放系统:

- **固定卡片尺寸**: 400×300px
- **视口尺寸**: mobile (375×667), tablet (768×1024), desktop (1440×900), full (400×300)
- **缩放计算**: 使用 `transform: scale()` 保持比例
- **iframe 嵌套**: 使用 sandbox 属性限制权限 (`allow-scripts allow-same-origin`)

#### 3. API 路由设计

`app/api/assets/route.ts` 提供文件列表:

- 读取 `public/assets/` 目录
- 过滤 `.html` 文件
- 返回 JSON 格式的文件列表

#### 4. 样式系统

- **Tailwind CSS v4**: 使用 `@theme inline` 配置
- **OKLCH 色彩空间**: 所有颜色使用 oklch() 格式
- **CSS Variables**: 支持亮色/暗色主题
- **响应式布局**: 使用 Grid 布局 (1/2/3 列自适应)

## 关键设计决策

### 视口缩放策略

AssetCard 使用 CSS transform scale 而非 width/height,原因:

1. 保持 iframe 内部布局完整性
2. 避免内容重排和滚动问题
3. 提供更准确的预览效果

### 文件管理

- 设计文件存储在 `public/assets/` 目录
- API 动态读取文件系统,无需手动维护列表
- 支持任意数量的 HTML 文件

### 安全性

- iframe 使用 `sandbox` 属性限制脚本执行
- 仅允许 `allow-scripts` 和 `allow-same-origin`

## 开发注意事项

### 添加新的设计文件

直接将 HTML 文件放入 `public/assets/` 目录即可,无需修改代码。API 会自动读取新文件。

### 修改视口尺寸

编辑 `src/components/AssetCard.tsx` 中的 `viewportSizes` 对象:

```typescript
const viewportSizes = {
  mobile: { width: 375, height: 667, label: '手机' },
  tablet: { width: 768, height: 1024, label: '平板' },
  desktop: { width: 1440, height: 900, label: '桌面' },
  full: { width: CARD_WIDTH, height: CARD_HEIGHT, label: '全屏' },
}
```

### Tailwind CSS v4 配置

样式配置在 `src/app/globals.css` 中:

- 使用 `@theme inline` 定义主题变量
- 使用 `@custom-variant` 定义变体
- 颜色使用 OKLCH 格式

### 组件开发

- 使用 `'use client'` 标记客户端组件
- 使用 TypeScript 接口定义 Props
- 使用 `class-variance-authority` 管理样式变体
- 使用 `cn()` 工具函数合并类名

## 浏览器兼容性

项目使用现代 Web 标准:

- OKLCH 色彩空间 (需要现代浏览器)
- CSS Grid 和 Flexbox
- CSS Transform 和 Custom Properties

## 性能考虑

- 组件使用客户端渲染,支持动态搜索和视口切换
- iframe 按需加载,仅在卡片渲染时创建
- 使用 React 19 的最新特性
