<template>
  <div class="dashboard">
    <h1 class="dashboard-title">反应器温度监测仪表盘</h1>

    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(card, index) in cards" :key="index">
        <el-card class="dashboard-card" :body-style="{ padding: '0px' }">
          <div class="card-content" :class="card.class">
            <el-icon :size="40">
              <component :is="card.icon" />
            </el-icon>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-row">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card class="chart-card">
          <div class="chart-header">
            <h3>实时温度数据</h3>
          </div>
          <div ref="temperatureChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="chart-card">
          <div class="chart-header">
            <h3>反应器状态分布</h3>
          </div>
          <div ref="statusChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="24">
        <el-card class="alert-card">
          <div class="alert-header">
            <h3>最近警报</h3>
            <el-button type="text" @click="viewAllAlerts">查看全部</el-button>
          </div>
          <el-table :data="recentAlerts" style="width: 100%">
            <el-table-column prop="time" label="时间" width="180"></el-table-column>
            <el-table-column prop="reactor" label="反应器"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已解决' ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { Monitor, Sunny, Warning, DataLine } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

export default {
  name: 'DashboardView',
  components: { Monitor, Sunny, Warning, DataLine },
  setup() {
    const router = useRouter()
    const temperatureChart = ref(null)
    const statusChart = ref(null)
    const selectedReactor = ref('')

    const cards = reactive([
      { title: '总反应器数量', value: 42, icon: 'Monitor', class: 'blue-card' },
      { title: '在线反应器数量', value: 38, icon: 'Sunny', class: 'green-card' },
      { title: '平均温度', value: '75.6 °C', icon: 'DataLine', class: 'orange-card' },
      { title: '异常反应器数量', value: 2, icon: 'Warning', class: 'red-card' },
    ])

    const reactors = [
      { id: 1, name: '反应器 A' },
      { id: 2, name: '反应器 B' },
      { id: 3, name: '反应器 C' },
      { id: 4, name: '反应器 D' },
    ]

    const recentAlerts = ref([
      { time: '2024-03-01 02:35', reactor: '反应器A', type: '温度过高', status: '未解决' },
      { time: '2024-04-01 08:40', reactor: '反应器B', type: '离线', status: '已解决' },
      { time: '2024-05-31 10:25', reactor: '反应器C', type: '温度过低', status: '未解决' },
      { time: '2024-06-31 03:12', reactor: '反应器D', type: '温度过高', status: '已解决' },
    ])

    const initTemperatureChart = () => {
      const chart = echarts.init(temperatureChart.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
        },
        yAxis: {
          type: 'value',
          name: '温度 (°C)'
        },
        series: [{
          data: [32, 28, 25, 50, 80, 75, 60, 40],
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          lineStyle: {
            width: 3
          },
          itemStyle: {
            borderWidth: 2
          }
        }]
      }
      chart.setOption(option)
    }

    const initStatusChart = () => {
      const chart = echarts.init(statusChart.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['正常', '警告', '异常', '离线']
        },
        yAxis: {
          type: 'value',
          name: '反应器数量'
        },
        series: [{
          data: [35, 3, 2, 2],
          type: 'bar',
          itemStyle: {
            color: function(params) {
              const colors = ['#67C23A', '#E6A23C', '#F56C6C', '#909399'];
              return colors[params.dataIndex];
            }
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      }
      chart.setOption(option)
    }

    const viewAllAlerts = () => {
      router.push('/alerts')
    }

    onMounted(() => {
      initTemperatureChart()
      initStatusChart()
    })

    return {
      cards,
      recentAlerts,
      temperatureChart,
      statusChart,
      selectedReactor,
      reactors,
      viewAllAlerts
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.dashboard-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #303133;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.dashboard-row {
  margin-bottom: 20px;
}

.dashboard-card {
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  height: 100%;
  color: #ffffff;
}

.blue-card { background: linear-gradient(135deg, #3498db, #2980b9); }
.green-card { background: linear-gradient(135deg, #2ecc71, #27ae60); }
.orange-card { background: linear-gradient(135deg, #e67e22, #d35400); }
.red-card { background: linear-gradient(135deg, #e74c3c, #c0392b); }

.card-info {
  text-align: right;
}

.card-title {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
}

.chart-card, .alert-card {
  height: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.chart-header, .alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.chart-header h3, .alert-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.chart {
  height: 320px;
  padding: 20px;
}

.el-table {
  margin-top: 10px;
}

.alert-card {
  max-height: 500px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-card {
    height: 100px;
  }

  .chart-card, .alert-card {
    height: auto;
  }

  .chart {
    height: 250px;
  }
}
</style>
