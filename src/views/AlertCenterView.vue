<template>
  <div class="alert-center">
    <h2 class="page-title">警报中心</h2>
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <h3>警报列表</h3>
          <el-form :inline="true" :model="filterForm" class="filter-form">
            <el-form-item label="设备">
              <el-select v-model="filterForm.device" placeholder="选择设备" clearable>
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="device in devices"
                  :key="device.id"
                  :label="device.name"
                  :value="device.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="[
                  new Date(2000, 1, 1, 0, 0, 0),
                  new Date(2000, 1, 1, 23, 59, 59)
                ]"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter" icon="Search">筛选</el-button>
              <el-button @click="resetFilter" icon="Refresh">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <el-table :data="alerts" style="width: 100%" v-loading="loading">
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="device.name" label="设备" width="150"></el-table-column>
        <el-table-column prop="message" label="警报信息"></el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'RESOLVED' ? 'success' : 'danger'">
              {{ scope.row.status === 'RESOLVED' ? '已解决' : '未解决' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalAlerts"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'AlertCenterView',
  components: {
    Search,
    Refresh
  },
  setup() {
    const filterForm = reactive({
      device: '',
      dateRange: []
    })

    const devices = ref([])
    const alerts = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalAlerts = ref(0)
    const loading = ref(false)

    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://47.116.66.208:8080/api/devices')
        devices.value = response.data.content
      } catch (error) {
        console.error('获取设备列表失败:', error)
        ElMessage.error('获取设备列表失败，请稍后重试')
      }
    }

    const fetchAlerts = async () => {
      loading.value = true
      let url = `http://47.116.66.208:8080/api/alerts?page=${currentPage.value - 1}&size=${pageSize.value}`

      if (filterForm.device && filterForm.dateRange && filterForm.dateRange.length === 2) {
        url = `http://47.116.66.208:8080/api/alerts/device/${filterForm.device}/timerange?startDate=${filterForm.dateRange[0]}&endDate=${filterForm.dateRange[1]}&page=${currentPage.value - 1}&size=${pageSize.value}`
      } else if (filterForm.device) {
        url = `http://47.116.66.208:8080/api/alerts/device/${filterForm.device}?page=${currentPage.value - 1}&size=${pageSize.value}`
      } else if (filterForm.dateRange && filterForm.dateRange.length === 2) {
        url = `http://47.116.66.208:8080/api/alerts/timerange?startDate=${filterForm.dateRange[0]}&endDate=${filterForm.dateRange[1]}&page=${currentPage.value - 1}&size=${pageSize.value}`
      }

      try {
        const response = await axios.get(url)
        alerts.value = response.data.content
        totalAlerts.value = response.data.totalElements
      } catch (error) {
        console.error('获取警报数据失败:', error)
        ElMessage.error('获取警报数据失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    const handleFilter = () => {
      currentPage.value = 1
      fetchAlerts()
    }

    const resetFilter = () => {
      filterForm.device = ''
      filterForm.dateRange = []
      currentPage.value = 1
      fetchAlerts()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchAlerts()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchAlerts()
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    onMounted(() => {
      fetchDevices()
      fetchAlerts()
    })

    return {
      filterForm,
      devices,
      alerts,
      currentPage,
      pageSize,
      totalAlerts,
      loading,
      handleFilter,
      resetFilter,
      handleSizeChange,
      handleCurrentChange,
      formatDate
    }
  }
}
</script>

<style scoped>
.alert-center {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

.main-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.el-form-item {
  margin-bottom: 0;
}

.el-select {
  width: 200px;
}

.el-date-picker {
  width: 400px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.el-table :deep(.el-table__header) {
  background-color: #f5f7fa;
}

.el-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

.el-tag {
  font-weight: bold;
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
  }

  .el-select,
  .el-date-picker {
    width: 100%;
  }
}
</style>