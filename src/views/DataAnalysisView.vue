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
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>温度趋势图</h3>
                <el-tooltip content="显示选定时间范围内的温度变化趋势" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div ref="temperatureTrendChart" class="chart"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
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
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="24">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>设备温度详情</h3>
                <el-tooltip content="显示选中设备的平均、最大和最小温度" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div ref="deviceComparisonChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

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
    const temperatureTrendChart = ref(null)
    const temperatureDistributionChart = ref(null)
    const deviceComparisonChart = ref(null)

    const fetchDevices = async () => {
      loading.value = true
      try {
        const response = await axios.get('http://47.116.66.208:8080/api/devices')
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
        const response = await axios.get(`http://47.116.66.208:8080/api/devices/${selectedDevice.value}/data`, {
          params: {
            startTime,
            endTime
          }
        })

        const data = response.data.content
        const temperatureValues = data.map(item => parseFloat(item.value))
        const recordTimes = data.map(item => item.recordTime)
        updateCharts(recordTimes, temperatureValues)
      } catch (error) {
        console.error('获取设备数据失败:', error)
        ElMessage.error('获取设备数据失败，请稍后重试')
      }
    }

    const updateCharts = (times, values) => {
      const avgTemperature = calculateAverage(values)
      const maxTemperature = Math.max(...values)
      const minTemperature = Math.min(...values)

      updateTemperatureTrendChart(times, values)
      updateTemperatureDistributionChart(values)
      updateDeviceComparisonChart(avgTemperature, maxTemperature, minTemperature)
    }

    const calculateAverage = (arr) => {
      return arr.reduce((a, b) => a + b, 0) / arr.length
    }

    const updateTemperatureTrendChart = (times, values) => {
      const chart = echarts.init(temperatureTrendChart.value)

      // 将时间和值组合成对象数组，并按时间排序
      let sortedData = times.map((time, index) => ({ time: new Date(time), value: values[index] }))
        .sort((a, b) => a.time - b.time)

      // 按天分组并随机选择一个数据点
      const groupedData = {}
      sortedData.forEach(item => {
        const day = item.time.toISOString().split('T')[0]
        if (!groupedData[day]) {
          groupedData[day] = []
        }
        groupedData[day].push(item)
      })

      const sampledData = Object.values(groupedData).map(group => {
        return group[Math.floor(Math.random() * group.length)]
      })

      // 确保数据按时间排序
      sampledData.sort((a, b) => a.time - b.time)

      const option = {
        title: {
          text: '温度趋势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time',
          min: dateRange.value[0],
          max: dateRange.value[1],
          axisLabel: {
            formatter: (value) => {
              return new Date(value).toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric'
              })
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '温度 (°C)'
        },
        series: [{
          data: sampledData.map(item => [item.time, item.value]),
          type: 'line',
          smooth: true
        }]
      }
      chart.setOption(option)
    }

    const updateTemperatureDistributionChart = (values) => {
      const chart = echarts.init(temperatureDistributionChart.value)
      const categories = {
        '高温': 0,
        '中温': 0,
        '低温': 0,
        '极低温': 0
      }

      values.forEach(value => {
        if (value > 100) {
          categories['高温']++
        } else if (value > 50) {
          categories['中温']++
        } else if (value > 20) {
          categories['低温']++
        } else {
          categories['极低温']++
        }
      })

      const option = {
        title: {
          text: '温度分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '温度分布',
            type: 'pie',
            radius: '50%',
            data: Object.entries(categories).map(([name, value]) => ({ name, value })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chart.setOption(option)
    }

    const updateDeviceComparisonChart = (avg, max, min) => {
      const chart = echarts.init(deviceComparisonChart.value)
      const option = {
        title: {
          text: '设备温度详情'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['选中设备']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '温度 (°C)'
          }
        ],
        series: [
          {
            name: '平均温度',
            type: 'bar',
            data: [avg]
          },
          {
            name: '最大温度',
            type: 'bar',
            data: [max]
          },
          {
            name: '最小温度',
            type: 'bar',
            data: [min]
          }
        ]
      }
      chart.setOption(option)
    }

    onMounted(() => {
      fetchDevices()
    })

    watch([dateRange, selectedDevice], () => {
      if (dateRange.value && dateRange.value.length === 2 && selectedDevice.value) {
        fetchDeviceData()
      }
    })

    return {
      dateRange,
      selectedDevice,
      devices,
      loading,
      temperatureTrendChart,
      temperatureDistributionChart,
      deviceComparisonChart,
      handleDateRangeChange,
      handleDeviceChange
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
