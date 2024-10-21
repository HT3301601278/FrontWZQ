<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="system-title">反应器温度在线监测系统</h2>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="register-link">
        <el-button type="text" @click="showRegisterDialog">注册新账号</el-button>
      </div>
    </el-card>

    <el-dialog v-model="registerDialogVisible" title="注册新账号" width="400px" custom-class="register-dialog">
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-position="top">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="registerForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="registerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRegister" :loading="registerLoading">注册</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  name: 'LoginView',
  components: { User, Lock },
  setup() {
    const router = useRouter()
    const loginFormRef = ref(null)
    const registerFormRef = ref(null)
    const store = useStore()

    const loginForm = reactive({
      username: '',
      password: ''
    })

    const registerForm = reactive({
      username: '',
      password: '',
      confirmPassword: ''
    })

    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }

    const registerRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度应在 3 到 20 个字符之间', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== registerForm.password) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const loading = ref(false)
    const registerLoading = ref(false)
    const registerDialogVisible = ref(false)

    const handleLogin = () => {
      loginFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          try {
            const response = await axios.post('http://47.116.66.208:8080/api/users/login', loginForm)
            if (response.data && response.data.id) {
              store.commit('setUser', response.data)
              store.commit('setAuthenticated', true)
              ElMessage.success('登录成功')
              console.log('准备跳转到首页')
              await router.push('/')
              console.log('跳转完成')
            } else {
              ElMessage.error('登录失败，请检查用户名和密码')
            }
          } catch (error) {
            console.error('登录错误:', error)
            ElMessage.error('登录失败，请稍后重试')
          } finally {
            loading.value = false
          }
        }
      })
    }

    const showRegisterDialog = () => {
      registerDialogVisible.value = true
    }

    const handleRegister = () => {
      registerFormRef.value.validate(async (valid) => {
        if (valid) {
          registerLoading.value = true
          try {
            const response = await axios.post('http://47.116.66.208:8080/api/users/register', {
              username: registerForm.username,
              password: registerForm.password
            })
            if (response.data && response.data.id) {
              ElMessage.success('注册成功')
              registerDialogVisible.value = false
              // 清空注册表单
              registerForm.username = ''
              registerForm.password = ''
              registerForm.confirmPassword = ''
            } else {
              ElMessage.error('注册失败，请稍后重试')
            }
          } catch (error) {
            console.error('注册错误:', error)
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  ElMessage.error('注册失败，用户名已存在')
                  break
                case 422:
                  ElMessage.error('注册失败，请检查输入的信息是否符合要求')
                  break
                default:
                  ElMessage.error('注册失败，请稍后重试')
              }
            } else if (error.request) {
              ElMessage.error('网络错误，请检查您的网络连接')
            } else {
              ElMessage.error('注册失败，请稍后重试')
            }
          } finally {
            registerLoading.value = false
          }
        }
      })
    }

    return {
      loginForm,
      registerForm,
      rules,
      registerRules,
      loading,
      registerLoading,
      registerDialogVisible,
      loginFormRef,
      registerFormRef,
      handleLogin,
      showRegisterDialog,
      handleRegister
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 350px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.system-title {
  text-align: center;
  margin: 0;
  color: #333;
}

.login-button {
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.register-dialog .el-dialog__header {
  background-color: #409EFF;
  padding: 20px;
}

.register-dialog .el-dialog__title {
  color: #fff;
  font-size: 20px;
}

.register-dialog .el-dialog__body {
  padding: 30px 20px;
}

.register-dialog .el-form-item__label {
  font-weight: bold;
}

.register-dialog .el-input__inner {
  border-radius: 4px;
}

.register-dialog .dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.register-dialog .dialog-footer .el-button {
  min-width: 100px;
}
</style>
