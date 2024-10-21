<template>
  <div class="profile">
    <h2>个人中心</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="user-info-card">
          <template #header>
            <div class="card-header">
              <span>用户信息</span>
            </div>
          </template>
          <div class="user-avatar">
            <el-avatar :size="100" :src="userAvatar"></el-avatar>
          </div>
          <div class="user-details">
            <h3>{{ username }}</h3>
            <p>用户ID: {{ userId }}</p>
            <p>上次登录: {{ lastLogin }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="password-card">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
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
              <el-button type="primary" @click="changePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useStore } from 'vuex'

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
              `http://47.116.66.208:8080/api/users/${store.state.user.id}/password`,
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
.profile {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info-card, .password-card {
  height: 100%;
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.user-details {
  text-align: center;
}

.user-details h3 {
  margin-bottom: 10px;
}

.user-details p {
  margin: 5px 0;
  color: #606266;
}

.el-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>