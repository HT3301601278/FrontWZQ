<template>
  <div class="top-nav-bar">
    <div class="logo">反应器温度在线监测系统</div>
    <el-menu
      mode="horizontal"
      background-color="#f0f2f5"
      text-color="#303133"
      active-text-color="#409EFF"
      :router="true"
    >
      <el-menu-item index="/">
        <el-icon><Odometer /></el-icon>
        仪表盘
      </el-menu-item>
      <el-menu-item index="/devices">
        <el-icon><Monitor /></el-icon>
        设备管理
      </el-menu-item>
      <el-menu-item index="/analysis">
        <el-icon><DataLine /></el-icon>
        数据分析
      </el-menu-item>
      <el-menu-item index="/alerts">
        <el-icon><Bell /></el-icon>
        警报中心
      </el-menu-item>
    </el-menu>
    <div class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="32" :src="avatarUrl"></el-avatar>
          {{ username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, Odometer, Monitor, DataLine, Bell } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'TopNavBar',
  components: {
    ArrowDown,
    Odometer,
    Monitor,
    DataLine,
    Bell
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const username = computed(() => store.state.user?.username || '未登录')
    const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

    const goToProfile = () => {
      router.push('/profile')
    }

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    return {
      username,
      avatarUrl,
      goToProfile,
      logout
    }
  }
})
</script>

<style scoped>
.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #f0f2f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-right: 20px;
}

.el-menu {
  flex-grow: 1;
  border-bottom: none;
  background-color: transparent !important;
}

.el-menu-item {
  font-size: 14px;
}

.user-info {
  margin-left: 20px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #303133;
  cursor: pointer;
}

.el-avatar {
  margin-right: 8px;
}

.el-icon {
  margin-left: 4px;
}
</style>
