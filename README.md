# 反应器温度在线监测系统

## 项目简介

这是一个基于Vue 3和Element Plus的反应器温度在线监测系统前端项目。该系统旨在实时监控和管理多个反应器的温度数据,提供数据分析、设备管理和警报功能。

## 技术栈

- Vue 3
- Vuex
- Vue Router
- Element Plus
- Axios
- ECharts

## 项目结构

```
src/
|-- assets/
|-- components/
|   |-- HelloWorld.vue
|   |-- SideMenu.vue
|   |-- TopNavBar.vue
|-- layouts/
|   |-- MainLayout.vue
|-- views/
|   |-- AlertCenterView.vue
|   |-- DashboardView.vue
|   |-- DataAnalysisView.vue
|   |-- DeviceManagementView.vue
|   |-- HomeView.vue
|   |-- LoginView.vue
|   |-- ProfileView.vue
|-- router/
|   |-- index.js
|-- store/
|   |-- index.js
|-- App.vue
|-- main.js
```

## 主要功能模块

1. 登录模块 (LoginView.vue)
2. 仪表盘 (DashboardView.vue)
3. 设备管理 (DeviceManagementView.vue)
4. 数据分析 (DataAnalysisView.vue)
5. 警报中心 (AlertCenterView.vue)
6. 个人中心 (ProfileView.vue)

## 组件说明

### 1. SideMenu.vue

侧边菜单组件,包含系统的主要导航链接。

主要功能:
- 显示系统logo和标题
- 提供系统主要功能的导航链接
- 支持菜单折叠功能

### 2. TopNavBar.vue

顶部导航栏组件,显示用户信息和提供快捷操作。

主要功能:
- 显示当前登录用户的头像和用户名
- 提供快捷访问个人中心的入口
- 提供退出登录功能

### 3. MainLayout.vue

主布局组件,整合了侧边菜单和顶部导航栏。

主要功能:
- 组织页面整体布局
- 集成SideMenu和TopNavBar组件
- 提供路由视图容器

## 视图说明

### 1. LoginView.vue

登录页面,提供用户登录和注册功能。

主要功能:
- 用户登录表单
- 用户注册表单
- 表单验证
- 登录状态管理

### 2. DashboardView.vue

系统仪表盘,展示系统整体状况和关键数据。

主要功能:
- 显示关键数据卡片(总反应器数量、在线反应器数量等)
- 展示实时温度数据图表
- 展示反应器状态分布图表
- 显示最近警报列表

### 3. DeviceManagementView.vue

设备管理页面,用于管理和监控反应器设备。

主要功能:
- 设备列表展示
- 设备搜索功能
- 添加新设备
- 设备详情查看和编辑
- 设备开关控制
- 设备温度阈值设置

### 4. DataAnalysisView.vue

数据分析页面,提供温度数据的详细分析和可视化。

主要功能:
- 日期范围选择
- 设备选择
- 温度趋势图表
- 温度分布图表
- 数据统计信息

### 5. AlertCenterView.vue

警报中心页面,展示和管理系统警报。

主要功能:
- 警报列表展示
- 警报筛选(按设备、时间范围)
- 警报状态管理

### 6. ProfileView.vue

个人中心页面,展示和管理用户个人信息。

主要功能:
- 显示用户基本信息
- 修改密码功能

## 路由配置

路由配置文件位于 `src/router/index.js`。主要路由包括:

- /login: 登录页面
- /: 仪表盘(首页)
- /devices: 设备管理
- /analysis: 数据分析
- /alerts: 警报中心
- /profile: 个人中心

## 状态管理

Vuex用于管理全局状态,主要包括:

- 用户认证状态
- 用户信息

## API 集成

项目使用Axios进行API调用。主要的API端点包括:

- 用户认证: /api/users/login, /api/users/register
- 设备管理: /api/devices
- 警报管理: /api/alerts

## 图表集成

项目使用ECharts库来创建各种数据可视化图表,主要在DashboardView和DataAnalysisView中使用。

## 样式和主题

项目使用Element Plus的默认主题,并在此基础上进行了一些自定义样式调整。主要的自定义样式可以在各个组件的`<style>`部分找到。

## 开始使用

1. 克隆项目仓库
2. 安装依赖: `npm install`
3. 运行开发服务器: `npm run serve`
4. 构建生产版本: `npm run build`

## 学习建议

1. 从`App.vue`和`main.js`开始,了解项目的整体结构和配置。
2. 研究`MainLayout.vue`以理解整体页面布局。
3. 逐个查看`views`文件夹中的各个视图组件,了解每个主要功能模块的实现。
4. 查看`components`文件夹中的可复用组件。
5. 研究`router/index.js`以了解路由配置。
6. 查看各组件中的API调用,了解前后端交互。
7. 关注ECharts的使用,特别是在DashboardView和DataAnalysisView中。