<template>
  <div class="dashboard">
    <h2 class="dashboard-title">反应器温度监测仪表盘</h2>
    
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in cards" :key="index">
        <el-card class="dashboard-card" :body-style="{ padding: '0px' }">
          <div class="card-content" :style="{ backgroundColor: card.color }">
            <el-icon :size="40" color="#ffffff">
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

    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>实时温度曲线图</span>
              <el-select v-model="selectedReactor" placeholder="选择反应器" size="small">
                <el-option v-for="reactor in reactors" :key="reactor.id" :label="reactor.name" :value="reactor.id"></el-option>
              </el-select>
            </div>
          </template>
          <div ref="temperatureChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>反应器状态分布</span>
            </div>
          </template>
          <div ref="statusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="alert-row">
      <el-col :span="24">
        <el-card class="alert-card">
          <template #header>
            <div class="card-header">
              <span>最近警报</span>
              <el-button type="text" @click="viewAllAlerts">查看全部</el-button>
            </div>
          </template>
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
      { title: '总反应器数量', value: 42, icon: 'Monitor', color: '#409EFF' },
      { title: '在线反应器数量', value: 38, icon: 'Sunny', color: '#67C23A' },
      { title: '平均温度', value: '75.6 °C', icon: 'DataLine', color: '#E6A23C' },
      { title: '异常反应器数量', value: 2, icon: 'Warning', color: '#F56C6C' },
    ])

    const reactors = [
      { id: 1, name: '反应器 A' },
      { id: 2, name: '反应器 B' },
      { id: 3, name: '反应器 C' },
      { id: 4, name: '反应器 D' },
    ]

    const recentAlerts = ref([
      { time: '2023-06-01 10:30', reactor: '反应器A', type: '温度过高', status: '未解决' },
      { time: '2023-06-01 09:15', reactor: '反应器B', type: '离线', status: '已解决' },
      { time: '2023-05-31 23:45', reactor: '反应器C', type: '温度过低', status: '未解决' },
      { time: '2023-05-31 20:10', reactor: '反应器D', type: '温度异常', status: '已解决' },
    ])

    const initTemperatureChart = () => {
      const chart = echarts.init(temperatureChart.value)
      const option = {
        title: {
          text: '实时温度'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
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
        title: {
          text: '反应器状态分布',
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
            name: '反应器状态',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 38, name: '正常运行' },
              { value: 2, name: '异常' },
              { value: 1, name: '维护中' },
              { value: 1, name: '离线' }
            ],
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
}

.dashboard-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.dashboard-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.card-content {
  display: flex;
  align-items: center;
  padding: 20px;
  color: #ffffff;
}

.card-info {
  margin-left: 20px;
}

.card-title {
  font-size: 14px;
  opacity: 0.8;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 5px;
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-row {
  margin-top: 20px;
}

.alert-card {
  height: 100%;
}

.el-table {
  margin-top: 10px;
}
</style>
