<template>
  <a-card class="widget-card">
    <template #title>
      <span class="widget-title-dot" />成本预算执行
    </template>
    <template #extra>
      <span class="execution-rate">执行率 <strong style="color: #1677FF">{{ executionRate }}%</strong></span>
    </template>

    <div class="budget-overview">
      <div class="budget-item">
        <span class="budget-value total">{{ formatMoney(stats.totalBudget) }}<small>万元</small></span>
        <span class="budget-label">预算总额</span>
      </div>
      <div class="budget-item">
        <span class="budget-value spent">{{ formatMoney(stats.spent) }}<small>万元</small></span>
        <span class="budget-label">已支出</span>
      </div>
      <div class="budget-item">
        <span class="budget-value remaining">{{ formatMoney(stats.remaining) }}<small>万元</small></span>
        <span class="budget-label">剩余预算</span>
      </div>
    </div>

    <div class="progress-area">
      <div class="progress-header">
        <span class="progress-label">预算执行进度</span>
        <span class="progress-value">{{ executionRate }}%</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: executionRate + '%' }" />
          <div class="progress-bar-remaining" :style="{ width: (100 - executionRate) + '%' }" />
        </div>
      </div>
      <div class="progress-tips">
        <span style="color: #1677FF">■ 已支出 {{ formatMoney(stats.spent) }} 万元</span>
        <span style="color: #E8ECF0">■ 剩余 {{ formatMoney(stats.remaining) }} 万元</span>
      </div>
    </div>

    <v-chart v-show="ready" :option="chartOption" autoresize lazy-init style="height: 140px; margin-top: 8px;" />
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useWorkbenchStore } from '@/stores/workbench'

use([LineChart, TooltipComponent, GridComponent, CanvasRenderer])

const store = useWorkbenchStore()
const stats = computed(() => store.budgetStats)
const ready = ref(false)
onMounted(() => { ready.value = true })

const executionRate = computed(() =>
  stats.value.totalBudget > 0
    ? Math.round((stats.value.spent / stats.value.totalBudget) * 100)
    : 0
)

const formatMoney = (val: number) => {
  return (val / 10).toFixed(0)
}

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
          <span style="font-weight:600;">${p.value} 万元</span>
        </div>`
      })
      return str
    },
  },
  grid: { top: 8, right: 10, bottom: 22, left: 46 },
  xAxis: {
    type: 'category',
    data: stats.value.monthlySpent.map(d => d.month),
    axisLine: { lineStyle: { color: '#E8ECF0' } },
    axisTick: { show: false },
    axisLabel: { color: '#86909C', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#F0F2F5', type: 'dashed' } },
    axisLabel: { color: '#86909C', fontSize: 11, formatter: '{value}万' },
  },
  series: [
    {
      name: '月度预算',
      type: 'line',
      data: stats.value.monthlySpent.map(d => (d.budget / 10).toFixed(0)),
      smooth: true,
      lineStyle: { color: '#E0E8F5', width: 2, type: 'dashed' },
      itemStyle: { color: '#E0E8F5' },
      symbol: 'none',
    },
    {
      name: '月度支出',
      type: 'line',
      data: stats.value.monthlySpent.map(d => (d.amount / 10).toFixed(0)),
      smooth: true,
      lineStyle: { color: '#1677FF', width: 2.5 },
      itemStyle: { color: '#1677FF', borderWidth: 3, borderColor: '#fff' },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(22,119,255,0.2)' }, { offset: 1, color: 'rgba(22,119,255,0)' }] },
      },
    },
  ],
}))
</script>

<style scoped>
.widget-card { height: 100%; }
.execution-rate {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.budget-overview {
  display: flex;
  gap: 0;
  margin-bottom: 14px;
  padding: 12px;
  background: linear-gradient(135deg, #F0F6FF 0%, #F8FAFE 100%);
  border-radius: 8px;
}
.budget-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  border-right: 1px solid #E8ECF0;
}
.budget-item:last-child { border-right: none; }
.budget-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}
.budget-value small { font-size: 12px; font-weight: 400; margin-left: 2px; }
.budget-value.total { color: #1D2129; }
.budget-value.spent { color: #1677FF; }
.budget-value.remaining { color: #52C41A; }
.budget-label {
  font-size: 11px;
  color: var(--color-text-tertiary);
}
.progress-area { margin-bottom: 4px; }
.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.progress-label { font-size: 12px; color: var(--color-text-secondary); }
.progress-value { font-size: 12px; font-weight: 600; color: #1677FF; }
.progress-bar-wrap { margin-bottom: 6px; }
.progress-bar-bg {
  height: 12px;
  background: #F0F2F5;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1677FF, #4096FF);
  border-radius: 6px 0 0 6px;
  transition: width 0.8s ease;
}
.progress-bar-remaining {
  height: 100%;
  flex: 1;
}
.progress-tips {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--color-text-tertiary);
}
</style>
