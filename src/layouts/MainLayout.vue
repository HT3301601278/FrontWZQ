<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <SideMenu :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header height="60px">
        <div class="header-left">
          <el-button @click="toggleCollapse" icon="Fold" />
        </div>
        <TopNavBar />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, ref } from 'vue'
import TopNavBar from '@/components/TopNavBar.vue'
import SideMenu from '@/components/SideMenu.vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    TopNavBar,
    SideMenu
  },
  setup() {
    const isCollapse = ref(false)

    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    return {
      isCollapse,
      toggleCollapse
    }
  }
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #ffffff;
  transition: width 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.header-left {
  display: flex;
  align-items: center;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
