<template>
    <el-container class="layout-container">
      <el-header height="60px">
        <TopNavBar />
      </el-header>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import TopNavBar from '@/components/TopNavBar.vue'
  
  export default defineComponent({
    name: 'MainLayout',
    components: {
      TopNavBar
    }
  })
  </script>
  
  <style scoped>
  .layout-container {
    height: 100vh;
  }
  
  .el-header {
    padding: 0;
    background-color: #f0f2f5;
    color: #303133;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
  }
  
  .el-main {
    background-color: #ffffff;
    color: #333;
    padding: 20px;
  }
  </style>