<template>
  <div class="data-analysis">
    <h2 class="page-title">数据分析</h2>
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59)
            ]"
            @change="handleDateRangeChange"
          ></el-date-picker>
          <el-select v-model="selectedDevice" placeholder="选择设备" @change="handleDeviceChange" :loading="loading">
            <el-option
              v-for="device in devices"
              :key="device.id"
              :label="device.name"
              :value="device.id"
            ></el-option>
          </el-select>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>温度趋势数据</h3>
                <el-tooltip content="显示选定时间范围内的温度变化趋势" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-table :data="temperatureTrendData" style="width: 100%" height="450" :stripe="true" border>
              <el-table-column
                prop="time"
                label="时间"
                class-name="column-time"
                align="center">
              </el-table-column>

              <el-table-column
                prop="temperature"
                label="温度 (°C)"
                class-name="column-temperature"
                align="center">
                <template #default="scope">
                  <span :style="{ color: getTemperatureColor(scope.row.temperature) }">
                    {{ scope.row.temperature }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalElements"
            ></el-pagination>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>温度分布</h3>
                <el-tooltip content="显示不同温度级别的分布情况" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div ref="temperatureDistributionChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import {ElMessage} from 'element-plus'
import {InfoFilled} from '@element-plus/icons-vue'

export default {
  name: 'DataAnalysisView',
  components: {
    InfoFilled
  },
  setup() {
    const dateRange = ref([])
    const selectedDevice = ref('')
    const devices = ref([])
    const loading = ref(false)
    const temperatureTrendData = ref([])
    const temperatureDistributionChart = ref(null)
    let chartInstance = null
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalElements = ref(0)

    const fetchDevices = async () => {
      loading.value = true
      try {
        const response = await axios.get('http://8.155.16.118:8080/api/devices')
        devices.value = response.data.content
        console.log('获取到的设备列表:', devices.value)
      } catch (error) {
        console.error('获取设备列表失败:', error)
        ElMessage.error('获取设备列表失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    const handleDateRangeChange = () => {
      if (selectedDevice.value) {
        fetchDeviceData()
      }
    }

    const handleDeviceChange = () => {
      if (dateRange.value && dateRange.value.length === 2) {
        fetchDeviceData()
      }
    }

    const fetchDeviceData = async () => {
      if (!selectedDevice.value || !dateRange.value || dateRange.value.length !== 2) {
        return
      }

      const startTime = dateRange.value[0].toISOString().slice(0, 19).replace('T', ' ')
      const endTime = dateRange.value[1].toISOString().slice(0, 19).replace('T', ' ')

      try {
        const response = await axios.get(`http://8.155.16.118:8080/api/devices/${selectedDevice.value}/data`, {
          params: {
            startTime: startTime,
            endTime: endTime,
            page: currentPage.value - 1,
            size: pageSize.value
          }
        })

        const data = response.data.content
        totalElements.value = response.data.totalElements
        const temperatureValues = data.map(item => parseFloat(item.value))
        const recordTimes = data.map(item => item.recordTime)
        updateTemperatureTrendData(recordTimes, temperatureValues)
        updateTemperatureDistributionChart(temperatureValues)
      } catch (error) {
        console.error('获取设备数据失败:', error)
        ElMessage.error('获取设备数据失败，请稍后重试')
      }
    }

    const updateTemperatureTrendData = (times, values) => {
      temperatureTrendData.value = times.map((time, index) => ({
        time: new Date(time).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        temperature: values[index].toFixed(1)
      }))
    }

    const updateTemperatureDistributionChart = (values) => {
      if (!temperatureDistributionChart.value) return

      if (chartInstance) {
        chartInstance.dispose()
      }

      chartInstance = echarts.init(temperatureDistributionChart.value)

      const categories = {
        '极低温 (< 25°C)': 0,
        '低温 (25-50°C)': 0,
        '中温 (50-75°C)': 0,
        '高温 (> 75°C)': 0
      }

      values.forEach(value => {
        if (value < 25) {
          categories['极低温 (< 25°C)']++
        } else if (value < 50) {
          categories['低温 (25-50°C)']++
        } else if (value < 75) {
          categories['中温 (50-75°C)']++
        } else {
          categories['高温 (> 75°C)']++
        }
      })

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: Object.keys(categories),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '温度分布',
            type: 'bar',
            data: Object.values(categories),
            itemStyle: {
              color: function(params) {
                const colors = ['#91CC75', '#FAC858', '#EE6666', '#73C0DE']
                return colors[params.dataIndex]
              }
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      chartInstance.setOption(option)
    }

    const getTemperatureColor = (temperature) => {
      const temp = parseFloat(temperature);
      if (temp < 25) return '#91CC75'; // 绿色，表示极低温
      if (temp < 50) return '#FAC858'; // 黄色，表示低温
      if (temp < 75) return '#EE6666'; // 橙色，表示中温
      return '#73C0DE'; // 蓝色，表示高温
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      fetchDeviceData()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      fetchDeviceData()
    }

    onMounted(() => {
      fetchDevices()
      if (dateRange.value && dateRange.value.length === 2 && selectedDevice.value) {
        fetchDeviceData()
      }
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
      }
    })

    watch([dateRange, selectedDevice], () => {
      if (dateRange.value && dateRange.value.length === 2 && selectedDevice.value) {
        currentPage.value = 1
        fetchDeviceData()
      }
    })

    return {
      dateRange,
      selectedDevice,
      devices,
      loading,
      temperatureTrendData,
      temperatureDistributionChart,
      handleDateRangeChange,
      handleDeviceChange,
      getTemperatureColor,
      currentPage,
      pageSize,
      totalElements,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.data-analysis {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
}

.main-card {
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.chart-card {
  height: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.chart {
  height: 400px;
  padding: 20px;
}

.el-date-picker {
  margin-right: 20px;
}

.el-select {
  width: 200px;
}

/* 新增的列宽样式 */
.column-time {
  width: 70%;
}

.column-temperature {
  width: 30%;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

@media (max-width: 768px) {
  .el-row {
    flex-direction: column;
  }

  .el-col {
    width: 100% !important;
    margin-bottom: 20px;
  }
}
</style>









