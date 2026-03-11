<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />项目任务统计
    </template>
    <template #extra>
      <span class="completion-badge">完成率 <strong style="color: #52C41A">{{ completionRate }}%</strong></span>
    </template>
    <div class="task-overview">
      <div v-for="item in overviewList" :key="item.key" class="task-stat">
        <div class="task-stat-icon" :style="{ background: item.bg }">
          <component :is="item.icon" :style="{ color: item.color, fontSize: '16px' }" />
        </div>
        <div class="task-stat-info">
          <span class="task-stat-num" :style="{ color: item.color }">{{ item.value }}</span>
          <span class="task-stat-label">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 190px; margin-top: 4px;" />
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useWorkbenchStore } from '@/stores/workbench'

use([BarChart, TooltipComponent, GridComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.taskStats)
const completionRate = computed(() => store.taskCompletionRate)
const ready = ref(false)
onMounted(() => { ready.value = true })

const overviewList = computed(() => [
  { key: 'completed', name: '已完成', value: stats.value.completed, color: '#52C41A', bg: 'rgba(82,196,26,0.1)', icon: CheckCircleOutlined },
  { key: 'inProgress', name: '进行中', value: stats.value.inProgress, color: '#1677FF', bg: 'rgba(22,119,255,0.1)', icon: SyncOutlined },
  { key: 'pending', name: '待开始', value: stats.value.pending, color: '#86909C', bg: 'rgba(134,144,156,0.1)', icon: ClockCircleOutlined },
  { key: 'overdue', name: '已逾期', value: stats.value.overdue, color: '#FF4D4F', bg: 'rgba(255,77,79,0.1)', icon: ExclamationCircleOutlined },
])

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
    formatter: (params: any[]) => {
      let str = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
      params.forEach((p: any) => {
        str += `<div style="display:flex;justify-content:space-between;gap:16px;">
          <span>${p.marker}${p.seriesName}</span>
          <span style="font-weight:600;">${p.value} 项</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 8, right: 16, bottom: 4, left: 90, containLabel: false },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11 },
  },
  yAxis: {
    type: 'category',
    data: stats.value.byProject.map(d => d.name),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#4E5969', fontSize: 11, width: 80, overflow: 'truncate' },
  },
  series: [
    {
      name: '已完成',
      type: 'bar',
      stack: 'task',
      data: stats.value.byProject.map(d => d.completed),
      barMaxWidth: 16,
      itemStyle: { color: '#52C41A', borderRadius: [0, 0, 0, 0] },
    },
    {
      name: '进行中',
      type: 'bar',
      stack: 'task',
      data: stats.value.byProject.map(d => d.inProgress),
      itemStyle: { color: '#1677FF' },
    },
    {
      name: '待开始',
      type: 'bar',
      stack: 'task',
      data: stats.value.byProject.map(d => d.pending),
      itemStyle: { color: '#C9CDD4', borderRadius: [0, 4, 4, 0] },
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.completion-badge {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.task-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.task-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #F8FAFE;
  border-radius: 8px;
  transition: all 0.2s;
}
.task-stat:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
.task-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.task-stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.task-stat-num {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}
.task-stat-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}
</style>
