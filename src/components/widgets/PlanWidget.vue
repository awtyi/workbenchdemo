<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />年度计划完成率
    </template>
    <div class="plan-summary">
      <div class="plan-stat">
        <span class="plan-stat-value" style="color: #1677FF">{{ actualCompleted }}</span>
        <span class="plan-stat-label">实际累积完成数量</span>
      </div>
      <div class="plan-stat-divider" />
      <div class="plan-stat">
        <span class="plan-stat-value" style="color: #86909C">{{ plannedCompleted }}</span>
        <span class="plan-stat-label">计划完成数量</span>
      </div>
      <div class="plan-stat-divider" />
      <div class="plan-stat">
        <span class="plan-stat-value" :style="{ color: deviationRate >= 0 ? '#52C41A' : '#FF4D4F' }">
          {{ deviationRate >= 0 ? '+' : '' }}{{ deviationRate.toFixed(1) }}%
        </span>
        <span class="plan-stat-label">偏差率</span>
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
use([LineChart, TooltipComponent, GridComponent, CanvasRenderer])

const ready = ref(false)
onMounted(() => { ready.value = true })

// 模拟数据：实际完成数量和计划完成数量
const monthlyData = [
  { month: '1月', actual: 14, planned: 15 },
  { month: '2月', actual: 27, planned: 30 },
  { month: '3月', actual: 55, planned: 55 },
  { month: '4月', actual: 80, planned: 80 },
  { month: '5月', actual: 100, planned: 105 },
  { month: '6月', actual: 129, planned: 130 },
  { month: '7月', actual: 155, planned: 155 },
  { month: '8月', actual: 180, planned: 180 },
  { month: '9月', actual: 200, planned: 205 },
  { month: '10月', actual: 230, planned: 230 },
  { month: '11月', actual: 250, planned: 255 },
  { month: '12月', actual: 285, planned: 280 },
]

// 计算累积数据
const cumulativeData = computed(() => {
  let actualSum = 0
  let plannedSum = 0
  return monthlyData.map(item => {
    actualSum += item.actual
    plannedSum += item.planned
    return {
      month: item.month,
      actual: actualSum,
      planned: plannedSum,
      ratio: plannedSum > 0 ? (actualSum / plannedSum) * 100 : 0
    }
  })
})

// 计算到本月的实际累积完成数量
const actualCompleted = computed(() => {
  return cumulativeData.value[cumulativeData.value.length - 1].actual
})

// 计算到本月的计划完成数量
const plannedCompleted = computed(() => {
  return cumulativeData.value[cumulativeData.value.length - 1].planned
})

// 计算偏差率
const deviationRate = computed(() => {
  const actual = actualCompleted.value
  const planned = plannedCompleted.value
  return planned > 0 ? ((actual - planned) / planned) * 100 : 0
})

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
          <span style="font-weight:600;">${p.value.toFixed(1)}%</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 8, right: 10, bottom: 24, left: 40 },
  xAxis: {
    type: 'category',
    data: cumulativeData.value.map(d => d.month),
    axisLine: { lineStyle: { color: '#E8ECF0' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909C', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    min: 70,
    max: 110,
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11, formatter: '{value}%' },
  },
  series: [
    {
      name: '每月累积比例',
      type: 'line',
      data: cumulativeData.value.map(d => d.ratio),
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
.widget-card { height: 100%; max-height: 380px; /* 设置最大高度 */ }
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
