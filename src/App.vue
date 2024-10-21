<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

export default {
  name: 'App',
  components: {
    ElConfigProvider,
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    onMounted(() => {
      if (!store.state.isAuthenticated && router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    })

    return {
      zhCn,
    }
  },
}
</script>

<style>
@import 'element-plus/dist/index.css';

body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100vh;
}
</style>
