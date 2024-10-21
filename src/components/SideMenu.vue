<template>
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <el-menu-item index="/">
        <el-icon><Odometer /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/devices">
        <el-icon><Monitor /></el-icon>
        <span>设备管理</span>
      </el-menu-item>
      <el-menu-item index="/analysis">
        <el-icon><DataLine /></el-icon>
        <span>数据分析</span>
      </el-menu-item>
      <el-menu-item index="/alerts">
        <el-icon><Bell /></el-icon>
        <span>警报中心</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><User /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { Odometer, Monitor, DataLine, Bell, User } from '@element-plus/icons-vue'
  
  export default defineComponent({
    name: 'SideMenu',
    components: {
      Odometer,
      Monitor,
      DataLine,
      Bell,
      User
    }
  })
  </script>
  
  <style scoped>
  .el-menu {
    height: 100%;
    border-right: none;
  }
  </style>