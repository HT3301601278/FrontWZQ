<template>
  <div class="top-nav-bar">
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
import { ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'TopNavBar',
  components: {
    ArrowDown
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
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
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
