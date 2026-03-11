<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />项目计划完成率
    </template>
    <template #extra>
      <div class="rate-badge" :class="stats.currentRate >= stats.baseline ? 'good' : 'warn'">
        本月 {{ stats.currentRate }}%
        <span class="diff">
          <CaretUpOutlined v-if="stats.currentRate >= stats.baseline" />
          <CaretDownOutlined v-else />
          {{ Math.abs(stats.currentRate - stats.baseline).toFixed(1) }}%
        </span>
      </div>
    </template>
    <div class="plan-summary">
      <div class="plan-stat">
        <span class="plan-stat-value" style="color: #1677FF">{{ stats.currentRate }}%</span>
        <span class="plan-stat-label">实际完成率</span>
      </div>
      <div class="plan-stat-divider" />
      <div class="plan-stat">
        <span class="plan-stat-value" style="color: #86909C">{{ stats.baseline }}%</span>
        <span class="plan-stat-label">计划基准</span>
      </div>
      <div class="plan-stat-divider" />
      <div class="plan-stat">
        <span class="plan-stat-value" :style="{ color: stats.currentRate >= stats.baseline ? '#52C41A' : '#FF4D4F' }">
          {{ stats.currentRate >= stats.baseline ? '+' : '' }}{{ (stats.currentRate - stats.baseline).toFixed(1) }}%
        </span>
        <span class="plan-stat-label">偏差值</span>
      </div>
    </div>
    <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 190px;" />
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { useWorkbenchStore } from '@/stores/workbench'

use([LineChart, TooltipComponent, GridComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.planStats)
const ready = ref(false)
onMounted(() => { ready.value = true })

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#e8ecf0',
    textStyle: { color: '#1D2129', fontSize: 12 },
    formatter: (params: any[]) => {
      let str = `<div style="font-weight:600;margin-bottom:4px;">${params[0].axisValue}</div>`
      params.forEach((p: any) => {
        str += `<div style="display:flex;justify-content:space-between;gap:16px;">
          <span>${p.marker}${p.seriesName}</span>
          <span style="font-weight:600;">${p.value}%</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 8, right: 10, bottom: 24, left: 40 },
  xAxis: {
    type: 'category',
    data: stats.value.monthlyRate.map(d => d.month),
    axisLine: { lineStyle: { color: '#E8ECF0' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909C', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    min: 50,
    max: 100,
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11, formatter: '{value}%' },
  },
  series: [
    {
      name: '计划基准',
      type: 'line',
      data: stats.value.monthlyRate.map(d => d.planned),
      smooth: true,
      lineStyle: { color: '#C9CDD4', width: 2, type: 'dashed' },
      itemStyle: { color: '#C9CDD4' },
      symbol: 'circle',
      symbolSize: 5,
    },
    {
      name: '实际完成率',
      type: 'line',
      data: stats.value.monthlyRate.map(d => d.actual),
      smooth: true,
      lineStyle: { color: '#1677FF', width: 3 },
      itemStyle: { color: '#1677FF', borderWidth: 3, borderColor: '#fff', shadowBlur: 6, shadowColor: 'rgba(22,119,255,0.4)' },
      symbol: 'circle',
      symbolSize: 7,
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(22,119,255,0.25)' }, { offset: 1, color: 'rgba(22,119,255,0.02)' }] },
      },
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.rate-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}
.rate-badge.good { background: rgba(82, 196, 26, 0.1); color: #52C41A; }
.rate-badge.warn { background: rgba(255, 77, 79, 0.1); color: #FF4D4F; }
.diff { font-size: 12px; display: flex; align-items: center; gap: 2px; }
.plan-summary {
  display: flex;
  align-items: center;
  padding: 10px 0 12px;
}
.plan-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.plan-stat-value {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}
.plan-stat-label {
  font-size: 12px;
  color: var(--color-text-tertiary);
}
.plan-stat-divider {
  width: 1px;
  height: 36px;
  background: #F0F2F5;
}
</style>
