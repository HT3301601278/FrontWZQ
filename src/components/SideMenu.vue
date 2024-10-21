<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    background-color="#ffffff"
    text-color="#303133"
    active-text-color="#409EFF"
    router
  >
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <span v-if="!isCollapse" class="title">反应器温度<br>在线监测系统</span>
    </div>
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
import {defineComponent, ref} from 'vue'
import {Bell, DataLine, Monitor, Odometer, User} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SideMenu',
  components: {
    Odometer,
    Monitor,
    DataLine,
    Bell,
    User
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const activeIndex = ref('1')

    return {
      activeIndex
    }
  }
})
</script>

<style scoped>
.el-menu {
  height: 100%;
  border-right: none;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
  height: auto;
  min-height: 80px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
