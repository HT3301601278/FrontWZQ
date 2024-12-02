<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" :md="6" :lg="5" :xl="4">
        <el-card class="user-card" shadow="hover">
          <div class="user-avatar">
            <el-avatar :size="120" :src="userAvatar"></el-avatar>
          </div>
          <h2 class="username">{{ username }}</h2>
          <p class="user-id">用户ID: {{ userId }}</p>
          <p class="last-login">上次登录: {{ lastLogin }}</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="16" :md="18" :lg="19" :xl="20">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>账户信息</h3>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ username }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ userId }}</el-descriptions-item>
            <el-descriptions-item label="上次登录">{{ lastLogin }}</el-descriptions-item>
            <el-descriptions-item label="账户状态">
              <el-tag type="success">正常</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card class="password-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>修改密码</h3>
            </div>
          </template>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword" :loading="loading">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {computed, reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import axios from 'axios'
import {useStore} from 'vuex'

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore()
    const passwordFormRef = ref(null)

    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const changePassword = () => {
      passwordFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const response = await axios.put(
              `http://8.155.16.118:8080/api/users/${store.state.user.id}/password`,
              null,
              {
                params: {
                  oldPassword: passwordForm.oldPassword,
                  newPassword: passwordForm.newPassword
                }
              }
            )
            if (response.data && response.data.id) {
              ElMessage.success('密码已成功修改')
              passwordForm.oldPassword = ''
              passwordForm.newPassword = ''
              passwordForm.confirmPassword = ''
            } else {
              ElMessage.error('密码修改失败，请稍后重试')
            }
          } catch (error) {
            console.error('修改密码错误:', error)
            if (error.response && error.response.status === 400) {
              ElMessage.error('旧密码不正确')
            } else {
              ElMessage.error('密码修改失败，请稍后重试')
            }
          }
        } else {
          return false
        }
      })
    }

    const username = computed(() => store.state.user?.username || '未登录')
    const userId = computed(() => store.state.user?.id || '未知')
    const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
    const lastLogin = ref('2023-06-01 10:30:00') // 这里应该从后端获取实际的最后登录时间

    return {
      passwordForm,
      passwordRules,
      passwordFormRef,
      changePassword,
      username,
      userId,
      userAvatar,
      lastLogin
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.user-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.user-avatar {
  margin-bottom: 20px;
}

.username {
  font-size: 24px;
  margin: 10px 0;
}

.user-id, .last-login {
  font-size: 14px;
  opacity: 0.8;
}

.info-card, .password-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
}

.el-descriptions {
  margin-bottom: 20px;
}

.el-form {
  max-width: 500px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .user-card {
    margin-bottom: 20px;
  }
}
</style>
